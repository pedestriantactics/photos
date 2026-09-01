import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
    MINIO_ENDPOINT,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
    MINIO_BUCKET
} from '$env/static/private';
import { ServerError } from "$lib/utils/errors"; 

export const s3 = new S3Client({
    endpoint: MINIO_ENDPOINT,
    region: "us-west-2",
    credentials: {
        accessKeyId: MINIO_ACCESS_KEY,
        secretAccessKey: MINIO_SECRET_KEY,
    },
    forcePathStyle: true
});

export const BUCKET_NAME = MINIO_BUCKET;


export async function getPresignedUrl(fileKey: string, expirySecond: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
    })

    return getSignedUrl(s3, command, { expiresIn: 3600 });
}


export async function getBatchPresignedUrls(fileKeys: string[], expirySecond: number = 3600): Promise<Array<PresignUrlFailure | PresignUrlSuccess>> {
    return Promise.all(fileKeys.map(async (fileKey) => {
        try {
            const url = await getPresignedUrl(fileKey, expirySecond);
            return { fileKey, url };
        } catch (error: any) {
            console.error(`Error generator URL for ${fileKey}:`, error);
            return { fileKey, url: null, error: error.message }
        }
    }))
}

export async function uploadFile(fileKey: string, buffer: Buffer, contentType: string) {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
            ContentType: contentType,
            Body: buffer,
        });

        await s3.send(command);

        return await getPresignedUrl(fileKey);

    } catch (error) {
        throw new ServerError("Could not upload the image", error as Error, { "error": error, fileKey, fileLength: buffer.byteLength, contentType });
    }
}

// #region type
type PresignUrlSuccess = {
    fileKey: string,
    url: string,
}

type PresignUrlFailure = {
    fileKey: string,
    url: null,
    error: string,
}
// #endregion

import type { ObjectId } from "mongodb"

declare global {
    namespace DBO {

        /** Represents an uploaded asset stored in object storage. */
        interface Asset {
            /** The unique identifier for the asset */
            _id: ObjectId;
            /** The ID for the user who owns this asset */
            userId: ObjectId;
            /** The original name of the file */
            originalFilename: string;
            /** The size of the asset in bytes */
            fileSize: number;
            /** The height of the image */
            height: number;
            /** The width of the image */
            width: number;
            /** 
             * The key for where the file is stored in object storage
             * This is important since it is used for presiging URL's for asset lookups
             */
            fileKey: string;
            /** The MIME type for the asset */
            mimeType: string;
            /** The name of the bucket this asset is stored at */
            bucket: string;
            /** The date for when the asset was uploaded */
            uploadedAt: Date;
            /** The date when this image was orphaned (soft delete) */
            orphanedAt: Date | null;
            /** The metadata for this image */
            metadata: Metadata;
        }

        interface Metadata {
            /** The title for the image */
            imageTitle: string;


            /** The Date that the image was captured at */
            captureDate: Date | null;
            /** The Make of the camera */
            deviceMake: string | null;
            /** The Model of the camera */
            deviceModel: string | null;
            /** The aperature setting for this photo */
            aperture: number | null;
            /** The shutterSpeed for this photo */
            shutterSpeed: string | null;
            /** The ISO for this photo  */
            iso: number | null;
            /** The focalLength for this photo */
            focalLength: number | null;

            /** The gps coords for this photo */
            gps: GPS | null; 
        }

        interface GPS {
            type: "Point",
            coordinate: [number, number]; // [longitude, latitude]  
        }
    }
}

export { };
import { type } from "arktype";
import { objectId } from "./common";


export namespace PostSchema {
    export const GPS = type({
        type: "'Point'",
        coordinate: ["number", "number"] // [longitude, latitude]
    })

    export const metadata = type({
        /** The title for the image */
        imageTitle: "string",
        /** The Date that the image was captured at */
        captureDate: "Date | null | object",
        /** The Make of the camera */
        deviceMake: "string | null",
        /** The Model of the camera */
        deviceModel: "string | null",
        /** The aperature setting for this photo */
        aperture: "number | null",
        /** The shutterSpeed for this photo */
        shutterSpeed: "string | null",
        /** The ISO for this photo  */
        iso: "number | null",
        /** The focalLength for this photo */
        focalLength: "number | null",

        /** The gps coords for this photo */
        // gps: PostSchema.GPS.or("null"),   
        // gps: GPS.or("null"),
    })

    export const asset = type({
        /** The ID for the asset */
        _id: objectId,
        /** The original name of the file */
        originalFilename: "string",
        /** The size of the asset in bytes */
        fileSize: "number",
        /** The height of the image */
        height: "number",
        /** The width of the image */
        width: "number",
        /** The key for retrieving this asset */
        fileKey: "string",
        /** The MIME type for the asset */
        mimeType: "string",
        /** The name of the bucket this asset is stored at */
        bucket: "string",
        /** The date for when the asset was uploaded */
        uploadedAt: "string",
        /** The date when this image was orphaned (soft delete) */
        orphanedAt: "Date | null",
        /** The metadata for this image */
        metadata: metadata 
    })



    export const post = type({
        /** The id for the post */
        _id: objectId,
        /** The user that the post is bound to */
        userId: objectId,
        /** 
         * The image previews are for the desired image 
         * that the user wants to display on their profile.
         * Users will click on this image and it will 
         * take them to the rest of the gallery
         */
        /** The url for the preview image */
        // previewAssetId: PostSchema.asset,
        previewAsset: PostSchema.asset.pick("fileKey", "width", "height"),
        /** An array of photo objects that are associated with this post */
        assets: PostSchema.asset.array(),

        /** The title for the post */
        title: "string",
        /** The description for the post
         * If used this will appear first in the image slug
         */
        description: "string | null",
        /** The date the the photo shoot took place */
        shootDate: "Date | null",

        /** tags that the user wants to user for this post */
        tags: "string[]",


        /** The date that the post was createed at */
        createdAt: "Date",
        /** The date that the post was updated at */
        updatedAt: "Date",
        /** The date that the post was deleted at */
        deletedAt: "Date | null"
    })

    export const UploadedAsset = type({
        type: "'uploaded'",
        // assetId: type(objectId)
    }).and(asset.pick("_id", "fileKey", "height", "width", "metadata"))

    export const UploadingAsset = type({
        type: "'uploading'",
        // fileData: "Uint8Array",
        fileData: type.instanceOf(Uint8Array),
        url: "string",
    }).and(asset.omit(
        "_id",
        "uploadedAt",
        "fileKey",
        "bucket",
        "orphanedAt"
    ));

    export const UploadPhoto = UploadedAsset.or(UploadingAsset);




    // Used in /create and /edits
    export const EditPost = type({
        userId: type(objectId).or("null"),
        title: "string",
        shootDate: "string",
        description: "string",
        previewAssetId: "string | null",
        assets: UploadPhoto.array(),
    });


    export const Post = type({
        _id: objectId,
        userId: objectId,
        title: "string",
        shootDate: "string",
        description: "string",
        previewAssetId: "string",
        assets: asset.array(),
        // tags: type("string").array,
        createdAt: "Date",
        updatedAt: "Date",
        deletedAt: "Date | null",
    })

    /** This is what is displayed on the portfolio page */
    export const PostDisplay = Post
        .pick("title", "createdAt", "_id")
        .and({
            asset: asset.pick("fileKey", "height", "width")
        })
    
}

export type Metadata = type.infer<typeof PostSchema.metadata>;
export type EditPost = type.infer<typeof PostSchema.EditPost>;
export type UploadingPhoto = type.infer<typeof PostSchema.UploadPhoto>
export type UploadedAsset = type.infer<typeof PostSchema.UploadedAsset>
export type UploadingAsset = type.infer<typeof PostSchema.UploadingAsset>
export type Post = type.infer<typeof PostSchema.Post>;
export type PostDisplay = type.infer<typeof PostSchema.PostDisplay>;
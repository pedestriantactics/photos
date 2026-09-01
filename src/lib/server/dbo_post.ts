import type { Double, ObjectId } from "mongodb";

declare global {
    namespace DBO {
        // **** Post Interfaces **** //

        interface Post {
            /** The id for the post */
            _id: ObjectId,
            /** The user that the post is bound to */
            userId: ObjectId;
            /** The title for the post */
            title: string;
            /** The description for the post
             * If used this will appear first in the image slug
             */
            description: string | null;
            /** The date the the photo shoot took place */
            shootDate: string | null;
            /** 
             * The image previews are for the desired image 
             * that the user wants to display on their profile.
             * Users will click on this image and it will 
             * take them to the rest of the gallery
             */
            /** The url for the preview image */
            previewAssetId: ObjectId;
            /** An array of photo objects that are associated with this post */
            assets: ObjectId[];
            /** tags that the user wants to user for this post */
            tags: string[];

            /** The date that the post was createed at */
            createdAt: Date;
            /** The date that the post was updated at */
            updatedAt: Date;
            /** The date that the post was deleted at */
            deletedAt: Date | null;
        }
    }
}

export { }
import type { ObjectId } from "mongodb";

declare global {
    namespace DBO {
        // **** User Interface **** //

        interface User {
            /** The ObjectId for the user */
            _id: ObjectId;
            /** The displayName for the user */
            displayName: string;
            /** The custom URL for the user */
            url: string;
            /** The email for the user */
            email: string;

            /** The external profiles that the user connects with */
            connections: Connections;

            /** The users about field */
            about: string;

            /** The date when the user was created */
            createdAt: Date;
            /** The date when the user was last updated */
            updatedAt: Date;
            /** The date when the user was deleted */
            deletedAt: Date | null;
        }


        interface Connections {
            /** The users instagram connection if there is any*/
            instagram: string | null;
            /** The users personal website if there is one */
            website: string | null;
        }
    }
}

export { }
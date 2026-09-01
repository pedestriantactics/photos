import type { ObjectId } from "mongodb";


declare global {
    namespace DBO {
        // **** UserSession Interface **** //

        interface UserSession {
            /** The session id for the user session */
            _id: ObjectId;
            /** The userId that this session is bound to */
            userId: ObjectId;

            /** The hashed token for this user session */
            tokenHash: String;
            /** The ipAddress for the requester */
            ipAddress: string,
            /** The user agent for the requester */
            userAgent: string,

            /** The date that this session was created, through a successfull login */
            createdAt: Date,
            /** The last date that this session was used */
            lastUsedAt: Date,
            /** The data for which the session will be expired */
            expiresAt: Date,


            /** The session still exists historically, but cannot be used anymore
             * 
             * - User clicks logout
             * - logout all devices
             * - token rotation
             */
            revokedAt: Date | null;


            /** Database lifecyle/application cleanup state
             * - GDPR/account deletion
             * - cleanup jobs
             * - removing old revoked sessions
             * - admin purging
             * - archival systems
             */
            deletedAt: Date | null,
        }

        interface Requester {

        }
    }
}

export { }
import { ObjectId } from "mongodb";
import { getRequestEvent } from "$app/server";
import { AuthenticationError, DatabaseError } from "$lib/utils/errors";
import { appDb } from "./db";
import crypto from "node:crypto"
import { throwAppError } from "./error-handling";


/**
 * This will check if the user is currently logged in and will return the user info
 * @param event 
 * @returns 
 */
export async function getAuthorizedSessionId(httpError: boolean = false): Promise<string> {
    const event = getRequestEvent();
    if (!event.cookies.get("session")) {
        throwAppError(
            new AuthenticationError("You must be authenticated to perform this action", httpError),
            httpError
        );
    }

    return String(event.cookies.get("session"));
}


export async function getAuthorizedUserSession<K extends keyof DBO.UserSession>(projection: { [key in K]?: 1 }, httpError: boolean = false) {
    type UserSessionSubset = Pick<DBO.UserSession, "userId" | K>;

    // Gets the sessionId from cookies and casts it to an ObjectId
    const session = await getAuthorizedSessionId(httpError);
    const [sessionId, token] = session.split('.')

    const fullProjection = {
        userId: 1,
        ...projection
    } as const;

    if (!ObjectId.isValid(sessionId)) {
        throwAppError(new AuthenticationError('Invalid Session', httpError), httpError);
    }

    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Queries the DB for the userSession
    const userSession = await appDb.userSessions.findOne(
        { 
            _id: new ObjectId(sessionId),
            tokenHash,
            revokedAt: null,
            deletedAt: null,
            expiresAt: { $gt: new Date() }
        }, 
        { 
            projection: fullProjection 
        }
    ) as UserSessionSubset | null;

    if (!userSession) {
        throwAppError(new AuthenticationError("Failed to find the user session", httpError), httpError);
    }

    return userSession;
}


// TODO THIS IS HALF BUILT
export async function getAuthorizedUser<K extends keyof DBO.User>(projection: { [key in K]?: 1 }, httpError: boolean = false) {
    type UserSubset = Pick<DBO.User, "_id"> & Pick<DBO.User, K>;

    const session = await getAuthorizedUserSession({ userId: 1 }, httpError);


    if (!session || !session.userId) {
        throwAppError(new AuthenticationError("This session is not associated with a shop", httpError), httpError);
    }

    const user = await appDb.users.findOne({ _id: session.userId }, { projection }) as UserSubset | null;

    if (!user) {
        throwAppError(new AuthenticationError("Failed to find the shop associated with this session", httpError), httpError);
    }

    return user as UserSubset;
}






/**
 * Finds the user attached to the current session
 * @param session 
 * @returns 
 */
export async function findUserForSession(session: string) {

    // Query the database for the session
    const sessionDoc = await appDb.userSessions.findOne({ _id: new ObjectId(session) });


    // If the session is invalid or there is no userId then throw an error
    if (!sessionDoc || !sessionDoc.userId) {
        throw new Error("Session not found");
    }

    // Query the database to find the user
    const user = await appDb.users.findOne({ _id: new ObjectId(sessionDoc.userId) });

    // If the user does not exist throw an error
    if (!user) {
        throw new DatabaseError("Failed to find the user associated with this session. Please try again later");
    }

    return user;
}

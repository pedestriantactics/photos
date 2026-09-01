// import { MongoClient } from "mongodb";
// import { env } from "$env/dynamic/private";

// declare global {
//     var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// let clientPromise: Promise<MongoClient>;

// export async function getDb() {
//     if (!globalThis._mongoClientPromise) {
//         if (!env.DATABASE_URL) throw new Error("DATABASE_URL not set"); // now runtime only
//         const client = new MongoClient(env.DATABASE_URL);
//         globalThis._mongoClientPromise = client.connect();
//     }
//     clientPromise = globalThis._mongoClientPromise!;
//     const client = await clientPromise;
//     return client.db(); // optionally specify DB name
// }


import { ClientSession, Collection, MongoClient, type IndexDescription } from "mongodb";
// import { sentry } from "$lib/server/sentry";
// import { deepEqual }
import { env } from "$env/dynamic/private";
import { DatabaseError } from "$lib/utils/errors";

const DATABASE_URL = env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new DatabaseError("Missing DATABASE_URL MongoDB connection string");
}

// Find the database name either directly from DATABASE_NAME, the
// path segment of the DATABASE_URL, or default to photoclub
const DATABASE_NAME =
    env.DATABASE_NAME ||
    new URL(DATABASE_URL).pathname.replace(/^\//, "") ||
    "photoclub";

const client = new MongoClient(DATABASE_URL);

// Cleanly closes the connection when `Ctrl+C` in term
process.once("SIGINT", () => client.close());
// Cleanly closed the connection when Docker wants to stop
process.once("SIGTERM", () => client.close());

client.on("error", (err) => {
    console.error(err);
    // sentry.captureException(err);
})

// Connect to the database
await client.connect();

const db = client.db(DATABASE_NAME);

/** Creates types collection map useing the given DB instance */
export function createCollectionMap(dbInstance: typeof db) {
    return {
        users: dbInstance.collection<DBO.User>("users"),
        userSessions: dbInstance.collection<DBO.UserSession>("userSessions"),
        posts: dbInstance.collection<DBO.Post>("posts"),
        assets: dbInstance.collection<DBO.Asset>("assets"),
    } as const;
}

export const appDb = createCollectionMap(db);


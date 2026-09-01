import { type } from "arktype";

/**
 * Pattern matches MongoDB ObjectId strings.
 */
export const objectId = type(/^[0-9a-fA-F]{24}$/).describe("a valid ID");
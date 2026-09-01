import { type } from "arktype"
import { objectId } from "./common";

export namespace UserSchema {

    /** The user creation schema */
    export const createUser = type({
        /** The displayName for the user */
        displayName: "string",

        /** The email for the user */
        email: "string",
    })

    
    export const user = createUser.and({
        /** The ObjectId for the user */
        _id: objectId,

        /** The custom URL for the user */
        url: "string",

        /** The profiles tha the user embeds */
        connections: type({
            instagram: "string | null",
            website: "string | null"
        }).or("undefined"),

        /** The about settings for users */
        about: "string",

        /** The date when the user was created */
        createdAt: "Date",
        /** The date when the user was last updated */
        updatedAt: "Date",
        /** The date when the user was deleted */
        deletedAt: "Date | null",
    })



    export const editUser =  UserSchema.user.pick(
        "url",
        "displayName",
        "email",
        "about",
        "connections",
    )
}

export type CreateUserForm = type.infer<typeof UserSchema.createUser>;
export type UserForm = type.infer<typeof UserSchema.user>;
export type UserEditForm = type.infer<typeof UserSchema.editUser>;
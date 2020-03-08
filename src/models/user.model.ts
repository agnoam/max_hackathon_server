import { Document, Model, model, Schema, HookNextFunction, Error } from "mongoose";
import { CollectionsNames } from "../utils/consts";

export const userDefaultImage: string = 
    "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png";

export interface IUser extends Document {
    username: string;
    password: string;
    accountIds: string[];
    email: string;
    name: string;
    profileImage: string;
    lastConnected: number;
}

const UserSchema: Schema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    profileImage: { type: String, default: userDefaultImage },
    lastConnected: { type: Number, default: Date.now },
    accountIds: { type: [ String ] } // [ String ] is array of Strings definition
}, { collection: CollectionsNames.Users });

/* pre functions */
UserSchema.pre<IUser>('save', async (next: HookNextFunction) => {
    try {
        // Use any model controller for doing some stuff before save this document
        next();
    } catch(e) {
        const ex: MongoDbEx = e;
        return next(ex);
    }
});

export const UserModel: Model<IUser> = model<IUser>(CollectionsNames.Users, UserSchema);

interface MongoDbEx {
    code: number;
    driver: boolean;
    errmsg: string;
    index: string;
    message: string;
    name: string;
    stack: string;
}
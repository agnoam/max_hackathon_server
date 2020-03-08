import { Document, Model, model, Schema, HookNextFunction, Types } from "mongoose";
import { CollectionsNames, Category } from "../utils/consts";

export interface IAccount extends Document {
    id: string;
    balance: number;
    secretCode: string;
    transactionIds: Types.ObjectId[];
}

const AccountSchema: Schema = new Schema<IAccount>({
    id: { type: String, required: true, unique: true },
    balance: { type: Number, required: true },
    secretCode: { type: String, required: true },
    transactionIds: { type: [ Types.ObjectId ] },
}, { collection: CollectionsNames.Accounts, _id: false });

/* pre functions */
AccountSchema.pre<IAccount>('save', async (next: HookNextFunction) => {
    try {
        // Use any model controller for doing some stuff before save this document
        next();
    } catch(ex) {
        return next(ex);
    }
});

export const UserModel: Model<IAccount> = model<IAccount>(CollectionsNames.Accounts, AccountSchema);
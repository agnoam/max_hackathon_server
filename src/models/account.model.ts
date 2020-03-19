import { Document, Model, model, Schema, HookNextFunction, Types } from "mongoose";
import { CollectionsNames, Category } from "../utils/consts";

export interface IAccount extends Document {
    balance: number;
    pinCode: string;
    transactionIds: String;
    // currency: // todo: enum ils euro us dollar required 
}

// todo: messages : numericid:number increment required

const AccountSchema: Schema = new Schema<IAccount>({
    balance: { type: Number, required: true },
    pinCode: { type: String, required: true }
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

export const AccountModel: Model<IAccount> = model<IAccount>(CollectionsNames.Accounts, AccountSchema);
import { Document, Model, model, Schema, HookNextFunction, Types } from "mongoose";
import { CollectionsNames, Category } from "../utils/consts";

export interface ITransaction extends Document {
    id: Types.ObjectId;
    srcAcc: string; // ID of the source account
    destAcc: string; // ID of the destination account
    category: Category[];
    amount: number;
}

const TransactionSchema: Schema = new Schema<ITransaction>({
    id: { type: Types.ObjectId, required: true, unique: true },
    srcAcc: { type: String, required: true },
    destAcc: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: [ Category ], default: [Category.Transaction] }
}, { collection: CollectionsNames.Transactions, _id: false });

/* pre functions */
TransactionSchema.pre<ITransaction>('save', async (next: HookNextFunction) => {
    try {
        // Use any model controller for doing some stuff before save this document
        next()
    } catch(ex) {
        return next(ex);
    }
});

export const UserModel: Model<ITransaction> = model<ITransaction>(CollectionsNames.Transactions, TransactionSchema);
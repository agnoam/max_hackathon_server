import { Document, Model, model, Schema, HookNextFunction } from "mongoose";
import { CollectionsNames, Category } from "../utils/consts";

export interface ITransaction extends Document {
    srcAcc:   string; // ID of the source account
    destAcc:  string; // ID of the destination account
    category: Category[];
    amount:   number;
}

const TransactionSchema: Schema = new Schema<ITransaction>({
    srcAcc:   { type: String, required: true },
    destAcc:  { type: String, required: true },
    category: { type: [ String ], default: [Category.Transaction] },
    amount:   { type: Number, required: true }
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

export const TransactionModel: Model<ITransaction> = 
    model<ITransaction>(CollectionsNames.Transactions, TransactionSchema);
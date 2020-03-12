import { Document, Model, model, Schema, HookNextFunction, Types } from "mongoose";
import { CollectionsNames, Category } from "../utils/consts";

export interface IExpenseVault extends Document {
    accountId:   Types.ObjectId;
    amount:      Number;
    expDate:     Number;
    desc:        String;
    priorityLev: Priority;
}

export enum Priority {
    Low,
    Medium,
    High,
    Urgent
};

const ExpenseVaultModel: Schema = new Schema<IExpenseVault>({
    accountId:   { type: Types.ObjectId, required: true },
    amount:      { type: Number, required: true },
    expDate:     { type: Number, required: true },
    desc:        { type: String, required: true },
    priorityLev: { type: Priority, required: true },
}, { collection: CollectionsNames.ExpenseVault, _id: false });

/* pre functions */
ExpenseVaultModel.pre<IExpenseVault>('save', async (next: HookNextFunction) => {
    try {
        // Use any model controller for doing some stuff before save this document
        next();
    } catch(ex) {
        return next(ex);
    }
});

export const AccountModel: Model<IExpenseVault> = model<IExpenseVault>(CollectionsNames.ExpenseVault, ExpenseVaultModel);
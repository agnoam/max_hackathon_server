import { Document, Model, model, Schema, HookNextFunction, Types } from "mongoose";
import { CollectionsNames, Category } from "../utils/consts";

// One day in ms
const dayInMs: number = 1000 * 60 * 60 * 24;
const defaultExpTime: number = dayInMs * 30;

export interface IExpenseVault extends Document {
    accountId: Types.ObjectId;
    amount: number;
    expDate: number;
    desc: string;
    priorityLev: Priority;
}

export enum Priority {
    Low = 'low',
    Medium = 'medium',
    High = 'high'
}

const ExpenseVaultModel: Schema = new Schema<IExpenseVault>({
    accountId:   { type: Types.ObjectId, required: true },
    amount:      { type: Number, required: true },
    expDate:     { type: Number, required: true, default: Date.now() + defaultExpTime },
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

export const AccountModel: Model<IExpenseVault> = model<IExpenseVault>(
    CollectionsNames.ExpenseVault, 
    ExpenseVaultModel
);
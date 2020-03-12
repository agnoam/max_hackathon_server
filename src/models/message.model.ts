import { Document, Model, model, Schema, HookNextFunction, Types } from "mongoose";
import { CollectionsNames } from "../utils/consts";

export interface IMessage extends Document {
    dest: string; // Username
    read: boolean;
    body: string;
    title: string;
    action: Action;
    amount?: number;
    messageSrc?: string; // Username || "BANK"
}

export enum Action {
    MoneyTransfer = 'Transfer',
    Info = 'info'
}

const MessageSchema: Schema = new Schema<IMessage>({
    dest: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    action: { type: String, default: Action.Info.toString() },
    amount: { type: Number, required: false },
    messageSrc: { type: String, required: false },
    read: { type: Boolean, default: false }
}, { collection: CollectionsNames.Messages });

/* pre functions */
MessageSchema.pre<IMessage>('save', async (next: HookNextFunction) => {
    try {
        // Use any model controller for doing some stuff before save this document
        next();
    } catch(ex) {
        return next(ex);
    }
});

export const MessageModel: Model<IMessage> = model<IMessage>(CollectionsNames.Messages, MessageSchema);
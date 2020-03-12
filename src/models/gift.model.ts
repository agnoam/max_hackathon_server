import { Document, Model, model, Schema, HookNextFunction, Types } from "mongoose";
import { CollectionsNames, Category } from "../utils/consts";

export interface IGift extends Document {
    id: Types.ObjectId;
    price: number;
    category: Category[];
    expDate: number;
    title: string;
    quantity: number;
    usedGifts: number; // Used gifts from the quantity
    description: string;
    coverPicture: string;
}

const GiftSchema: Schema = new Schema<IGift>({
    id: { auto: true, required: true },
    price: { type: Number, required: true },
    category: { type: [String], required: true },
    expDate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    usedGifts: { type: Number, required: true},
    description: { type: String },
    coverPicture: { type: String }
}, { collection: CollectionsNames.Gifts, _id: false });

/* pre functions */
GiftSchema.pre<IGift>('save', async (next: HookNextFunction) => {
    try {
        // Use any model controller for doing some stuff before save this document
        next()
    } catch(ex) {
        return next(ex);
    }
});

export const TransactionModel: Model<IGift> = 
    model<IGift>(CollectionsNames.Gifts, GiftSchema);
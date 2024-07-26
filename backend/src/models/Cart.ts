//src/models/Cart.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICart extends Document {
  customer: mongoose.Types.ObjectId;
  products: Array<{ product: mongoose.Types.ObjectId; quantity: number }>;
}

const CartSchema: Schema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

export default mongoose.model<ICart>('Cart', CartSchema);
//src/models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId;
  admin: mongoose.Types.ObjectId;
  products: Array<{ product: mongoose.Types.ObjectId; quantity: number }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

const OrderSchema: Schema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
//src/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  admin: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
});

export default mongoose.model<IProduct>('Product', ProductSchema);

//UPDATE IF NEED REQUIRE
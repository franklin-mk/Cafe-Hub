//src/models/RatingReview.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRatingReview extends Document {
  customer: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  review: string;
}

const RatingReviewSchema: Schema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IRatingReview>('RatingReview', RatingReviewSchema);
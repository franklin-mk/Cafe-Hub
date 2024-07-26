//src/models/Customer.ts
import mongoose, { Schema } from 'mongoose';
import { ICustomer } from '../interfaces';

const CustomerSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
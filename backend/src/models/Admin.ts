//src/models/Admin.ts
import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../interfaces';

const AdminSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  cafeteria: { type: String, required: true },
});

export default mongoose.model<IAdmin>('Admin', AdminSchema);
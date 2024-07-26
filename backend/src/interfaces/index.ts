//src/interfaces/index.ts
import { Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  cafeteria: string;
}

export interface ICustomer extends Document {
  email: string;
  password: string;
  name: string;
}
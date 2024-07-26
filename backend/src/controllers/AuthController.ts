//src/controllers/AuthController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import Admin from '../models/Admin';
import Customer from '../models/Customer';
import { IAdmin, ICustomer } from '../interfaces';
import { Model, Document } from 'mongoose';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, cafeteria } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === 'admin') {
      user = new Admin({ email, password: hashedPassword, name, cafeteria });
    } else {
      user = new Customer({ email, password: hashedPassword, name });
    }

    await user.save();
    res.status(201).json({ message: 'USER registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    let user: IAdmin | ICustomer | null;
    
    if (role === 'admin') {
      user = await Admin.findOne({ email }).exec();
    } else {
      user = await Customer.findOne({ email }).exec();
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user._id,
      role,
      cafeteria: role === 'admin' ? (user as IAdmin).cafeteria : undefined
    };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role, cafeteria: payload.cafeteria } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

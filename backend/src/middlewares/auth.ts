//src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAdmin, ICustomer } from '../interfaces';

interface AuthRequest extends Request {
  user?: IAdmin | ICustomer;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as (IAdmin | ICustomer);
    req.user = decoded;
    console.log('Authenticated user:', req.user); // Add this line for debugging
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log('User in isAdmin:', req.user); // Add this line for debugging
  if (req.user && 'cafeteria' in req.user) {
    next();
  } else {
    res.status(403).send({ error: 'Access denied. Admin only.' });
  }
};
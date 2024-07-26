//src/controllers/CartController.ts
import { Request, Response } from 'express';
import Cart from '../models/Cart';
import { ICustomer } from '../interfaces';

export const getCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user as ICustomer;
    let cart = await Cart.findOne({ customer: user.id }).populate('products.product');
    if (!cart) {
      cart = new Cart({ customer: user.id, products: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user as ICustomer;
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ customer: user.id });
    if (!cart) {
      cart = new Cart({ customer: user.id, products: [] });
    }
    const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user as ICustomer;
    const { productId } = req.params;
    const cart = await Cart.findOne({ customer: user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error });
  }
};
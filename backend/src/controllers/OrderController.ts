//src/controllers/OrderController.ts
import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { ICustomer, IAdmin } from '../interfaces';

export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user as ICustomer;
    const { products } = req.body;
    
    const firstProduct = await Product.findById(products[0].product).populate('admin');
    if (!firstProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = new Order({
      ...req.body,
      customer: user.id,
      admin: firstProduct.admin._id
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

export const getAdminOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user as IAdmin;
    const orders = await Order.find({ admin: user.id }).populate('products.product customer');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user as ICustomer;
    const orders = await Order.find({ customer: user.id }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};
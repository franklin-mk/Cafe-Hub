//src/controllers/ProductControllers.ts
import { Request, Response } from 'express';
import Product from '../models/Product';
import { IAdmin } from '../interfaces';
import { cloudinary } from '../config/cloudinary';

export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user as IAdmin;
    if (!('cafeteria' in user)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.path : '';

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      admin: user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updates = { ...req.body };
    if (req.file) {
      updates.image = req.file.path;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete image from Cloudinary
    if (product.image) {
      const publicId = product.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Keep getProducts as it is

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};



/* import { Request, Response } from 'express';
import Product from '../models/Product';
import { IAdmin, ICustomer } from '../interfaces';

export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user as IAdmin;
    if (!('cafeteria' in user)) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const product = new Product({
      ...req.body,
      admin: user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);  // Add this line for debugging
    res.status(500).json({ message: 'Error creating product', error });
  }
};



export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
}; */

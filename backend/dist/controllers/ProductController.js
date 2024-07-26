"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const cloudinary_1 = require("../config/cloudinary");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        if (!('cafeteria' in user)) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        const { name, description, price, category } = req.body;
        const image = req.file ? req.file.path : '';
        const product = new Product_1.default({
            name,
            description,
            price,
            image,
            category,
            admin: user.id
        });
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const updates = Object.assign({}, req.body);
        if (req.file) {
            updates.image = req.file.path;
        }
        const product = yield Product_1.default.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const product = yield Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Delete image from Cloudinary
        if (product.image) {
            const publicId = (_a = product.image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
            if (publicId) {
                yield cloudinary_1.cloudinary.uploader.destroy(publicId);
            }
        }
        yield Product_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});
exports.deleteProduct = deleteProduct;
// Keep getProducts as it is
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});
exports.getProducts = getProducts;
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

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
exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        let cart = yield Cart_1.default.findOne({ customer: user.id }).populate('products.product');
        if (!cart) {
            cart = new Cart_1.default({ customer: user.id, products: [] });
            yield cart.save();
        }
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        const { productId, quantity } = req.body;
        let cart = yield Cart_1.default.findOne({ customer: user.id });
        if (!cart) {
            cart = new Cart_1.default({ customer: user.id, products: [] });
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        }
        else {
            cart.products.push({ product: productId, quantity });
        }
        yield cart.save();
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error });
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        const { productId } = req.params;
        const cart = yield Cart_1.default.findOne({ customer: user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        yield cart.save();
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error });
    }
});
exports.removeFromCart = removeFromCart;

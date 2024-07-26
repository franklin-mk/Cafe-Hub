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
exports.updateOrderStatus = exports.getOrders = exports.getAdminOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        const { products } = req.body;
        const firstProduct = yield Product_1.default.findById(products[0].product).populate('admin');
        if (!firstProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const order = new Order_1.default(Object.assign(Object.assign({}, req.body), { customer: user.id, admin: firstProduct.admin._id }));
        yield order.save();
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
});
exports.createOrder = createOrder;
const getAdminOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        const orders = yield Order_1.default.find({ admin: user.id }).populate('products.product customer');
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});
exports.getAdminOrders = getAdminOrders;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        const orders = yield Order_1.default.find({ customer: user.id }).populate('products.product');
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});
exports.getOrders = getOrders;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { status } = req.body;
        const order = yield Order_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
});
exports.updateOrderStatus = updateOrderStatus;

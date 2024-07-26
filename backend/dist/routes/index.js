"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//routes/index.ts
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const orderRoutes_1 = __importDefault(require("./orderRoutes"));
const cartRoutes_1 = __importDefault(require("./cartRoutes"));
const ratingReviewRoutes_1 = __importDefault(require("./ratingReviewRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/products', productRoutes_1.default);
router.use('/orders', orderRoutes_1.default);
router.use('/cart', cartRoutes_1.default);
router.use('/ratings-reviews', ratingReviewRoutes_1.default);
exports.default = router;

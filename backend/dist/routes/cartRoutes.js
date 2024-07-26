"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//routes/cartRoutes.ts
const express_1 = require("express");
const CartController_1 = require("../controllers/CartController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, CartController_1.getCart);
router.post('/add', auth_1.authenticate, CartController_1.addToCart);
router.delete('/remove/:productId', auth_1.authenticate, CartController_1.removeFromCart);
exports.default = router;

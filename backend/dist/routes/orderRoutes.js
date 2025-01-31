"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/orderRoutes.ts
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, OrderController_1.createOrder);
router.get('/', auth_1.authenticate, OrderController_1.getOrders);
router.get('/admin', auth_1.authenticate, auth_1.isAdmin, OrderController_1.getAdminOrders);
router.put('/:id/status', auth_1.authenticate, auth_1.isAdmin, OrderController_1.updateOrderStatus);
exports.default = router;

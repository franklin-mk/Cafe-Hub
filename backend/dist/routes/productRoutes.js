"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/productsRoutes.ts
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const auth_1 = require("../middlewares/auth");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
router.get('/', ProductController_1.getProducts);
router.post('/', auth_1.authenticate, auth_1.isAdmin, upload_1.default.single('image'), ProductController_1.createProduct);
router.put('/:id', auth_1.authenticate, auth_1.isAdmin, upload_1.default.single('image'), ProductController_1.updateProduct);
router.delete('/:id', auth_1.authenticate, auth_1.isAdmin, ProductController_1.deleteProduct);
exports.default = router;

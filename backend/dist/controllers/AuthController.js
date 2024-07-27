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
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const Admin_1 = __importDefault(require("../models/Admin"));
const Customer_1 = __importDefault(require("../models/Customer"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, role, cafeteria } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        let user;
        if (role === 'admin') {
            user = new Admin_1.default({ email, password: hashedPassword, name, cafeteria });
        }
        else {
            user = new Customer_1.default({ email, password: hashedPassword, name });
        }
        yield user.save();
        res.status(201).json({ message: 'USER registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role } = req.body;
        let user;
        if (role === 'admin') {
            user = yield Admin_1.default.findOne({ email }).exec();
        }
        else {
            user = yield Customer_1.default.findOne({ email }).exec();
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = {
            id: user._id,
            role,
            cafeteria: role === 'admin' ? user.cafeteria : undefined
        };
        const token = jsonwebtoken_1.default.sign(payload, config_1.default.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, email: user.email, name: user.name, role, cafeteria: payload.cafeteria } });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.login = login;

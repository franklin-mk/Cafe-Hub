"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Increase payload size limit
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
mongoose_1.default.connect(config_1.default.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB ATLAS'))
    .catch((error) => console.error('MongoDB connection error:', error));
app.use('/api', routes_1.default);
app.listen(config_1.default.PORT, () => {
    console.log(`Server is running on port ${config_1.default.PORT}`);
});

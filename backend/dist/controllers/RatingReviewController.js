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
exports.getRatingReviews = exports.createRatingReview = void 0;
const RatingReview_1 = __importDefault(require("../models/RatingReview"));
const createRatingReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = req.user;
        const ratingReview = new RatingReview_1.default(Object.assign(Object.assign({}, req.body), { customer: user.id }));
        yield ratingReview.save();
        res.status(201).json(ratingReview);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating rating/review', error });
    }
});
exports.createRatingReview = createRatingReview;
const getRatingReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const ratingReviews = yield RatingReview_1.default.find({ product: productId }).populate('customer', 'name');
        res.json(ratingReviews);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching rating/reviews', error });
    }
});
exports.getRatingReviews = getRatingReviews;

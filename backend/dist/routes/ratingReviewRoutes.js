"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/ratingReviewRoutes.ts
const express_1 = require("express");
const RatingReviewController_1 = require("../controllers/RatingReviewController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticate, RatingReviewController_1.createRatingReview);
router.get('/:productId', RatingReviewController_1.getRatingReviews);
exports.default = router;

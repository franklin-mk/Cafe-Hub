//src/controllers/RatingReviewController.ts
import { Request, Response } from 'express';
import RatingReview from '../models/RatingReview';
import { ICustomer } from '../interfaces';

export const createRatingReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = req.user as ICustomer;
    const ratingReview = new RatingReview({ ...req.body, customer: user.id });
    await ratingReview.save();
    res.status(201).json(ratingReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating rating/review', error });
  }
};

export const getRatingReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const ratingReviews = await RatingReview.find({ product: productId }).populate('customer', 'name');
    res.json(ratingReviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rating/reviews', error });
  }
};
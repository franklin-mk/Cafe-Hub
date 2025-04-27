import React from 'react';
import { Card, CardContent, Typography, Rating, Divider } from '@mui/material';

const ReviewList = ({ reviews }) => (
  <Card>
    {reviews.map((review, index) => (
      <React.Fragment key={review._id}>
        <CardContent>
          <Typography variant="h6">{review.customer.name}</Typography>
          <Rating name={`rating-${review._id}`} value={review.rating} readOnly />
          <Typography variant="body1">{review.review}</Typography>
        </CardContent>
        {index < reviews.length - 1 && <Divider />}
      </React.Fragment>
    ))}
  </Card>
);

export default ReviewList;

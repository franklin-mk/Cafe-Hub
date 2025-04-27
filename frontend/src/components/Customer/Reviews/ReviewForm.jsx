import React from 'react';
import { TextField, Button, Rating } from '@mui/material';

const ReviewForm = ({ rating, setRating, review, setReview, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Rating
      name="rating"
      value={rating}
      onChange={(e, newValue) => setRating(newValue)}
    />
    <TextField
      label="Review"
      multiline
      rows={4}
      value={review}
      onChange={(e) => setReview(e.target.value)}
      fullWidth
      margin="normal"
    />
    <Button type="submit" variant="contained" color="primary">
      Submit Review
    </Button>
  </form>
);

export default ReviewForm;

const asyncHandler = require('../utils/asyncHandler');
const Review = require('../models/Review');

const createReview = asyncHandler(async (req, res) => {
    const { bookId, rating, reviewText } = req.body;

    const review = await Review.create({
        bookId,
        userId: req.user._id,
        rating,
        reviewText,
    });

    res.status(201).json(review);
});

const updateReview = asyncHandler(async (req, res) => {
    const { rating, reviewText } = req.body;
    const review = await Review.findById(req.params.id);

    if (review) {
        if (review.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this review');
        }

        review.rating = rating || review.rating;
        review.reviewText = reviewText || review.reviewText;

        const updatedReview = await review.save();
        res.json(updatedReview);
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (review) {
        if (review.userId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this review');
        }

        await Review.deleteOne({ _id: req.params.id });
        res.json({ message: 'Review removed' });
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

module.exports = {
    createReview,
    updateReview,
    deleteReview,
};
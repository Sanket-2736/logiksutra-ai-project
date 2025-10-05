const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: 1,
            max: 5,
        },
        reviewText: {
            type: String,
            required: [true, 'Please provide review text'],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
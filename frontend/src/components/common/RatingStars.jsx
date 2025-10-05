import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating }) => {
    // Ensure rating is treated as a number
    const numericRating = Number(rating);
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center space-x-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className="text-yellow-400 fill-yellow-400 h-4 w-4" />
            ))}
            {hasHalfStar && <StarHalf className="text-yellow-400 fill-yellow-400 h-4 w-4" />}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} className="text-gray-300 h-4 w-4" />
            ))}
            <span className="ml-2 text-sm font-semibold text-gray-700">
                {numericRating > 0 ? numericRating.toFixed(1) : 'No Rating'}
            </span>
        </div>
    );
};

export default RatingStars;

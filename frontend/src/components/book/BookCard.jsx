import React from 'react';
import { useNavigate } from 'react-router-dom';
import RatingStars from '../common/RatingStars.jsx';

const BookCard = ({ book }) => {
    const navigate = useNavigate();
    
    // Default to 0 if averageRating is not calculated/present
    const rating = book.averageRating || 0; 
    const numReviews = book.numReviews || 0;

    return (
        <div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer flex flex-col justify-between"
            onClick={() => navigate(`/book/${book._id}`)}
        >
            <div>
                <h3 className="text-xl font-bold text-indigo-800 mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 text-sm italic mb-3 line-clamp-1">by {book.author}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                        {book.genre}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full">
                        {book.publishedYear}
                    </span>
                </div>

                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {book.description}
                </p>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
                <RatingStars rating={rating} />
                <p className="text-xs text-gray-400 mt-1">{numReviews} Reviews</p>
            </div>
        </div>
    );
};

export default BookCard;

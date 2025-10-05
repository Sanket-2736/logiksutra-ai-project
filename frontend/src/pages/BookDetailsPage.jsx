import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Loader2, Trash2, Pencil } from 'lucide-react';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';
import RatingStars from '../components/common/RatingStars';
import FormMessage from '../components/common/FormMessage';

const BookDetailsPage = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Review State
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [reviewMessage, setReviewMessage] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);

    const fetchBook = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get(`/books/${id}`);
            setBookData(data);
        } catch (err) {
            setError('Book not found or an error occurred while fetching details.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBook();
    }, [fetchBook]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewMessage(null);
        setReviewLoading(true);
        if (!isAuthenticated) return setReviewMessage({ type: 'error', text: 'Please log in to submit a review.' });
        if (!reviewText) return setReviewMessage({ type: 'error', text: 'Review text cannot be empty.' });

        try {
            await api.post('/reviews', {
                bookId: id,
                rating: rating,
                reviewText: reviewText,
            });
            setReviewText('');
            setRating(5);
            setReviewMessage({ type: 'success', text: 'Review submitted successfully!' });
            fetchBook(); // Refresh data
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to submit review.';
            setReviewMessage({ type: 'error', text: errorMsg });
        } finally {
            setReviewLoading(false);
        }
    };

    const handleReviewDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviewMessage({ type: 'success', text: 'Review deleted successfully!' });
            fetchBook(); // Refresh data
        } catch (err) {
            setReviewMessage({ type: 'error', text: 'Failed to delete review.' });
        }
    };

    const handleBookDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this book? This action is irreversible.')) return;
        try {
            await api.delete(`/books/${id}`);
            navigate('/');
        } catch (err) {
            setError('Failed to delete book. You might not be the owner.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600 font-medium bg-red-50 rounded-lg m-10">{error}</div>;
    }

    const book = bookData.book;
    const reviews = bookData.reviews;
    const averageRating = bookData.averageRating;
    const isBookOwner = user && book.addedBy?._id === user._id;
    const userReview = reviews.find(r => r.userId._id === user?._id);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 mb-10">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-indigo-800 mb-2">{book.title}</h1>
                        <h2 className="text-xl text-gray-600 font-medium italic">by {book.author}</h2>
                    </div>
                    {isBookOwner && (
                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate(`/edit-book/${book._id}`)}
                                className="flex items-center text-sm px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-md"
                            >
                                <Pencil className="w-4 h-4 mr-1" /> Edit
                            </button>
                            <button
                                onClick={handleBookDelete}
                                className="flex items-center text-sm px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">{book.description}</p>
                        
                        <div className="flex flex-wrap gap-4 items-center border-t pt-4">
                            <span className="text-sm font-semibold text-gray-700">Genre: <span className="font-normal text-indigo-600">{book.genre}</span></span>
                            <span className="text-sm font-semibold text-gray-700">Published: <span className="font-normal text-indigo-600">{book.publishedYear}</span></span>
                            <span className="text-sm font-semibold text-gray-700 flex items-center">
                                <User className="w-4 h-4 mr-1 text-indigo-600" /> Added by: <span className="font-normal ml-1 text-indigo-600">{book.addedBy?.name || 'Unknown'}</span>
                            </span>
                        </div>
                    </div>
                    
                    <div className="p-6 bg-indigo-50 rounded-xl shadow-inner flex flex-col items-center justify-center">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Average Rating</p>
                        <p className="text-6xl font-bold text-indigo-800 mb-3">
                            {averageRating}
                        </p>
                        <RatingStars rating={averageRating} />
                        <p className="text-sm text-gray-500 mt-2">based on {reviews.length} reviews</p>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                    User Reviews ({reviews.length})
                </h3>

                <FormMessage type={reviewMessage?.type} message={reviewMessage?.text} />
                
                {/* Add Review Form */}
                {isAuthenticated && !userReview && !isBookOwner && (
                    <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-indigo-50 rounded-lg shadow-inner">
                        <h4 className="text-xl font-semibold text-indigo-700 mb-4">Leave Your Review</h4>
                        <div className="flex items-center space-x-4 mb-4">
                            <label className="text-gray-700 font-medium">Rating:</label>
                            <select
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                        </div>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows="3"
                            placeholder="Share your thoughts on this book..."
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                        ></textarea>
                        <button
                            type="submit"
                            disabled={reviewLoading}
                            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-md disabled:bg-indigo-400 disabled:cursor-wait flex items-center"
                        >
                            {reviewLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Submit Review'}
                        </button>
                    </form>
                )}

                {/* Review List */}
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review this book!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review._id} className="border-b pb-4 last:border-b-0">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <p className="font-semibold text-gray-800">{review.userId.name}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <RatingStars rating={review.rating} />
                                        {(user && review.userId._id === user._id) && (
                                            <button 
                                                onClick={() => handleReviewDelete(review._id)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Delete Review"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 ml-6 mt-1">{review.reviewText}</p>
                                <p className="text-xs text-gray-400 mt-2 ml-6">
                                    Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage;

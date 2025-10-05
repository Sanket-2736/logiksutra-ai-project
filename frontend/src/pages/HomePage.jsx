import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import api from '../api/axios.js'; // Added .js extension
import BookCard from '../components/book/BookCard.jsx'; // Added .jsx extension
import Pagination from '../components/common/Pagination.jsx'; // Added .jsx extension

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchBooks = useCallback(async (pageNumber) => {
        setLoading(true);
        setError(null);
        try {
            // Note: The backend handles the pagination logic based on pageNumber query param
            const { data } = await api.get(`/books?pageNumber=${pageNumber}`);
            setBooks(data.books);
            setPages(data.pages);
            setPage(data.page);
        } catch (err) {
            setError('Failed to fetch books. Please ensure the backend is running and reachable.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks(page);
    }, [fetchBooks, page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pages) {
            setPage(newPage);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-2">
                All Books
            </h2>
            
            {error ? (
                <div className="p-10 text-center text-red-600 font-medium bg-red-50 rounded-lg m-10">{error}</div>
            ) : books.length === 0 ? (
                <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-xl">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No books found. Be the first to add one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map(book => (
                        // book includes averageRating and numReviews added by the backend controller
                        <BookCard key={book._id} book={book} /> 
                    ))}
                </div>
            )}
            
            {pages > 1 && <Pagination pages={pages} page={page} handlePageChange={handlePageChange} />}
        </div>
    );
};

export default HomePage;

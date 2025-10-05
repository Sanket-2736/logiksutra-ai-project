import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../api/axios';
import FormMessage from '../components/common/FormMessage';

const AddEditBookPage = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    
    // Form States
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [publishedYear, setPublishedYear] = useState('');
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEdit);
    const [message, setMessage] = useState(null);

    // Fetch existing book data if in edit mode
    useEffect(() => {
        if (isEdit) {
            const fetchBook = async () => {
                try {
                    const { data } = await api.get(`/books/${id}`);
                    setTitle(data.book.title);
                    setAuthor(data.book.author);
                    setDescription(data.book.description);
                    setGenre(data.book.genre);
                    setPublishedYear(data.book.publishedYear);
                } catch (err) {
                    setMessage({ type: 'error', text: 'Failed to fetch book data for editing. You may not be the owner or the book does not exist.' });
                } finally {
                    setFetchLoading(false);
                }
            };
            fetchBook();
        }
    }, [id, isEdit]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        const bookData = { title, author, description, genre, publishedYear: Number(publishedYear) };
        
        try {
            if (isEdit) {
                await api.put(`/books/${id}`, bookData);
                setMessage({ type: 'success', text: 'Book updated successfully!' });
                setTimeout(() => navigate(`/book/${id}`), 1500);
            } else {
                const { data } = await api.post('/books', bookData);
                setMessage({ type: 'success', text: 'Book added successfully!' });
                setTimeout(() => navigate(`/book/${data._id}`), 1500);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} book.`;
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="flex justify-center items-center h-screen bg-gray-50"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
            <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6 border-b pb-3">
                    {isEdit ? 'Edit Book Details' : 'Add New Book'}
                </h2>

                <FormMessage type={message?.type} message={message?.text} />

                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Genre</label>
                        <input
                            type="text"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Published Year</label>
                        <input
                            type="number"
                            value={publishedYear}
                            onChange={(e) => setPublishedYear(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="5"
                            required
                            className="mt-1 block w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-400 disabled:cursor-wait"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (isEdit ? 'Update Book' : 'Submit Book')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEditBookPage;

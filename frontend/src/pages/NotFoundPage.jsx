import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <BookOpen className="w-20 h-20 text-indigo-400 mb-6" />
            <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">
                The page you're looking for doesn't exist.
            </p>
            <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition"
            >
                Go Back Home
            </button>
        </div>
    );
};

export default NotFoundPage;

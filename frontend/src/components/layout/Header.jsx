import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, Plus } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-indigo-700 shadow-lg sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <div className="flex items-center">
                    <BookOpen className="text-indigo-200 w-6 h-6 mr-3" />
                    <h1 className="text-2xl font-bold text-white tracking-wide cursor-pointer" onClick={() => navigate('/')}>
                        BookReview Hub
                    </h1>
                </div>
                <nav className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-white hover:bg-indigo-600 px-3 py-2 rounded-md transition duration-150 text-sm font-medium"
                    >
                        Books
                    </button>
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={() => navigate('/add-book')}
                                className="bg-indigo-500 text-white hover:bg-indigo-400 px-3 py-2 rounded-md transition duration-150 text-sm font-medium flex items-center shadow-md"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add Book
                            </button>
                            <span className="text-indigo-200 text-sm font-medium hidden md:inline">
                                Hi, {user.name.split(' ')[0]}
                            </span>
                            <button
                                onClick={logout}
                                className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md transition duration-150 text-sm font-medium flex items-center shadow-md"
                            >
                                <LogOut className="h-4 w-4 mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-white hover:bg-indigo-600 px-3 py-2 rounded-md transition duration-150 text-sm font-medium"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-white text-indigo-700 hover:bg-indigo-100 px-3 py-2 rounded-md transition duration-150 text-sm font-medium shadow-md"
                            >
                                Signup
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;

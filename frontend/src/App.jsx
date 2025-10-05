import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout and Authentication Components
import Header from './components/layout/Header.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import BookDetailsPage from './pages/BookDetailsPage.jsx';
import AddEditBookPage from './pages/AddEditBookPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * App Component: Sets up the routing and main layout of the application.
 */
const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/book/:id" element={<BookDetailsPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        {/* Protected Routes (Requires Authentication) */}
                        <Route 
                            path="/add-book" 
                            element={
                                <ProtectedRoute>
                                    <AddEditBookPage />
                                </ProtectedRoute>
                            } 
                        />
                         <Route 
                            path="/edit-book/:id" 
                            element={
                                <ProtectedRoute>
                                    <AddEditBookPage isEdit={true} />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Catch-all Route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>

                {/* Optional Footer can be added here */}
                {/* <Footer /> */}
            </div>
        </Router>
    );
};

export default App;

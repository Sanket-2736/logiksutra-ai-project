import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import FormMessage from '../common/FormMessage';

const AuthForm = ({ type }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const isSignup = type === 'signup';
    const endpoint = isSignup ? '/auth/signup' : '/auth/login';

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        if (isSignup && (!name || !email || !password)) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' });
            setLoading(false);
            return;
        }
        if (!isSignup && (!email || !password)) {
            setMessage({ type: 'error', text: 'Please enter email and password.' });
            setLoading(false);
            return;
        }
        
        try {
            const body = isSignup ? { name, email, password } : { email, password };
            const { data } = await api.post(endpoint, body);
            
            login({ _id: data._id, name: data.name, email: data.email }, data.token);
            navigate('/');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Server error. Please try again.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">
                    {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>

                <FormMessage type={message?.type} message={message?.text} />

                <form onSubmit={submitHandler} className="space-y-4">
                    {isSignup && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:bg-indigo-400 disabled:cursor-wait"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (isSignup ? 'Sign Up' : 'Log In')}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {isSignup ? 'Already have an account?' : 'Need an account?'}
                    <button
                        onClick={() => navigate(isSignup ? '/login' : '/signup')}
                        className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                    >
                        {isSignup ? 'Log in' : 'Sign up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;

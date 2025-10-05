import React from 'react';

const FormMessage = ({ type, message }) => {
    if (!message) return null;
    const baseClasses = "p-3 rounded-lg text-sm mb-4 font-medium";
    const typeClasses = {
        success: 'bg-green-100 text-green-700 border border-green-300',
        error: 'bg-red-100 text-red-700 border border-red-300',
    };
    return <div className={`${baseClasses} ${typeClasses[type]}`}>{message}</div>;
};

export default FormMessage;

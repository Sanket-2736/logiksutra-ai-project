import React from 'react';

const Pagination = ({ pages, page, handlePageChange }) => {
    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Previous
            </button>

            {[...Array(pages).keys()].map(x => (
                <button
                    key={x + 1}
                    onClick={() => handlePageChange(x + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                        x + 1 === page
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-indigo-600 bg-white border border-indigo-300 hover:bg-indigo-50'
                    }`}
                >
                    {x + 1}
                </button>
            ))}

            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pages}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;

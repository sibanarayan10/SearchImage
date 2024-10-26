import React from 'react';

const ErrorPage = ({ statusCode, message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          {statusCode || 'Error'}
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          {message || 'Something went wrong. Please try again later.'}
        </p>
        <a
          href="/"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
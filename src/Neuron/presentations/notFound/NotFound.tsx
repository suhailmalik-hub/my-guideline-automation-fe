import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900'>
      <h1 className='text-9xl font-extrabold text-blue-600 mb-4'>404</h1>
      <h2 className='text-3xl font-bold mb-4'>Page Not Found</h2>
      <p className='text-slate-500 mb-8 max-w-md text-center'>
        Sorry, we couldn't find the page you're looking for. It might have been moved or the URL might be incorrect.
      </p>
      <Link
        to='/'
        className='px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition'
      >
        Return to Home
      </Link>
    </div>
  );
};

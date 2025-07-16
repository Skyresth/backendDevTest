import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="max-w-md">
        <div className="text-blue-500 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-24 w-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-extrabold text-slate-800">404</h1>
        <p className="mt-4 text-xl text-slate-600">Oops! Page not found</p>
        <p className="mt-2 text-slate-500">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          ← Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

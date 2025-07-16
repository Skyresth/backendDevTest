import { Link } from 'react-router-dom';
import { contextCartFunc } from '../context/contextCartFunc';

export default function Navbar() {
  const { cartCount, toggleCart } = contextCartFunc();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-black shadow fixed inset-x-0 top-0 z-10">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center text-xl font-bold text-white tracking-tight">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            YourApp Frontend
          </Link>

          {/* Navigation & Cart */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-slate-100 hover:text-blue-400 transition font-medium">Home</Link>
            <Link to="/orders" className="text-slate-100 hover:text-blue-400 transition font-medium">Orders</Link>


            <div className="relative">
              <button
                onClick={toggleCart}
                aria-label="View shopping cart"
                className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-all hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 11V7a4 4 0 10-8 0v4M5 8h14l1 12H4L5 8z" />
                </svg>
              </button>

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

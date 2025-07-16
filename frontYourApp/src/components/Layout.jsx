import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import PageFoot from './PageFoot';
import LinkThread from './LinkThread';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      <div className="pt-20 flex-grow flex flex-col">
        <nav aria-label="LinkThread" className="bg-gray-100">
          <div className="container mx-auto px-4 py-2">
            <LinkThread />
          </div>
        </nav>

        <main className="flex-grow container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>

      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <PageFoot />
        </div>
      </footer>
    </div>
  );
}

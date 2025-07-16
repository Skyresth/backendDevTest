/**
 * Footer component displaying copyright and optional site tagline.
 * @param {Object} props
 * @param {string} [tagline='Your React App'] - Custom tagline or description.
 */
export default function PageFoot({ tagline = 'Your React App' }) {
  return (
    <footer className="bg-gray-800 text-gray-200 py-6">
      <div className="container mx-auto px-4 max-w-screen-xl flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm">
          © {new Date().getFullYear()} {tagline}. Under construction.
        </p>
        <p className="text-sm mt-2 md:mt-0">
          Built with ☕☕☕.
        </p>
      </div>
    </footer>
  );
}

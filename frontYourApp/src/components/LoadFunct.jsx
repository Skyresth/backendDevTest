/**
 * Loading spinner component with accessible status text.
 * @param {Object} props
 * @param {string} [props.message='Loading...'] - The loading text to display.
 * @param {number|string} [props.size=64] - Diameter of the spinner in pixels.
 */
export default function LoadFunct({ message = 'Loading...', size = 64 }) {
  const borderWidth = Math.ceil(size * 0.0625); // 1/16th of size
  const spinnerStyle = {
    width: size,
    height: size,
    borderWidth,
  };

  return (
    <div className="flex flex-col items-center justify-center" role="status" aria-live="polite">
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 rounded-full border-gray-200"
          style={spinnerStyle}
        />
        <div
          className="absolute inset-0 animate-spin rounded-full border-primary border-t-transparent"
          style={spinnerStyle}
        />
      </div>
      <span className="mt-2 text-gray-600 font-medium">{message}</span>
    </div>
  );
}

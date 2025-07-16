import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadFunct from './LoadFunct';

/**
 * Detailed view for a single product including options and specifications.
 */
export default function ProductDetail({ product, onAddToCart, isLoading }) {
  const colors = product.options?.colors || [];
  const storages = product.options?.storages || [];

  const [selectedColor, setSelectedColor] = useState(colors[0]?.code || '');
  const [selectedStorage, setSelectedStorage] = useState(storages[0]?.code || '');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  // Sync defaults when product changes
  useEffect(() => {
    setSelectedColor(colors[0]?.code || '');
    setSelectedStorage(storages[0]?.code || '');
    setQuantity(1);
    setError(null);
  }, [product]);

  if (!product) return null;

  const numericPrice = product.price != null && !isNaN(Number(product.price))
    ? Number(product.price)
    : null;
  const priceLabel = numericPrice === null
    ? 'Price unavailable'
    : numericPrice <= 0
    ? 'Out of stock'
    : `${numericPrice.toFixed(2)}€`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // call with color, storage, quantity as originally expected
      await onAddToCart(selectedColor, selectedStorage, quantity);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart. Please try again.');
    }
  };

  const renderValue = (value) => {
    if (Array.isArray(value)) return value.join(', ');
    return value || 'N/A';
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 space-y-6">
      {/* Error Message */}
      {error && (
        <div className="text-red-600 mb-4 font-medium">{error}</div>
      )}

      <div className="md:flex gap-6">
        {/* Image */}
        <div className="md:w-1/3 flex justify-center">
          {isLoading ? (
            <LoadFunct size={100} message="Loading image..." />
          ) : (
            <img
              src={product.imgUrl || 'https://picsum.photos/seed/mobile123/300/300'}
              alt={`${product.brand} ${product.model}`}
              className="object-contain max-h-64"
            />
          )}
        </div>

        {/* Info & Form */}
        <div className="md:w-2/3 space-y-4">
          <h1 className="text-3xl font-bold">
            {product.brand} {product.model}
          </h1>

          <p className="text-xl font-semibold text-primary">
            {priceLabel}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Color Select */}
            {colors.length > 0 && (
              <div>
                <label className="block font-medium mb-1" htmlFor="color-select">Color</label>
                <select
                  id="color-select"
                  value={selectedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                >
                  {colors.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Storage Select */}
            {storages.length > 0 && (
              <div>
                <label className="block font-medium mb-1" htmlFor="storage-select">Storage</label>
                <select
                  id="storage-select"
                  value={selectedStorage}
                  onChange={e => setSelectedStorage(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                >
                  {storages.map(s => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block font-medium mb-1">Quantity</label>
              <div className="inline-flex items-center border rounded overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-16 text-center border-none"
                  value={quantity}
                  min="1"
                  onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                />
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded hover:bg-primary/90 transition"
              disabled={isLoading || numericPrice <= 0}
            >
              {isLoading ? 'Adding to cart...' : 'Add to Cart'}
            </button>
          </form>
        </div>
      </div>

      {/* Specifications */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specs || {}).map(([key, val]) => (
            <div key={key} className="flex">
              <span className="w-32 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="flex-1">{renderValue(val)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

ProductDetail.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string, name: PropTypes.string })),
      storages: PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string, name: PropTypes.string })),
    }),
    specs: PropTypes.object,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

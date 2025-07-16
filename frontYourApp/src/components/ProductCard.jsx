import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Displays a product summary card.
 */
export default function ProductCard({ product }) {
  const { id, brand, model, imgUrl, price } = product;

  // Normalize price value
  const numericPrice = price != null && !isNaN(Number(price)) ? Number(price) : null;

  // Determine display text
  let displayPrice;
  if (numericPrice === null) {
    displayPrice = 'Price unavailable';
  } else if (numericPrice <= 0) {
    displayPrice = 'Out of stock';
  } else {
    displayPrice = `${numericPrice.toFixed(2)}€`;
  }

  return (
    <Link
      to={`/product/${id}`}
      className="block bg-white rounded-lg shadow-sm h-full flex flex-col transform transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={`View details for ${brand} ${model}`}
    >
      <div className="relative pb-[75%] overflow-hidden rounded-t-lg">
      </div>
        <img
          src={product.imgUrl || 'https://picsum.photos/seed/mobile123/300/300'}
          alt={`${product.brand} ${product.model}`}
          className="object-contain max-h-64"
        />
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {brand}
          </span>
        </div>
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{model}</h3>
        <p className="text-primary font-bold mt-auto">
          {displayPrice}
        </p>
      </div>
    </Link>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};
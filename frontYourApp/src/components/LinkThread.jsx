import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import apiService from '../service/apiService';

const PATH_LABELS = {
  '': 'Home',
  product: 'Product',
  orders: 'My Orders',
};

export default function LinkThread() {
  const location = useLocation();
  const { productId } = useParams();
  const [productName, setProductName] = useState('');

  // Compute segments once per location change
  const pathSegments = useMemo(
    () => location.pathname.split('/').filter(Boolean),
    [location.pathname]
  );

  // Fetch product name when on a product detail route
  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    apiService.getProductById(productId)
      .then(product => {
        if (!cancelled) {
          setProductName(`${product.brand} ${product.model}`);
        }
      })
      .catch(err => console.error('Error fetching product:', err));

    return () => { cancelled = true; };
  }, [productId]);

  const getLabel = (segment) => {
    if (segment === productId && productName) {
      return productName;
    }
    return PATH_LABELS[segment] || segment;
  };

  return (
    <nav aria-label="Breadcrumb" className="bg-white shadow-sm py-2 px-4 mb-6">
      <div className="mx-auto max-w-screen-xl flex items-center text-sm">
        <ol className="flex flex-wrap">
          <li>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
          </li>
          {pathSegments.map((seg, idx) => {
            const isLast = idx === pathSegments.length - 1;
            const to = '/' + pathSegments.slice(0, idx + 1).join('/');
            const label = getLabel(seg);

            return (
              <li key={to} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isLast ? (
                  <span className="font-medium text-gray-800">{label}</span>
                ) : (
                  <Link to={to} className="text-blue-600 hover:text-blue-800">
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

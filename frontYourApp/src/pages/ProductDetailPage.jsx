import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../service/apiService';
import { contextCartFunc } from '../context/contextCartFunc';
import ProductDetail from '../components/ProductDetail';
import LoadFunct from '../components/LoadFunct';
import ErrorMessage from '../components/ErrorMessage';

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const { addToCart } = contextCartFunc();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productData = await apiService.getProductById(productId);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError(
          'An error occurred while loading product data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleAddToCart = async (colorCode, storageCode, quantity) => {
    try {
      setAddingToCart(true);
      await addToCart(productId, colorCode, storageCode, quantity, product);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadFunct />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {product && (
        <>
          <ProductDetail
            product={product}
            onAddToCart={handleAddToCart}
            isLoading={addingToCart}
          />

          {cartSuccess && (
            <div className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
              Product successfully added to cart
            </div>
          )}
        </>
      )}

      <div className="mt-8 text-center">
        <Link to="/" className="text-primary hover:underline inline-block">
          &larr; Back to catalog
        </Link>
      </div>
    </div>
  );
}

export default ProductDetailPage;

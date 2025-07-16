import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { contextCartFunc } from '../context/contextCartFunc';
import apiService from '../service/apiService';

// Custom hook to fetch and cache product details
function useProductDetails(cartProducts, isOpen) {
  const [detailsById, setDetailsById] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const missing = cartProducts.filter(item => !item.details && !detailsById[item.id]);
    if (!missing.length) return;

    Promise.all(missing.map(item =>
      apiService.getProductById(item.id)
        .then(data => ({ id: item.id, data }))
        .catch(() => null)
    )).then(results => {
      const newMap = {};
      results.forEach(res => {
        if (res) newMap[res.id] = res.data;
      });
      setDetailsById(prev => ({ ...prev, ...newMap }));
    });
  }, [cartProducts, isOpen, detailsById]);

  return detailsById;
}

export default function Cart() {
  const { cartProducts, isOpen, toggleCart, summaryUpdate, deleteProduct, clear, checkout } = contextCartFunc();
  const [step, setStep] = useState('cart');
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', address: '' });
  const [orderResult, setOrderResult] = useState(null);
  const navigate = useNavigate();

  const detailsById = useProductDetails(cartProducts, isOpen);

  const getProductInfo = useCallback(item => {
    const details = item.details || detailsById[item.id];
    if (!details) return { name: 'Loading...', color: '', storage: '', price: 0, imgUrl: '' };

    const color = details.options?.colors?.find(c => c.code === item.colorCode)?.name || '';
    const storage = details.options?.storages?.find(s => s.code === item.storageCode)?.name || '';

    return {
      name: `${details.brand} ${details.model}`,
      color,
      storage,
      price: parseFloat(details.price) || 0,
      imgUrl: details.imgUrl || ''
    };
  }, [detailsById]);

  const totalAmount = useMemo(() =>
    cartProducts.reduce((sum, item) => sum + getProductInfo(item).price * item.quantity, 0).toFixed(2)
  , [cartProducts, getProductInfo]);

  const handleInput = useCallback(e => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckout = useCallback(async () => {
    if (step === 'cart') {
      setStep('checkout');
      return;
    }
    try {
      const order = await checkout(customerInfo);
      setOrderResult(order);
      setStep('success');
    } catch (err) {
      console.error('Checkout error', err);
    }
  }, [step, checkout, customerInfo]);

  const viewOrders = useCallback(() => {
    toggleCart();
    navigate('/orders');
  }, [toggleCart, navigate]);

  const continueShopping = useCallback(() => {
    toggleCart();
    setStep('cart');
    setOrderResult(null);
  }, [toggleCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end">
      <div className="bg-gray-900 text-gray-200 w-full max-w-md h-full overflow-y-auto flex flex-col" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800 text-white">
          <h2 className="text-xl font-bold">
            {step === 'cart' && 'Your Shopping Cart'}
            {step === 'checkout' && 'Checkout'}
            {step === 'success' && 'Order Complete'}
          </h2>
          <button onClick={toggleCart} aria-label="Close cart" className="p-1 rounded-full hover:bg-gray-700">
            ×
          </button>
        </div>

        {/* Cart view */}
        {step === 'cart' && (
          <>
            <div className="flex-grow p-4">
              {cartProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Your cart is empty</p>
                  <button onClick={toggleCart} className="mt-4 text-blue-400 hover:underline">Continue Shopping</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartProducts.map(item => {
                    const info = getProductInfo(item);
                    const itemKey = `${item.id}-${item.colorCode}-${item.storageCode}`;
                    return (
                      <div key={itemKey} className="border border-gray-700 rounded-lg p-4 flex flex-col hover:shadow-lg hover:shadow-black/50 transition-shadow">
                        <div className="flex">
                          <div className="flex-grow">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">{info.name}</h3>
                              <button onClick={() => deleteProduct(item)} className="text-red-500 hover:text-red-700">🗑</button>
                            </div>
                            {info.color && <div className="text-sm text-gray-400">Color: {info.color}</div>}
                            {info.storage && <div className="text-sm text-gray-400">Storage: {info.storage}</div>}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <button onClick={() => summaryUpdate(item, item.quantity - 1)} className="px-3 py-1 bg-gray-700 rounded-l hover:bg-gray-600">-</button>
                            <span className="px-3 py-1 border-t border-b border-gray-700">{item.quantity}</span>
                            <button onClick={() => summaryUpdate(item, item.quantity + 1)} className="px-3 py-1 bg-gray-700 rounded-r hover:bg-gray-600">+</button>
                          </div>
                          <div className="font-semibold">{(info.price * item.quantity).toFixed(2)}€</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {cartProducts.length > 0 && (
              <div className="border-t border-gray-700 p-4 bg-gray-800">
                <div className="flex justify-between font-bold mb-4">
                  <span>Total:</span>
                  <span>{totalAmount}€</span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={clear} className="flex-1 px-4 py-2 border border-red-700 text-red-500 rounded hover:bg-red-700 hover:text-white transition">
                    Clear Cart
                  </button>
                  <button onClick={handleCheckout} className="flex-1 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition">
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Checkout form */}
        {step === 'checkout' && (
          <div className="flex-grow p-4">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4 mb-6">
              {['name', 'email', 'address'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  {field === 'address' ? (
                    <textarea name="address" value={customerInfo.address} onChange={handleInput}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200" rows={3} required />
                  ) : (
                    <input type={field === 'email' ? 'email' : 'text'} name={field} value={customerInfo[field]}
                      onChange={handleInput} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200" required />
                  )}
                </div>
              ))}
            </div>
            <div className="bg-gray-800 rounded p-4 mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Items ({cartProducts.reduce((s,i)=>s+i.quantity,0)})</span>
                <span>{totalAmount}€</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold text-gray-200">
                <span>Total</span>
                <span>{totalAmount}€</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setStep('cart')} className="flex-1 px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition">
                Back
              </button>
              <button onClick={handleCheckout} className="flex-1 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition">
                Confirm Order
              </button>
            </div>
          </div>
        )}

        {/* Success screen */}
        {step === 'success' && orderResult && (
          <div className="flex-grow p-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-700 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Thank you for your purchase!</h3>
            <p className="text-gray-400 mb-4">Your order has been placed successfully.</p>
            <div className="bg-gray-800 rounded p-4 mb-6 text-left text-gray-300">
              <p className="font-medium">Order #: {orderResult.id}</p>
              <p className="text-sm mt-1">Date: {new Date(orderResult.date).toLocaleDateString()}</p>
              <p className="text-sm">Total: {orderResult.total.toFixed(2)}€</p>
            </div>
            <div className="flex flex-col space-y-2">
              <button onClick={viewOrders} className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition">
                View Orders
              </button>
              <button onClick={continueShopping} className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-700 hover:text-white transition">
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

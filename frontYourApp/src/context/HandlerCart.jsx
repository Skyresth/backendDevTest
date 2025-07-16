import { useState, useEffect } from "react";
import apiService from "../service/apiService";
import { CartContext } from "./CartContext";

function HandlerCart({ children }) {
  const STORAGE_KEY = 'cartKey123';
  const ORDER_KEY = 'orderKeys123';
  const CART_EXPIRATION = 60 * 60 * 1000;

  const [cartProducts, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem(STORAGE_KEY);
        if (storedCart) {
          const { items, timestamp } = JSON.parse(storedCart);
          const now = new Date().getTime();

          if (now - timestamp < CART_EXPIRATION && items) {
            setCartItems(items);
            const count = items.reduce(
              (total, item) => total + item.quantity,
              0
            );
            setCartCount(count);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        const storedOrders = localStorage.getItem(ORDER_KEY);
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    if (cartProducts.length > 0) {
      try {
        const cartData = {
          items: cartProducts,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cartProducts]);

  useEffect(() => {
    if (orders.length > 0) {
      try {
        localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
      } catch (error) {
        console.error("Error saving orders to localStorage:", error);
      }
    }
  }, [orders]);

  const addToCart = async (
    productId,
    colorCode,
    storageCode,
    quantity = 1,
    productDetails = null
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.addToCart(
        productId,
        colorCode,
        storageCode
      );

      const existingItemIndex = cartProducts.findIndex(
        (item) =>
          item.id === productId &&
          item.colorCode === colorCode &&
          item.storageCode === storageCode
      );

      const updatedItems = [...cartProducts];

      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        updatedItems.push({
          id: productId,
          colorCode,
          storageCode,
          quantity,
          details: productDetails,
        });
      }

      setCartItems(updatedItems);
      const newCount = updatedItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartCount(newCount);

      return response;
    } catch (err) {
      setError("Error adding to cart");
      console.error("Error in addToCart:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const summaryUpdate = (itemIndex, newQuantity) => {
    if (newQuantity < 1) {
      deleteProduct(itemIndex);
      return;
    }

    const updatedItems = [...cartProducts];
    updatedItems[itemIndex].quantity = newQuantity;

    setCartItems(updatedItems);
    const newCount = updatedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(newCount);
  };

  const deleteProduct = (itemIndex) => {
    const updatedItems = cartProducts.filter((_, index) => index !== itemIndex);
    setCartItems(updatedItems);
    const newCount = updatedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(newCount);

    if (updatedItems.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const clear = () => {
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  const toggleCart = () => {
    setIsCartOpen(!isOpen);
  };

  const checkout = async (customerInfo = {}) => {
    if (cartProducts.length === 0) return null;

    try {
      setLoading(true);

      const order = {
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        items: [...cartProducts],
        customerInfo,
        total: cartProducts.reduce((total, item) => {
          const price = item.details?.price
            ? parseFloat(item.details.price)
            : 0;
          return total + price * item.quantity;
        }, 0),
        date: new Date().toISOString(),
        status: "completed",
      };

      const updatedOrders = [order, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem(ORDER_KEY, JSON.stringify(updatedOrders));

      clear();
      setIsCartOpen(false);

      return order;
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("Error processing order");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartProducts,
    cartCount,
    loading,
    error,
    isOpen,
    orders,
    addToCart,
    summaryUpdate,
    deleteProduct,
    clear,
    toggleCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default HandlerCart;

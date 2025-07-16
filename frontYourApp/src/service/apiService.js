import axios from 'axios';

// Cache expiration time (1 hour in milliseconds)
const CACHE_EXPIRATION = 60 * 60 * 1000;

// API base URL
const API_BASE_URL = 'https://itx-frontend-test.onrender.com/';

// Cache key for localStorage
const CACHE_STORAGE_KEY = 'key_cache_yourApp';

/**
 * Caching system for API requests with persistence in localStorage
 */
class Cache {
  constructor() {
    this.loadCacheFromStorage();
  }

  /**
   * Load cache from localStorage
   */
  loadCacheFromStorage() {
    try {
      const storedCache = localStorage.getItem(CACHE_STORAGE_KEY);
      this.cache = storedCache ? JSON.parse(storedCache) : {};
      this.cleanExpiredItems();
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
      this.cache = {};
    }
  }

  /**
   * Save cache to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }

  /**
   * Remove expired items from the cache
   */
  cleanExpiredItems() {
    const now = Date.now();
    let changed = false;

    Object.keys(this.cache).forEach((key) => {
      if ((now - this.cache[key].timestamp) >= CACHE_EXPIRATION) {
        delete this.cache[key];
        changed = true;
      }
    });

    if (changed) {
      this.saveToStorage();
    }
  }

  /**
   * Check if a cache entry is still valid
   */
  isValid(key) {
    const cacheItem = this.cache[key];
    if (!cacheItem) return false;

    const now = Date.now();
    return (now - cacheItem.timestamp) < CACHE_EXPIRATION;
  }

  /**
   * Store data in the cache with timestamp
   */
  set(key, data) {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
    this.saveToStorage();
  }

  /**
   * Retrieve data from the cache if valid
   */
  get(key) {
    this.cleanExpiredItems();
    return this.isValid(key) ? JSON.parse(JSON.stringify(this.cache[key].data)) : null;
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache = {};
    localStorage.removeItem(CACHE_STORAGE_KEY);
  }
}

const apiCache = new Cache();

/**
 * API service class with caching support
 */
class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetch product list
   */
  async getProducts(forceRefresh = false) {
    const cacheKey = 'products-list';
    if (!forceRefresh) {
      const cachedData = apiCache.get(cacheKey);
      if (cachedData) {
        console.log('Using cached product list');
        return cachedData;
      }
    }

    try {
      console.log('Fetching product list from API');
      const response = await this.api.get('/api/product');
      apiCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching product list:', error);
      throw error;
    }
  }

  /**
   * Fetch product details by ID
   */
  async getProductById(productId, forceRefresh = false) {
    const cacheKey = `product-${productId}`;
    if (!forceRefresh) {
      const cachedData = apiCache.get(cacheKey);
      if (cachedData) {
        console.log(`Using cached product ${productId}`);
        return cachedData;
      }
    }

    try {
      console.log(`Fetching product ${productId} from API`);
      const response = await this.api.get(`/api/product/${productId}`);
      apiCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Add product to cart
   */
  async addToCart(productId, colorCode, storageCode) {
    try {
      const response = await this.api.post('/api/cart', {
        id: productId,
        colorCode,
        storageCode,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  }
}

export default new ApiService();

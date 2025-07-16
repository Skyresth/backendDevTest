import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../service/apiService";
import ProductCard from "../components/ProductCard";
import LoadFunct from "../components/LoadFunct";
import ErrorMessage from "../components/ErrorMessage";
import SearchBar from "../components/SearchBar";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          "An error occurred while loading the products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (term) => {
    if (!term.trim()) {
      setFilteredProducts(products);
      return;
    }

    const lower = term.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.brand.toLowerCase().includes(lower) ||
        product.model.toLowerCase().includes(lower)
    );
    setFilteredProducts(filtered);
  };

  const toggleView = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  if (loading) return <LoadFunct />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 pb-8">
      {/* Sticky Control Panel */}
      <div className="fixed left-0 right-0 top-16 z-20 bg-gray-50 shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Product Catalog
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={toggleView}
                className="inline-flex items-center justify-center p-2 rounded-md bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
                aria-label={viewMode === "grid" ? "View as list" : "View as grid"}
                title={viewMode === "grid" ? "View as list" : "View as grid"}
              >
                {viewMode === "grid" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                )}
              </button>

              <div className="w-full sm:w-64">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-48"></div>

      <div className="overflow-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative group">
                <Link
                  to={`/product/${product.id}`}
                  className="transition-transform hover:scale-105 block h-full"
                >
                  <ProductCard product={product} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/4 h-48">
                    <img
                      src={product.imgUrl || 'https://picsum.photos/seed/mobile123/300/300'}
                      alt={`${product.brand} ${product.model}`}
                      className="object-contain max-h-64"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{product.brand}</h3>
                        <h4 className="font-medium text-md mb-2">{product.model}</h4>
                      </div>
                      <p className="text-primary font-bold text-lg">
                        {product.price ? `${product.price}€` : "Out of stock"}
                      </p>
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {product.description || "No description available"}
                    </p>
                    <div className="mt-auto pt-4 flex justify-between items-center">
                      <Link to={`/product/${product.id}`} className="text-primary hover:underline">
                        View details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;

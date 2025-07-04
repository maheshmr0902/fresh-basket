import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const ProductList = () => {
  const { products: initialProducts, currency, axios, fetchProducts } = useAppContext();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync with global state
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) {
      setLoading(true);
      fetchProducts()
        .catch(() => setError('Failed to load products'))
        .finally(() => setLoading(false));
    }
  }, [initialProducts, fetchProducts]);

  const toggleStock = async (id, newStockStatus) => {
    // Optimistic UI update
    const originalProducts = products;
    const updatedProducts = products.map(p => p._id === id ? { ...p, inStock: newStockStatus } : p);
    setProducts(updatedProducts);

    try {
      const { data } = await axios.patch(`/api/product/stock/${id}`, { inStock: newStockStatus });
      if (data.success) {
        toast.success("Stock status updated.");
        // Optionally call fetchProducts() here if you need to sync other data
      } else {
        toast.error(data.message || "Update failed.");
        setProducts(originalProducts); // Revert on failure
      }
    } catch (error) {
      toast.error("An error occurred.");
      setProducts(originalProducts); // Revert on error
      console.error("Error toggling stock status:", error);
    }
  };

  if (loading && products.length === 0) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="p-3 font-semibold">Product</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold text-center">In Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 flex items-center gap-3">
                  <img src={product.image?.[0] || 'https://via.placeholder.com/64'} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <span className="font-medium text-gray-800">{product.name}</span>
                </td>
                <td className="p-3 text-gray-600">
                  {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                </td>
                <td className="p-3 text-gray-600">{currency}{product.offerPrice}</td>
                <td className="p-3 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={product.inStock} onChange={() => toggleStock(product._id, !product.inStock)} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full"></span>
                  </label>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;



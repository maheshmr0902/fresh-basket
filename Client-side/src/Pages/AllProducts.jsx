import React from 'react';
import { useAppContext } from '../Context/AppContext';
import ProductCard from '../Components/ProductCard';

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();

  const filteredProducts = products.filter((product) => {
    const matchesQuery = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesQuery && product.inStock;
  });

  return (
    <section className="mt-16 flex flex-col min-h-[70vh]">
      <div className="flex flex-col items-end w-max">
        <h1 className="text-2xl font-medium uppercase">All Products</h1>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center">
          <p className="text-gray-500 text-lg">No products match your search.</p>
        </div>
      )}
    </section>
  );
};

export default AllProducts;




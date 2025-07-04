import React from 'react';
import { useAppContext } from '../Context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../Components/ProductCard';

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();
  const lowerCaseCategory = category?.toLowerCase();

  // Find category metadata
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === lowerCaseCategory
  );

  // Filter products by category and stock status in a single pass
  const filterProducts = products.filter((product) => {
    if (!product.category || product.inStock === false) return false;

    const matchesCategory = Array.isArray(product.category)
      ? product.category.map((c) => c.toLowerCase()).includes(lowerCaseCategory)
      : product.category.toLowerCase() === lowerCaseCategory;

    return matchesCategory;
  });

  return (
    <section className="mt-16 min-h-[70vh] px-4">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <h1 className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </h1>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}

      {filterProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
          {filterProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </section>
  );
};

export default ProductCategory;




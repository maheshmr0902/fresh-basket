import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../Context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();

  // Assuming 'inStock' and the first 5 products are the criteria for 'best sellers' as per current implementation
  const bestSellers = (products || []).filter((product) => product.inStock).slice(0, 5);

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Best Seller</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {bestSellers.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets, categories } from '../assets/assets'; // Assuming categories array is imported

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>
        {(categories || []).map((category) => (
          <div
            key={category.path} // Using category.path as key, ensure it's unique
            className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              window.scrollTo(0, 0);
            }}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/products/${category.path.toLowerCase()}`);
                window.scrollTo(0, 0);
              }
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className='group-hover:scale-110 transition-transform duration-200 max-w-28'
            />
            <p className='text-sm font-medium'>{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;



import React from 'react';
import MainBanner from '../Components/MainBanner';
import Categories from '../Components/Categories';
import BestSeller from '../Components/BestSeller';
import BottomBanner from '../Components/BottomBanner';
import Newsletter from '../Components/NewsLetter';

const Home = () => {
  return (
    <main className='mt-10'>
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <Newsletter />
    </main>
  );
};

export default Home;
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Login from './Components/Login';

import Home from './Pages/Home';
import AllProducts from './Pages/AllProducts';
import ProductCategory from './Pages/ProductCategory';

import { useAppContext } from './Context/AppContext';
import ProductDetails from './Pages/ProductDetails';

function App() {
  const location = useLocation();
  const isSellerPath = location.pathname.includes('seller');
  const { showUserLogin } = useAppContext();

  return (
    <div>
      {/* Conditional Navbar */}
      {!isSellerPath && <Navbar />}

      {/* Conditional Login Modal */}
      {showUserLogin && <Login />}

      {/* Toast Notifications */}
      <Toaster />

      {/* Page Container with conditional padding */}
      <div className={!isSellerPath ? 'px-6 md:px-16 lg:px-24 xl:px-32' : ''}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
           <Route path='/products/:category/:id' element={<ProductDetails />} />
        </Routes>
      </div>

      {/* Conditional Footer */}
      {!isSellerPath && <Footer />}
    </div>
  );
}

export default App;



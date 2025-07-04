import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Login from './Components/Login';

import Home from './Pages/Home';
import AllProducts from './Pages/AllProducts';
import ProductCategory from './Pages/ProductCategory';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import AddAddress from './Pages/AddAddress';
import Payments from './Pages/Payments';
import MyOrders from './Pages/MyOrders';

import SellerLogin from './Components/Seller/SellerLogin';
import SellerLayout from './Pages/Seller/SellerLayout';
import AddProduct from './Pages/Seller/AddProduct';
import ProductList from './Pages/Seller/ProductList';
import Orders from './Pages/Seller/Orders';

import { useAppContext } from './Context/AppContext';

const ProtectedRoute = ({ children, requireSeller = false }) => {
  const { user, isSeller } = useAppContext();

  if (requireSeller) {
    return isSeller ? children : <Navigate to="/seller-login" />;
  }

  return user ? children : <Navigate to="/" />;
};

function App() {
  const location = useLocation();
  const isSellerPath = location.pathname.startsWith('/seller');
  const { showUserLogin } = useAppContext();

  return (
    <div>
      {/* Conditional Navbar */}
      {!isSellerPath && <Navbar />}

      {/* Conditional Login Modal */}
      {showUserLogin && <Login />}

      {/* Toast Notifications */}
      <Toaster />

      {/* Main App Container */}
      <div className={!isSellerPath ? 'px-6 md:px-16 lg:px-24 xl:px-32' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetails />} />

          {/* Authenticated User Routes */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/address" element={<ProtectedRoute><AddAddress /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

          {/* Seller Login Route */}
          <Route path="/seller-login" element={<SellerLogin />} />

          {/* Protected Seller Routes */}
          <Route path="/seller" element={<ProtectedRoute requireSeller><SellerLayout /></ProtectedRoute>}>
            <Route index element={<AddProduct />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<div className="text-center mt-10 text-red-500 text-xl">404 Page Not Found</div>} />
        </Routes>
      </div>

      {/* Conditional Footer */}
      {!isSellerPath && <Footer />}
    </div>
  );
}

export default App;








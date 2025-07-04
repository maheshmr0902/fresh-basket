// SellerLogin.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';
// import axios from 'axios'; // Import axios if not coming from AppContext

const SellerLogin = () => {
  const { isSeller, axios, fetchSeller } = useAppContext(); // Assuming axios and fetchSeller are from AppContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/seller/login", { email, password }, { withCredentials: true });

      const data = response?.data;

      if (data.success) {
        toast.success('Login successful!');
        await fetchSeller(); // Updates isSeller state
        navigate('/seller');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong during login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate('/seller');
    }
  }, [isSeller, navigate]);

  return (
    !isSeller && ( // Only render if not already a seller
      <form
        onSubmit={onSubmitHandler}
        className="min-h-screen flex items-center justify-center text-sm text-gray-600"
      >
        <div className="flex flex-col gap-5 items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">Seller</span> Login
          </p>
          <div className="w-full">
            <label htmlFor="seller-email">Email</label> {/* Added label for accessibility */}
            <input
              id="seller-email" // Added id for label association
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>
          <div className="w-full">
            <label htmlFor="seller-password">Password</label> {/* Added label for accessibility */}
            <input
              id="seller-password" // Added id for label association
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>
          <button
            className="bg-secondary text-white w-full py-2 rounded-md cursor-pointer"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    )
  );
};

export default SellerLogin;






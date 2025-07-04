import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import logo from '../assets/Logo3.jpg';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    user,
    setUser,
    setShowUserLogin = () => {}, // fallback to prevent error
    setSearchQuery = () => {},
    searchQuery = '',
    getCartCount = () => 0,
  } = useAppContext();

  const logout = async () => {
    try {
      // dummy logout logic
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery, navigate]);

  const cartCount = getCartCount();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative">
      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)} aria-label="Home">
        <img className="h-20" src={logo} alt="Site Logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>Home</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>All Products</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>Contact</NavLink>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center border border-gray-300 px-3 rounded-full text-sm">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="Search" className="w-4 h-4" />
        </div>

        {/* Cart Icon */}
        <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt="Cart" className="w-6 opacity-80" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full text-center leading-[18px]">
              {cartCount}
            </span>
          )}
        </div>

        {/* Login/Profile */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="px-8 py-2 bg-primary hover:bg-primary-dull text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10 cursor-pointer" alt="Profile" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2 w-32 rounded-md text-sm z-40">
              <li onClick={() => navigate('/my-orders')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My Orders</li>
              <li onClick={logout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="sm:hidden flex items-center gap-3">
        <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt="Cart Icon" className="w-6 opacity-80" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full text-center leading-[18px]">
              {cartCount}
            </span>
          )}
        </div>
        <button onClick={() => setOpen(!open)}>
          <img src={assets.menu_icon} alt="Menu Icon" />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden flex z-50">
          <NavLink to="/" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>All Products</NavLink>
          {user && <NavLink to="/my-orders" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>My Orders</NavLink>}
          <NavLink to="footer" onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'text-primary font-semibold' : ''}>Contact</NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="px-6 py-2 mt-2 bg-primary hover:bg-primary-dull text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="px-6 py-2 mt-2 bg-primary hover:bg-primary-dull text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;





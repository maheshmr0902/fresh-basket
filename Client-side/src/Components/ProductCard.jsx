import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { currency = "$", addToCart, removeFromCart, cartItems = {} } = useAppContext();
  const navigate = useNavigate();

  if (!product) return null;

  const rating = product.rating || 4;
  const productId = product._id;
  const quantity = cartItems[productId] || 0;

  const handleNavigate = () => {
    navigate(`/products/${String(product.category).toLowerCase()}/${productId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleNavigate}
      className="border border-gray-300 rounded-md px-3 md:px-4 py-2 bg-white min-w-56 max-w-56 w-full shadow-sm hover:shadow-md transition cursor-pointer"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleNavigate()}
    >
      {/* Product Image */}
      <div className="group flex items-center justify-center px-2">
        <img
          className="group-hover:scale-105 transition-transform duration-200 max-w-24 md:max-w-36"
          src={product.image?.[0] || assets.placeholder_image}
          alt={product.name}
        />
      </div>

      {/* Product Info */}
      <div className="text-sm text-gray-600 mt-2">
        <p className="text-xs text-gray-500">{product.category}</p>
        <p className="text-gray-800 font-semibold text-lg truncate">{product.name}</p>

        {/* Ratings */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src={i < rating ? assets.star_icon : assets.star_dull_icon}
              alt="star"
              className="w-3 md:w-3.5"
            />
          ))}
          <p className="text-xs text-gray-500">({rating})</p>
        </div>

        {/* Price + Cart Actions */}
        <div className="flex items-end justify-between mt-3">
          {/* Price */}
          <p className="text-base md:text-lg font-bold text-secondary">
            {currency}{product.offerPrice}
            <span className="ml-1 text-xs md:text-sm text-gray-400 line-through">
              {currency}{product.price}
            </span>
          </p>

          {/* Add to Cart or Counter */}
          <div onClick={(e) => e.stopPropagation()} className="text-secondary">
            {quantity === 0 ? (
              <button
                onClick={() => addToCart(productId)}
                className="flex items-center justify-center gap-1 bg-secondary/10 border border-secondary/40 text-secondary font-medium md:w-[80px] w-[64px] h-[34px] rounded transition hover:bg-secondary/20"
              >
                <img src={assets.cart_icon} alt="cart" className="w-4 h-4" />
                <span>Add</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-secondary text-black font-semibold rounded select-none">
                <button
                  onClick={() => removeFromCart(productId)}
                  className="px-2 text-md bg-secondary hover:bg-secondary/90"
                >
                  −
                </button>
                <span className="w-5 text-center">{quantity}</span>
                <button
                  onClick={() => addToCart(productId)}
                  className="px-2 text-md hover:bg-secondary/90"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;





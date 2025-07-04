import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";

const ProductDetails = () => {
  const { products, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (product && products.length > 0) {
      const filtered = products.filter((item) => item.category === product.category && item._id !== product._id);
      setRelatedProducts(filtered.slice(0, 5));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image?.[0] || null);
  }, [product]);

  if (!product) return <div className="mt-16 text-center">Product not found.</div>;

  return (
    <div className="mt-16 px-4 md:px-10">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-600 mb-2">
        <Link to="/">Home</Link> /{" "}
        <Link to="/products">Products</Link> /{" "}
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {product.category}
        </Link>{" "}
        / <span className="text-indigo-500">{product.name}</span>
      </p>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row gap-10 mt-4">
        {/* Image Section */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {product.image.map((img, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(img)}
                className="border border-gray-300 max-w-24 rounded cursor-pointer overflow-hidden"
              >
                <img src={img} alt={`Thumbnail ${index}`} />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="border border-gray-300 max-w-[300px] md:max-w-[400px] rounded overflow-hidden">
            <img src={thumbnail} alt="Selected product" />
          </div>
        </div>

        {/* Product Info */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          {/* Ratings */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < Math.round(product.rating || 4) ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                  className="md:w-4 w-3.5"
                />
              ))}
            <p className="text-base ml-2">({product.rating || 4})</p>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-gray-500 line-through">MRP: {currency}{product.price}</p>
            <p className="text-2xl font-medium">
              Deal Price: {currency}{product.offerPrice}
            </p>
            <span className="text-gray-500">(inclusive of all taxes)</span>
          </div>

          {/* Description */}
          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-600">
            {product.description.map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="flex items-center mt-10 gap-4 text-base">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                addToCart(product._id);
                navigate('/cart');
              }}
              className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


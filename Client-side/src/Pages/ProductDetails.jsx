import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import ProductCard from "../Components/ProductCard";

const ProductDetails = () => {
  const { products, currency, addToCart } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundProduct = products.find((item) => item._id === id);
    setProduct(foundProduct);
  }, [id, products]);

  useEffect(() => {
    if (product) {
      setThumbnail(product.image?.[0] || null);

      const productCategories = Array.isArray(product.category)
        ? product.category.map((c) => String(c).toLowerCase())
        : [String(product.category).toLowerCase()];
      
      const filtered = products.filter(item => 
        item._id !== product._id &&
        item.inStock &&
        (Array.isArray(item.category)
          ? item.category.some(c => productCategories.includes(String(c).toLowerCase()))
          : productCategories.includes(String(item.category).toLowerCase()))
      );
      setRelatedProducts(filtered.slice(0, 5));
    }
  }, [product, products]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-xl text-gray-500">Product not found.</p>
      </div>
    );
  }

  const breadcrumbCategory = Array.isArray(product.category) ? product.category[0] : product.category;

  return (
    <section className="mt-16 px-4 md:px-10">
      <p className="text-sm text-gray-600 mb-2">
        <Link to="/">Home</Link> /{" "}
        <Link to="/products">Products</Link> /{" "}
        <Link to={`/products/${String(breadcrumbCategory).toLowerCase()}`}>
          {String(breadcrumbCategory)}
        </Link> / <span className="text-primary">{product.name}</span>
      </p>

      <div className="flex flex-col md:flex-row gap-10 mt-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.image?.map((img, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(img)}
                className={`border ${thumbnail === img ? 'border-primary' : 'border-gray-300'} max-w-24 rounded cursor-pointer overflow-hidden`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="border border-gray-300 max-w-[300px] md:max-w-[400px] rounded overflow-hidden flex items-center justify-center">
            <img src={thumbnail || "https://via.placeholder.com/400"} alt={product.name} />
          </div>
        </div>

        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>
          <div className="flex items-center gap-1 mt-1">
            {Array(5).fill("").map((_, i) => (
              <img key={i} src={i < Math.round(product.rating || 4) ? assets.star_icon : assets.star_dull_icon} alt="star" className="md:w-4 w-3.5" />
            ))}
            <p className="text-base ml-2">({product.rating?.toFixed(1) || '4.0'})</p>
          </div>
          <div className="mt-6">
            <p className="text-gray-500 line-through">MRP: {currency}{product.price}</p>
            <p className="text-2xl font-medium text-primary">Deal Price: {currency}{product.offerPrice}</p>
            <span className="text-gray-500">(inclusive of all taxes)</span>
          </div>
          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-600 space-y-1">
            {(Array.isArray(product.description) ? product.description : [product.description]).map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>
          <div className="flex items-center mt-10 gap-4 text-base">
            <button onClick={() => addToCart(product._id)} className="w-full py-3.5 font-medium bg-secondary text-gray-800 hover:bg-primary/20 transition rounded-xl">Add to Cart</button>
            <button onClick={() => { addToCart(product._id); navigate("/cart"); }} className="w-full py-3.5 font-medium bg-primary text-white hover:bg-primary-dull transition rounded-xl">Buy Now</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-20">
        <div className="flex flex-col items-center w-max">
          <p className="text-3xl font-medium">Related Products</p>
          <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6 w-full">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct._id} product={relatedProduct} />
          ))}
        </div>
        <button onClick={() => { navigate("/products"); }} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition">See more</button>
      </div>
    </section>
  );
};

export default ProductDetails;



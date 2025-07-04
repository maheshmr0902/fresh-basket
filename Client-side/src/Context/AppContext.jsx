import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { dummyProducts, categories as dummyCategories } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [user, setUser] = useState(null);
  const [isSeller, setSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [cartItems, setCartItems] = useState(() => {
    const local = localStorage.getItem("cartItems");
    return local ? JSON.parse(local) : {};
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orders, setOrders] = useState([]);

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      setProducts(Array.isArray(data) ? data : dummyProducts);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      toast.error("Failed to load products");
      setProducts(dummyProducts);
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/list");
      setCategories(Array.isArray(data.categories) ? data.categories : dummyCategories);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
      toast.error("Failed to load categories");
      setCategories(dummyCategories);
    }
  };

  // ✅ Fetch user
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Error fetching user:", err);
      setUser(null);
    }
  };

  // ✅ Fetch seller
const fetchSeller = async () => {
  try {
    const res = await axios.get("/api/seller/is-auth", {
      withCredentials: true // ✅ important!
    });
    setSeller(res.data.seller);
  } catch (error) {
    console.error("❌ Error fetching seller:", error);
  }
};


  // ✅ Cart Functions
  const addToCart = (itemId) => {
    const newCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(newCart);
    toast.success("Added to cart");
  };

  const updateCartItems = (itemId, quantity) => {
    const newCart = { ...cartItems };
    if (quantity <= 0) {
      delete newCart[itemId];
    } else {
      newCart[itemId] = quantity;
    }
    setCartItems(newCart);
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    const newCart = { ...cartItems };
    delete newCart[itemId];
    setCartItems(newCart);
    toast.success("Removed from cart");
  };

  const clearCart = () => {
    setCartItems({});
    toast.success("Cart cleared");
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const product = products.find((p) => p._id === id);
      return product ? total + product.price * qty : total;
    }, 0);
  };

  const addAddress = (newAddress) => {
    setAddressList((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    toast.success("Address added");
  };

  // ✅ Sync Cart with backend (with ObjectId validation)
  useEffect(() => {
    const syncCart = async () => {
      try {
        if (!user) return;

        const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

        const validCartArray = Object.entries(cartItems)
          .filter(([productId, quantity]) =>
            isValidObjectId(productId) && typeof quantity === 'number' && quantity > 0
          )
          .map(([product, quantity]) => ({ product, quantity }));

        if (validCartArray.length === 0) return;

        const { data } = await axios.post("/api/cart/update", { cartItems: validCartArray });
        if (!data.success) toast.error("Cart sync failed");
      } catch (err) {
        console.error("❌ Cart sync error:", err.response?.data?.message || err.message);
        toast.error("Error syncing cart.");
      }
    };

    syncCart();
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems, user]);

  // ✅ On mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchUser();
    fetchSeller();
  }, []);

  return (
    <AppContext.Provider
      value={{
        axios,
        toast,
        currency,
        user,
        setUser,
        isSeller,
        setSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        setProducts,
        categories,
        setCategories,
        cartItems,
        setCartItems,
        addToCart,
        updateCartItems,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartAmount,
        searchQuery,
        setSearchQuery,
        orders,
        setOrders,
        addressList,
        setAddressList,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        fetchUser,
        fetchSeller,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);













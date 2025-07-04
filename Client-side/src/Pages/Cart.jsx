import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    cartItems,
    products,
    getCartAmount,
    getCartCount,
    removeFromCart,
    updateCartItems,
    selectedAddress,
    setSelectedAddress,
    addressList,
    setAddressList,
    currency,
    user,
    axios,
    setCartItems,
  } = useAppContext();

  const navigate = useNavigate();
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [loading, setLoading] = useState(false);

  // Memoize cart array
  const cartArray = useMemo(() => {
    return Object.keys(cartItems)
      .map((key) => {
        const product = products.find((item) => item._id === key);
        return product ? { ...product, quantity: cartItems[key] } : null;
      })
      .filter(Boolean);
  }, [cartItems, products]);

  // Load user addresses
  useEffect(() => {
    const getUserAddresses = async () => {
      if (!user) return;
      try {
        const { data } = await axios.post("/api/address/get");
        if (data.success) {
          setAddressList(data.addresses);
          if (data.addresses.length > 0 && !selectedAddress) {
            setSelectedAddress(data.addresses[0]);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching addresses:", error);
        toast.error(error.response?.data?.message || "Failed to fetch addresses.");
      }
    };
    getUserAddresses();
  }, [user, axios, setAddressList, setSelectedAddress, selectedAddress]);

  const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);

  const placeOrder = async () => {
    if (!selectedAddress || !selectedAddress._id) {
      return toast.error("Please select or add a valid delivery address.");
    }

    // Filter only valid items
    const validItems = cartArray.filter((item) => isValidObjectId(item._id));
    if (validItems.length === 0) {
      return toast.error("No valid products to order. Please refresh the cart.");
    }

    setLoading(true);
    try {
      if (paymentOption === "Online") {
        navigate("/payments");
        return;
      }

      const orderPayload = {
        items: validItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
      };

      console.log("📦 Order Payload:", orderPayload);

      const { data } = await axios.post("/api/order/cod", orderPayload);

      if (data.success) {
        toast.success("✅ Order placed successfully!");
        setCartItems({});
        navigate("/my-orders");
      } else {
        toast.error(data.message || "Order failed.");
      }
    } catch (error) {
      console.error("❌ Error placing order:", error);
      toast.error(error.response?.data?.message || "Something went wrong while placing order.");
    } finally {
      setLoading(false);
    }
  };

  if (cartArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] mt-24 text-center">
        <img src={assets.empty_cart} alt="Empty Cart" className="w-40 mb-6" />
        <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const subtotal = getCartAmount();
  const tax = subtotal * 0.02;
  const totalAmount = subtotal + tax;

  return (
    <div className="flex flex-col md:flex-row py-16 mt-16 gap-8">
      {/* Left: Cart Items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart <span className="text-sm text-indigo-500">{getCartCount()} Items</span>
        </h1>
        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 font-medium pb-3 border-b">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div key={product._id} className="grid grid-cols-[2fr_1fr_1fr] items-center text-sm md:text-base font-medium py-3 border-b">
            <div className="flex items-center md:gap-6 gap-3">
              <img
                onClick={() => navigate(`/products/${product.category[0]}/${product._id}`)}
                className="w-20 h-20 object-cover border rounded cursor-pointer"
                src={product.image[0]}
                alt={product.name}
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <div className="flex items-center mt-1">
                  <p className="text-sm">Qty:</p>
                  <select
                    value={product.quantity}
                    onChange={(e) => updateCartItems(product._id, parseInt(e.target.value))}
                    className="ml-2 border px-1 py-0.5 rounded"
                  >
                    {[...Array(10).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <p className="text-center">
              {currency}
              {(product.offerPrice * product.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
              title="Remove from cart"
            >
              <img src={assets.remove_icon} alt="remove" className="w-6 h-6" />
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="group flex items-center mt-8 gap-2 text-indigo-500 font-medium"
        >
          <img src={assets.arrow_right_icon_colored} alt="arrow" className="group-hover:-translate-x-1 transition" />{" "}
          Continue Shopping
        </button>
      </div>

      {/* Right: Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 h-fit border rounded-lg">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-4" />

        <div className="mb-4">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative mt-2">
            <div className="p-2 border rounded bg-white text-gray-600 text-sm">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                : "No address selected."}
            </div>
            <button
              onClick={() => setShowAddressDropdown(!showAddressDropdown)}
              className="text-indigo-500 hover:underline cursor-pointer text-sm mt-1"
            >
              Change
            </button>

            {showAddressDropdown && (
              <div className="absolute top-full right-0 py-1 bg-white border border-gray-300 text-sm w-full z-10 rounded shadow-lg mt-1">
                {addressList.map((addr) => (
                  <p
                    key={addr._id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setShowAddressDropdown(false);
                    }}
                    className="text-gray-600 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {addr.firstName} - {addr.street}, {addr.city}
                  </p>
                ))}
                <p
                  onClick={() => {
                    setShowAddressDropdown(false);
                    navigate("/address");
                  }}
                  className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-50/50"
                >
                  ➕ Add New Address
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium uppercase">Payment Method</p>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border rounded bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="mt-4 space-y-2 text-gray-600">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {currency}
              {subtotal.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              {currency}
              {tax.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3 text-black">
            <span>Total</span>
            <span>
              {currency}
              {totalAmount.toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 bg-primary text-white font-medium rounded hover:bg-primary-dull transition disabled:bg-gray-400"
          disabled={loading || !selectedAddress}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Cart;




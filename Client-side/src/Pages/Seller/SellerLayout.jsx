import React, { useState } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
  const { axios, user, setUser } = useAppContext(); // Assuming setUser is available in context
  const navigate = useNavigate();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const sidebarLinks = [
    { name: "Add Products", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    setLogoutLoading(true);
    const toastId = toast.loading("Logging out...");
    try {
      const { data } = await axios.get('/api/seller/logout');
      if (data.success) {
        toast.success("Logout successful", { id: toastId });
        if (setUser) setUser(null); // Clear user from global state
        navigate('/');
      } else {
        toast.error(data.message || "Logout failed", { id: toastId });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "An error occurred", { id: toastId });
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="md:w-64 w-20 flex flex-col border-r border-gray-200 bg-white">
        <div className="px-4 py-3 border-b">
          <Link to="/">
            <img src={assets.logo} alt="logo" className="h-14 w-auto object-contain" />
          </Link>
        </div>
        <nav className="flex-grow pt-4">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center py-3 px-6 gap-4 transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 border-primary text-primary border-r-4 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <img src={item.icon} alt="" className="w-6 h-6" />
              <p className="md:block hidden">{item.name}</p>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-end px-4 md:px-8 border-b border-gray-200 py-3 bg-white">
          <div className="flex items-center gap-4 text-gray-700">
            <p className="font-medium">
              Welcome, {user?.name || "Admin"}
            </p>
            <button
              onClick={logout}
              className="border rounded-md px-4 py-1.5 bg-primary text-white hover:bg-primary-dull transition disabled:bg-gray-400"
              disabled={logoutLoading}
            >
              {logoutLoading ? "Wait..." : "Logout"}
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;


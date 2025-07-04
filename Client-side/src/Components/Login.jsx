// src/Pages/Login.jsx

import React, { useEffect, useState } from "react";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { axios, setUser, setCartItems, setShowUserLogin } = useAppContext();
  const navigate = useNavigate();

  const [state, setState] = useState("login"); // login | register
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password || (state === "register" && !username)) {
      return toast.error("Please fill in all required fields.");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    const payload = { email, password };
    if (state === "register") payload.username = username;

    try {
      const { data } = await axios.post(`/api/user/${state}`, payload);
      if (data?.user && data?.user.email) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
        toast.success(data.message || "Welcome!");
        setShowUserLogin?.(false);
        navigate("/");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Login/Signup Error:", error);
      toast.error(error?.response?.data?.message || "Server error");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      onClick={() => setShowUserLogin?.(false)}
      className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-lg bg-white text-black border border-gray-300"
      >
        <button
          type="button"
          onClick={() => setShowUserLogin?.(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder="Type your name"
              className="border border-gray-300 rounded w-full p-2 mt-1"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type your email"
            className="border border-gray-300 rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full relative">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type your password"
            className="border border-gray-300 rounded w-full p-2 mt-1"
            type={showPassword ? "text" : "password"}
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <p className="text-sm">
          {state === "register" ? "Already have an account?" : "Create an account?"}{" "}
          <span
            onClick={() => setState(state === "register" ? "login" : "register")}
            className="text-indigo-500 cursor-pointer"
          >
            Click here
          </span>
        </p>

        <button className="bg-indigo-500 hover:bg-indigo-600 text-white w-full py-2 rounded-md">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;







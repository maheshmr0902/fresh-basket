import React, { useEffect, useState } from 'react';
import { useAppContext } from '../Context/AppContext';

const Login = () => {
  const { setShowUserLogin ,setUser} = useAppContext();

  const [state, setState] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onSubmitHandler=async(event)=>{
    event.preventDefault();
   
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/50"
    >
      <form
      onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 text-white bg-pvt"
      >
        {/* ❌ X Close Icon */}
        <button
          type="button"
          onClick={() => setShowUserLogin(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">User</span>{' '}
          {state === 'login' ? 'Login' : 'Sign Up'}
        </p>

        {state === 'register' && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type your name"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
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
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type your password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        {state === 'register' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('login')}
              className="text-indigo-500 cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{' '}
            <span
              onClick={() => setState('register')}
              className="text-indigo-500 cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}

        <button className="bg-primary hover:bg-secondary transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === 'register' ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;



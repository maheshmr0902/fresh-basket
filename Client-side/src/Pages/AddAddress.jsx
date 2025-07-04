// ✅ AddAddress.jsx

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const AddAddress = () => {
  const {
    axios,
    user,
    setAddressList,
    setSelectedAddress,
    addressList,
  } = useAppContext();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/address/add', formData);
      if (data.success) {
        toast.success("Address added successfully!");
        const updatedList = [...addressList, data.address];
        setAddressList(updatedList);
        setSelectedAddress(data.address);
        navigate('/cart');
      } else {
        toast.error(data.message || 'Failed to add address');
      }
    } catch (err) {
      console.error("Error adding address:", err);
      toast.error(
        err.response?.data?.message || 'Failed to add address. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      toast.error("Please login to add an address");
      navigate('/cart');
    }
  }, [user, navigate]);

  return (
    <div className="mt-16 pb-16 px-4 md:px-10">
      <p className="text-2xl font-semibold mb-4 text-gray-700">
        Add Shipping <span className="text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="firstName" value={formData.firstName} placeholder="First Name" required onChange={handleChange} className="border p-2 rounded w-full" autoComplete="given-name" />
              <input type="text" name="lastName" value={formData.lastName} placeholder="Last Name" required onChange={handleChange} className="border p-2 rounded w-full" autoComplete="family-name" />
            </div>
            <input type="email" name="email" value={formData.email} placeholder="Email" required onChange={handleChange} className="border p-2 rounded w-full" autoComplete="email" />
            <input type="text" name="phone" value={formData.phone} placeholder="Phone Number" required onChange={handleChange} className="border p-2 rounded w-full" autoComplete="tel" />
            <input type="text" name="street" value={formData.street} placeholder="Street Address" required onChange={handleChange} className="border p-2 rounded w-full" autoComplete="street-address" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="city" value={formData.city} placeholder="City" required onChange={handleChange} className="border p-2 rounded w-full" autoComplete="address-level2" />
              <input type="text" name="state" value={formData.state} placeholder="State" required onChange={handleChange} className="border p-2 rounded w-full" autoComplete="address-level1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="zipcode" value={formData.zipcode} placeholder="Zip Code" required onChange={handleChange} className="border p-2 rounded w-full" autoComplete="postal-code" />
              <input type="text" name="country" value={formData.country} placeholder="Country" required onChange={handleChange} className="border p-2 rounded w-full" autoComplete="country" />
            </div>
            <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition" disabled={loading}>
              {loading ? "Saving..." : "Save Address"}
            </button>
          </form>
        </div>
        <img className="w-full md:w-[400px] md:ml-10 mb-10 md:mb-0" src={assets.add_address_iamge} alt="Add Address" />
      </div>
    </div>
  );
};

export default AddAddress;


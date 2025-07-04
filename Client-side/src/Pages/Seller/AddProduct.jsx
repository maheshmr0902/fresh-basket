import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [files, setFiles] = useState(Array(4).fill(null));
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    offerPrice: '',
  });
  const [loading, setLoading] = useState(false);

  const { axios, categories, fetchCategories, fetchProducts } = useAppContext();

  useEffect(() => {
    if (!categories || categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  const handleFileChange = (e, index) => {
    const newFiles = [...files];
    if (e.target.files[0]) {
      newFiles[index] = e.target.files[0];
      setFiles(newFiles);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFiles(Array(4).fill(null));
    setProductData({
      name: '', description: '', category: '', price: '', offerPrice: '',
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (parseFloat(productData.offerPrice) > parseFloat(productData.price)) {
      toast.error("Offer price cannot be greater than the product price.");
      return;
    }
    setLoading(true);
    try {
      const dataToSend = {
        ...productData,
        description: productData.description.split('\n').filter(line => line.trim() !== ''),
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(dataToSend));
      files.forEach(file => {
        if (file) formData.append('images', file);
      });

      const { data } = await axios.post('/api/product/add', formData);
      if (data.success) {
        toast.success("Product added successfully!");
        resetForm();
        fetchProducts(); // Refresh product list
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-sm">
      <form onSubmit={onSubmitHandler} className="space-y-6 max-w-2xl mx-auto">
        <div>
          <p className="text-base font-medium mb-2">Product Images (up to 4)</p>
          <div className="flex flex-wrap items-center gap-4">
            {files.map((file, index) => (
              <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                <input type="file" id={`image${index}`} accept="image/*" hidden onChange={(e) => handleFileChange(e, index)} />
                <img className="w-24 h-24 object-cover border-2 border-dashed rounded-md flex items-center justify-center" src={file ? URL.createObjectURL(file) : assets.upload_area} alt={`Upload Preview ${index + 1}`} />
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-base font-medium">Product Name</label>
          <input id="name" name="name" type="text" placeholder="e.g., Organic Bananas" required value={productData.name} onChange={handleChange} className="outline-none py-2 px-3 rounded border border-gray-400 focus:border-primary" />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-base font-medium">Product Description (one point per line)</label>
          <textarea id="description" name="description" rows={4} placeholder="e.g., Fresh and rich in potassium..." required value={productData.description} onChange={handleChange} className="outline-none py-2 px-3 rounded border border-gray-400 resize-y focus:border-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="category" className="text-base font-medium">Category</label>
            <select id="category" name="category" required value={productData.category} onChange={handleChange} className="outline-none py-2 px-3 rounded border border-gray-400 bg-white focus:border-primary">
              <option value="" disabled>Select Category</option>
              {(categories || []).map((item) => (
                <option key={item._id} value={item.path}>{item.text}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="price" className="text-base font-medium">Product Price</label>
            <input id="price" name="price" type="number" placeholder="50" min="0" required value={productData.price} onChange={handleChange} className="outline-none py-2 px-3 rounded border border-gray-400 focus:border-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="offerPrice" className="text-base font-medium">Offer Price</label>
            <input id="offerPrice" name="offerPrice" type="number" placeholder="45" min="0" required value={productData.offerPrice} onChange={handleChange} className="outline-none py-2 px-3 rounded border border-gray-400 focus:border-primary" />
          </div>
        </div>

        <button type="submit" className="px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-primary-dull transition disabled:bg-gray-400" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;




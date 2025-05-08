'use client';

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

interface CategoryFormData {
  name: string;
  image?: File | null;
}

const AddCategoryPage = () => {
  const [categoryData, setCategoryData] = useState<CategoryFormData>({
    name: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCategoryData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setCategoryData((prevData) => ({
      ...prevData,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!categoryData.name) {
      setError('Please fill in the category name.');
      setLoading(false);
      return;
    }

    if (categoryData.name.length < 2) {
      setError('Category name must be at least 2 characters long.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', categoryData.name);
    if (categoryData.image) {
      formData.append('image', categoryData.image);
    }

    try {
      const response = await fetch('/api/admin/addcategory', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Category added successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
        });
        // Clear the form fields after success
        setCategoryData({ name: '', image: null });
        setImagePreview(null);
      } else {
        toast.error(data.error || 'An error occurred while adding the category.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
        });
      }
    } catch (err) {
      console.error('Error adding category:', err);
      toast.error('An error occurred while adding the category.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 to-blue-500 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full transform transition-transform duration-300 ease-in-out hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-teal-600 mb-6">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-lg font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700"
            />

            {imagePreview && (
              <div className="mt-4 relative">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md"
                  width={200}
                  height={150}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all"
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <svg
                  className="w-6 h-6 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="4"
                    d="M4 12a8 8 0 018-8m0 0a8 8 0 010 16"
                  ></path>
                </svg>
                <span className="ml-2">Adding Category...</span>
              </span>
            ) : (
              'Add Category'
            )}
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddCategoryPage;

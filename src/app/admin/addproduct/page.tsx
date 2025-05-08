"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FaImage, FaTimes, FaSpinner } from "react-icons/fa"; // Import the spinner icon
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  name: string;
  description: string;
  mrp: number;
  offerPrice: number;
  stock: number;
  images: File[];
  category?: string;
}

const Page = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    mrp: 0,
    offerPrice: 0,
    stock: 0,
    images: [],
    category: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // State to manage the loading spinner

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/addcategory");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]:
        name === "mrp" || name === "offerPrice" || name === "stock"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setProduct((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("mrp", product.mrp.toString());
    formData.append("offerPrice", product.offerPrice.toString());
    formData.append("stock", product.stock.toString());
    formData.append("category", product.category || "");

    product.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const response = await fetch(`/api/admin/addProduct`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        setProduct({
          name: "",
          description: "",
          mrp: 0,
          offerPrice: 0,
          stock: 0,
          images: [],
          category: "",
        });
      } else {
        toast.error("Failed to add product.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while adding the product.");
    } finally {
      setLoading(false); // Set loading to false after the product is added
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-semibold text-center mb-8 text-black">
        Add New Product
      </h2>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <motion.div
            className="flex flex-col"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="name" className="text-lg font-medium mb-2 text-black">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black transition duration-300"
              required
            />
          </motion.div>

          {/* Product Category */}
          <motion.div
            className="flex flex-col"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="category" className="text-lg font-medium mb-2 text-black">
              Product Category
            </label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black transition duration-300"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Product Images */}
          <motion.div
            className="flex flex-col"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="images" className="text-lg font-medium mb-2 text-black">
              Product Images
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="image-upload"
                className="cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
              >
                <FaImage /> <span>Upload Images</span>
              </label>
              <input
                type="file"
                id="image-upload"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="flex flex-wrap mt-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative mr-4 mb-4">
                  <Image
                    width={100}
                    height={100}
                    src={URL.createObjectURL(image)}
                    alt={`Product preview ${index}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 p-2 text-white bg-red-500 rounded-full"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Description */}
          <motion.div
            className="flex flex-col"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="description" className="text-lg font-medium mb-2 text-black">
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black transition duration-300"
              required
            />
          </motion.div>

          {/* MRP */}
          <motion.div
            className="flex flex-col"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="mrp" className="text-lg font-medium mb-2 text-black">
              MRP (Max Retail Price)
            </label>
            <input
              type="number"
              id="mrp"
              name="mrp"
              value={product.mrp}
              onChange={handleChange}
              placeholder="Enter MRP"
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black transition duration-300"
              required
            />
          </motion.div>

          {/* Offer Price */}
          <motion.div
            className="flex flex-col"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="offerPrice" className="text-lg font-medium mb-2 text-black">
              Offer Price
            </label>
            <input
              type="number"
              id="offerPrice"
              name="offerPrice"
              value={product.offerPrice}
              onChange={handleChange}
              placeholder="Enter offer price"
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black transition duration-300"
              required
            />
          </motion.div>

          {/* Stock */}
          <motion.div
            className="flex flex-col"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="stock" className="text-lg font-medium mb-2 text-black">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              className="p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black transition duration-300"
              required
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading} // Disable the button when loading
          >
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Add Product"
            )}
          </motion.button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </motion.div>
  );
};

export default Page;

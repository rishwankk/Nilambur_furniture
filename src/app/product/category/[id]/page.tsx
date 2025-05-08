"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Product = {
  _id: number;
  name: string;
  offerPrice: number;
  mrp: number;
  category: string;
  images: string[];
  stock: number;
};

const CategoryPage = () => {
  const { id } = useParams(); // Get category id from the URL parameter
  const router = useRouter(); // Router for navigation
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [sortOrder, setSortOrder] = useState("low-to-high");
  const [filterInStock, setFilterInStock] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const fetchProducts = useCallback(async (category: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/user?category=${category}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: Product[] = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error("Invalid data format received.");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredProducts = () => {
    let filtered = [...products];
    filtered = filtered.filter(
      (product) =>
        product.offerPrice >= priceRange[0] && product.offerPrice <= priceRange[1]
    );

    if (sortOrder === "low-to-high") {
      filtered.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOrder === "high-to-low") {
      filtered.sort((a, b) => b.offerPrice - a.offerPrice);
    }

    if (filterInStock) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    return filtered;
  };

  useEffect(() => {
    if (typeof id === "string") {
      fetchProducts(id);
    }
  }, [id, fetchProducts]);

  return (
    <div className="flex flex-col lg:flex-row p-6 space-y-6 lg:space-x-6">
      <div className="lg:w-1/4 p-4 bg-white border rounded-lg shadow-md mb-6 lg:mb-0">
        <h3 className="text-lg font-semibold mb-4 text-black">Filters</h3>
        <div className="mb-4">
          <label className="text-sm font-semibold mb-2 block text-black">Price Range</label>
          <input
            type="range"
            min={0}
            max={5000}
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="w-full"
          />
          <input
            type="range"
            min={0}
            max={5000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            className="w-full mt-2"
          />
          <div className="flex justify-between text-sm mt-2">
            <span className="text-black">${priceRange[0]}</span>
            <span className="text-black">${priceRange[1]}</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="flex items-center space-x-2 text-sm text-black">
            <input
              type="checkbox"
              checked={filterInStock}
              onChange={() => setFilterInStock(!filterInStock)}
              className="form-checkbox"
            />
            <span>In Stock Only</span>
          </label>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-black">Sort by Price</h4>
          <label className="flex items-center space-x-2 text-sm text-black">
            <input
              type="radio"
              name="sortPrice"
              checked={sortOrder === "low-to-high"}
              onChange={() => setSortOrder("low-to-high")}
              className="form-radio"
            />
            <span>Low to High</span>
          </label>
          <label className="flex items-center space-x-2 text-sm text-black mt-2">
            <input
              type="radio"
              name="sortPrice"
              checked={sortOrder === "high-to-low"}
              onChange={() => setSortOrder("high-to-low")}
              className="form-radio"
            />
            <span>High to Low</span>
          </label>
        </div>
      </div>
      <main className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-black">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-black">No products available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts().map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-white p-4 border rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => router.push(`/product/${product._id}`)} // Navigate on click
                >
                  <Image
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name || "Product Image"}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-sm font-semibold text-black truncate">{product.name}</h3>
                  <div className="text-sm text-gray-600 flex items-center space-x-2">
                    <span className="line-through text-red-500">
                      ${product.mrp}
                    </span>
                    <span className="text-black font-bold">${product.offerPrice}</span>
                  </div>
                  {product.stock === 0 && (
                    <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;

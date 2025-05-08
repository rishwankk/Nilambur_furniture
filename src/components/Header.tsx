"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "../../public/mainlogo.png";
import Link from "next/link";
import { FiSearch } from "react-icons/fi"; // Importing the search icon
import { GiShoppingCart } from "react-icons/gi"; // Importing the cart icon

interface Item {
  id: number;
  name: string;
}

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<number>(0); // Initialize with 0
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to hold search query
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // State to hold filtered results
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to track loading state
  const [error, setError] = useState<string | null>(null); // State to hold any errors

  // Toggle Menu
  const toggleMenu = (): void => setMenuOpen(!menuOpen);

  // Update cart items from localStorage
  useEffect(() => {
    const cartData = localStorage.getItem("cart"); // Retrieve cart data
    const items = cartData ? JSON.parse(cartData) : []; // Parse or fallback to empty array
    setCartItems(items.length); // Set the cart items count
  }, []);

  // Fetch items from the backend API based on the search query
  const fetchSearchResults = async (query: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/items?search=${query}`);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data: Item[] = await response.json();
      setFilteredItems(data); // Set filtered items
    } catch (err) {
      setError("An error occurred while fetching search results.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 3) { // Start searching when 3 or more characters are entered
      fetchSearchResults(query);
    } else {
      setFilteredItems([]); // Clear results if search query is too short
    }
  };

  return (
    <header className="bg-sky-200 text-black h-20 shadow-md">
      <nav className="flex items-center justify-between h-full px-6 md:px-10">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image src={logo} alt="Logo" className="h-16 w-auto" priority />
          </Link>
        </div>

        {/* Search Input */}
        <div className="flex flex-1 justify-center px-4 relative">
          <div className="relative w-full max-w-xs sm:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full h-10 pl-4 pr-10 rounded-full shadow-sm focus:ring-2 focus:ring-sky-300 focus:outline-none"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Display search results */}
          {searchQuery && (
            <div className="absolute left-0 w-full bg-white shadow-lg mt-2 rounded-md z-10">
              {isLoading ? (
                <p className="px-4 py-2 text-gray-500">Loading...</p>
              ) : error ? (
                <p className="px-4 py-2 text-red-500">{error}</p>
              ) : filteredItems.length > 0 ? (
                <ul>
                  {filteredItems.map(item => (
                    <li key={item.id} className="px-4 py-2 text-gray-800 hover:bg-gray-200">
                      <Link href={`/item/${item.id}`}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-2 text-gray-500">No results found</p>
              )}
            </div>
          )}
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex space-x-6 text-sm font-medium">
          <li className="hover:text-gray-500 cursor-pointer">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-gray-500 cursor-pointer">
            <Link href="/about">About</Link>
          </li>
          <li className="hover:text-gray-500 cursor-pointer">
            <Link href="/contact">Contact</Link>
          </li>
          <li className="hover:text-gray-500 cursor-pointer">
            <Link href="/services">Services</Link>
          </li>
        </ul>

        {/* Cart Icon */}
        <div className="relative flex items-center space-x-4">
          <Link href="/cart" className="text-lg relative">
            <GiShoppingCart className="text-2xl text-gray-800 hover:text-gray-500" />
            {cartItems > 0 && (
              <span className="absolute top-0 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className="block sm:hidden text-lg cursor-pointer"
          onClick={toggleMenu}
        >
          ☰
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="sm:hidden flex flex-col items-center space-y-4 text-sm font-medium bg-sky-100 p-4 shadow-lg">
          <li>
            <Link href="/" className="hover:text-gray-500 cursor-pointer">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-500 cursor-pointer">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-500 cursor-pointer">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/services" className="hover:text-gray-500 cursor-pointer">
              Services
            </Link>
          </li>
          {/* Close Button for mobile menu */}
          <li>
            <button
              onClick={toggleMenu}
              className="text-lg font-semibold hover:text-gray-500 mt-4"
            >
              Close Menu
            </button>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Header;

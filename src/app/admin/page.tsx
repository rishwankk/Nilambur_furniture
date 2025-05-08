"use client";

import React, { useEffect, useState } from "react";
import { FaPlusCircle, FaList, FaTags, FaImage, FaFolderPlus, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminHomePage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.replace('/admin/login');
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.replace('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const routes = [
    { path: "/admin/addproduct", name: "Add Product", icon: <FaPlusCircle className="text-blue-600 text-2xl" /> },
    { path: "/admin/viewproducts", name: "View Products", icon: <FaList className="text-green-600 text-2xl" /> },
    { path: "/admin/setspecialoffer", name: "Set Special Offer", icon: <FaTags className="text-yellow-600 text-2xl" /> },
    { path: "/admin/addbanner", name: "Add Banner", icon: <FaImage className="text-purple-600 text-2xl" /> },
    { path: "/admin/addcategories", name: "Add Categories", icon: <FaFolderPlus className="text-pink-600 text-2xl" /> },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.path}
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center space-x-4">
              {route.icon}
              <span className="text-lg font-medium text-gray-700">{route.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminHomePage;

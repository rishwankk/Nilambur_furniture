"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface BannerData {
  _id: string;
  title: string;
  imageUrl: string;
}

const Banner = () => {
  const [banners, setBanners] = useState<BannerData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/banner", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }

        const data = await response.json();
        setBanners(data.banners || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [banners]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="text-black text-2xl text-center p-8 bg-gray-100 rounded-lg">
        No banners available
      </div>
    );
  }

  return (
    <div className="relative max-w-screen-xl mx-auto overflow-hidden rounded-xl shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full"
        >
          <Image
            src={banners[currentImageIndex].imageUrl}
            alt={banners[currentImageIndex].title}
            width={1920}
            height={300}
            className="w-full sm:h-[200px] md:h-[270px] lg:h-[300px] xl:h-[350px] object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Banner Content */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-6 shadow-text">
              {banners[currentImageIndex].title}
            </h2>
            <Link href="/shop" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-3 rounded-full font-semibold 
                          shadow-lg transition-all duration-300 hover:bg-black hover:text-white
                          hover:shadow-xl"
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 
                      ${currentImageIndex === index 
                        ? "bg-white scale-110 shadow-lg" 
                        : "bg-white/50 hover:bg-white/75"}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentImageIndex((prev) => (prev - 1 + banners.length) % banners.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 
                  p-2 rounded-full backdrop-blur-sm transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentImageIndex((prev) => (prev + 1) % banners.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 
                  p-2 rounded-full backdrop-blur-sm transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Banner;

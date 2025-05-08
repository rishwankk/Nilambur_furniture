"use client";

import React from "react";
import Link from "next/link";
import Image from 'next/image';
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    mrp: number;
    offerPrice: number;
    images: string[];
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercentage = Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="w-[280px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/product/${product._id}`}>
        <div className="relative group">
          <div className="relative h-[280px] overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 280px) 100vw, 280px"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                {discountPercentage}% OFF
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {product.name}
            </h3>
            
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-bold text-green-600">
                  ₹{product.offerPrice.toLocaleString()}
                </p>
                {discountPercentage > 0 && (
                  <p className="text-sm text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString()}
                  </p>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium
                         hover:bg-gray-800 transition-colors duration-300"
              >
                Shop Now
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

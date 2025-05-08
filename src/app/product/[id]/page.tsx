"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { FaSpinner, FaShoppingCart, FaHeart, FaShare, FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  offerPrice: number;
  mrp?: number;
  images: string[];
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

const formatWhatsAppMessage = (product: Product, quantity: number, pageUrl: string) => {
  const message = `
*New Order Inquiry*
------------------
Product: ${product.name}
Price: $${product.offerPrice}
Quantity: ${quantity}
Total: $${product.offerPrice * quantity}
------------------
Product Link: ${pageUrl}

I'm interested in purchasing this product. Please provide payment and delivery details.
`;
  return encodeURIComponent(message);
};

const ProductDetail = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product?product=${id}`);
        if (response.ok) {
          const data: Product = await response.json();
          console.log(data, "Product data fetched successfully");
          setProduct(data);
          setSelectedImage(data.images?.[0] || "/placeholder-image.png");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    try {
      const cartData = localStorage.getItem("cart");
      const parsedCart: CartItem[] = cartData ? JSON.parse(cartData) : [];
      setCart(parsedCart);
      setIsInCart(parsedCart.some((item) => item._id === id));
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const updatedCart = [...cart];
    const productIndex = updatedCart.findIndex((item) => item._id === product._id);

    if (productIndex >= 0) {
      updatedCart[productIndex].quantity += quantity;
    } else {
      updatedCart.push({ _id: product._id, name: product.name, price: product.offerPrice, quantity });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setIsInCart(true);
    toast.success('Product added to cart!');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } catch (error) {
      toast.info('Share functionality not supported');
    }
  };

  const handleWhatsAppCheckout = () => {
    if (!product) return;

    const pageUrl = window.location.href;
    const message = formatWhatsAppMessage(product, quantity, pageUrl);
    const whatsappUrl = `https://wa.me/+917994776519?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const calculateDiscount = () => {
    if (product?.mrp && product?.offerPrice) {
      const discount = ((product.mrp - product.offerPrice) / product.mrp) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto" />
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl text-gray-400">😕</div>
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="bottom-right" />
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 truncate">
            {product.name}
          </h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 p-6">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={selectedImage || "/placeholder-image.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-3 mt-6 overflow-x-auto px-2 py-3 max-w-full">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      selectedImage === image
                        ? 'ring-4 ring-blue-500 ring-offset-4 shadow-xl scale-110'
                        : 'ring-1 ring-gray-200 hover:ring-blue-300 opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="w-full lg:w-1/2 p-6 lg:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">{product.description}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-full transition-colors ${
                      isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <FaHeart />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    <FaShare />
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-blue-600">
                    ₹{product.offerPrice}
                  </span>
                  {product.mrp && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product.mrp}
                      </span>
                      <span className="text-green-600 font-semibold">
                        {calculateDiscount()}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    min="1"
                    className="w-20 p-2 text-center border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isInCart ? (
                  <button
                    onClick={() => router.push("/cart")}
                    className="w-full py-4 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart />
                    View Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                )}
                
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-xl" />
                  Order via WhatsApp
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

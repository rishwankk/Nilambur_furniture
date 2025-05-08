'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
type CartItem = {
  _id: string;
  name: string;
  quantity: number;
};

type Product = {
  _id: string;
  name: string;
  offerPrice: number;
  images: string[];
};

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          const parsedCart: CartItem[] = JSON.parse(cartData);
          setCart(parsedCart);

          const productData = await Promise.all(
            parsedCart.map(async (item) => {
              const res = await fetch(`/api/product?product=${item._id}`);
              if (!res.ok) throw new Error('Failed to fetch product');
              return res.json();
            })
          );
          setProducts(productData);
        }
      } catch (error) {
        toast.error('Error loading cart items');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleQuantityChange = (id: string, quantity: number) => {
    // Ensure quantity is a valid number and not zero
    if (!quantity || quantity < 1) {
      toast.warning('Minimum quantity is 1');
      const updatedCart = cart.map((item) =>
        item._id === id ? { ...item, quantity: 1 } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return;
    }
    
    if (quantity > 99) {
      toast.warning('Maximum quantity limit reached');
      return;
    }

    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Cart updated successfully');
  };

  const handleDelete = (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    const cartDetails = cart
      .map((item) => {
        const product = products.find((p) => p._id === item._id);
        if (!product) return '';
        return `${product.name} (Qty: ${item.quantity}) - $${(
          product.offerPrice * item.quantity
        ).toFixed(2)}`;
      })
      .join('\n');

    const totalAmount = cart
      .reduce((total, item) => {
        const product = products.find((p) => p._id === item._id);
        return total + (product ? product.offerPrice * item.quantity : 0);
      }, 0)
      .toFixed(2);

    const message = `Hello! I would like to place an order for:\n\n${cartDetails}\n\nTotal: $${totalAmount}`;
    const whatsappUrl = `https://wa.me/917994776519?text=${encodeURIComponent(
      message
    )}`;

    localStorage.removeItem('cart');
    setCart([]);
    window.open(whatsappUrl, '_blank');
    toast.success('Redirecting to WhatsApp...');
  };

  const handleWhatsAppCheckout = () => {
    if (!products || cart.length === 0) return;

    const phoneNumber = "917994776519"; // Format: country code + phone number
    const pageUrl = window.location.href;
    const cartDetails = cart
      .map((item) => {
        const product = products.find((p) => p._id === item._id);
        if (!product) return '';
        return `${product.name} (Qty: ${item.quantity}) - $${(
          product.offerPrice * item.quantity
        ).toFixed(2)}`;
      })
      .join('\n');

    const totalAmount = cart
      .reduce((total, item) => {
        const product = products.find((p) => p._id === item._id);
        return total + (product ? product.offerPrice * item.quantity : 0);
      }, 0)
      .toFixed(2);

    const message = `Hello! I would like to place an order for:\n\n${cartDetails}\n\nTotal: $${totalAmount}\n\nPage URL: ${pageUrl}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-white p-6 sm:p-8 rounded-lg shadow-lg mx-4 sm:mx-0"
          >
            <FaShoppingCart className="mx-auto text-gray-400 text-4xl sm:text-6xl mb-4" />
            <h2 className="text-lg sm:text-xl font-medium text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4 sm:space-y-8">
            <AnimatePresence>
              {cart.map((item) => {
                const product = products.find((p) => p._id === item._id);
                if (!product) return null;

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow mx-0 sm:mx-0"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="relative w-full sm:w-32 h-48 sm:h-32 overflow-hidden rounded-lg">
                        <Image
                          src={product.images[0] || "/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="px-2 sm:px-3 py-2 hover:bg-gray-200 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <span className="text-base sm:text-lg font-medium">−</span>
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                handleQuantityChange(item._id, val);
                              }}
                              className="w-12 sm:w-14 text-center bg-white py-2 focus:outline-none text-sm sm:text-base"
                              min="1"
                              max="99"
                            />
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="px-2 sm:px-3 py-2 hover:bg-gray-200 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <span className="text-base sm:text-lg font-medium">+</span>
                            </button>
                          </div>
                          <span className="text-lg sm:text-xl font-bold text-green-600">
                            ${(product.offerPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(item._id)}
                        className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Remove item"
                      >
                        <FaTrashAlt size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mx-0 sm:mx-0">
              <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Order Summary</h2>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-base sm:text-lg text-gray-600">Total Amount</span>
                  <span className="text-2xl sm:text-3xl font-bold text-green-600">
                    ${cart.reduce((total, item) => {
                      const product = products.find((p) => p._id === item._id);
                      return total + (product ? product.offerPrice * item.quantity : 0);
                    }, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleCheckout}
                className="w-full py-3 sm:py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold text-base sm:text-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaShoppingCart size={20} />
                <span>Proceed to WhatsApp Checkout</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;

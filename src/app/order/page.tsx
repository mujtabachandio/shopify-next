"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { FaCheck, FaTimes, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

interface OrderDetails {
  username: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  notes?: string;
}

function OrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    username: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    notes: '',
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Get video details from URL params
  const videoId = searchParams.get('id');
  const videoTitle = searchParams.get('title');
  const videoPrice = searchParams.get('price');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderDetails.username || !orderDetails.phone || !orderDetails.country || 
        !orderDetails.city || !orderDetails.address) {
      alert('Please fill all required fields');
      return;
    }
    
    console.log('Order placed:', {
      ...orderDetails,
      videoId,
      videoTitle,
      videoPrice
    });
    
    setIsOrderPlaced(true);
  };

  const goBack = () => {
    router.back();
  };

  if (!videoId || !videoTitle || !videoPrice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center flex flex-col items-center justify-center">
        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/30 rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Invalid Order Request</h2>
          <p className="text-gray-300 mb-6">Video information is missing. Please go back and try again.</p>
          <button
            onClick={goBack}
            className="flex items-center justify-center bg-yellow-500/90 hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-medium transition-all"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={goBack}
          className="flex items-center text-yellow-400 hover:text-yellow-300 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span className="font-medium">Back to Videos</span>
        </button>

        <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700/30 rounded-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">
                Order for: {decodeURIComponent(videoTitle)}
              </h1>
              <p className="text-lg text-gray-300">Product ID: {videoId}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-2xl font-bold text-yellow-400 bg-gray-900/50 px-4 py-2 rounded-lg">
                Rs {videoPrice}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-gray-700/50 rounded-lg p-3">
            <FaShoppingCart className="text-yellow-400 text-xl mr-3" />
            <p className="text-gray-300">
              Complete your purchase by filling the delivery details below
            </p>
          </div>
        </div>

        {isOrderPlaced ? (
          <div className="bg-gray-800/60 backdrop-blur-md border border-green-500/30 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
              <FaCheck className="text-green-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-3">Order Confirmed!</h2>
            <p className="text-lg text-gray-300 mb-6">
              Thank you for your order. We will contact you soon for delivery updates.
            </p>
            <button
              onClick={goBack}
              className="bg-yellow-500/90 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-medium transition-all"
            >
              Browse More Videos
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-800/60 backdrop-blur-md border border-gray-700/30 rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-6 pb-4 border-b border-gray-700">
              Delivery Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name*</label>
                <input
                  type="text"
                  name="username"
                  value={orderDetails.username}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={orderDetails.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country*</label>
                <input
                  type="text"
                  name="country"
                  value={orderDetails.country}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City*</label>
                <input
                  type="text"
                  name="city"
                  value={orderDetails.city}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Address*</label>
                <input
                  type="text"
                  name="address"
                  value={orderDetails.address}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={orderDetails.notes}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700/50 border border-gray-600/50 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-medium transition-all"
              >
                <FaTimes className="mr-2" />
                Cancel Order
              </button>
              <button
                type="submit"
                className="flex items-center justify-center bg-yellow-500/90 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-medium transition-all"
              >
                <FaCheck className="mr-2" />
                Confirm Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-yellow-400">Loading order details...</div>}>
      <OrderContent />
    </Suspense>
  );
}
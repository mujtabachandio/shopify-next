"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ChevronDownIcon, ShoppingCartIcon, CheckIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCardProps {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  brandName: string;
  variantId?: string;
  variants?: Array<{
  id: string;
  title: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  }>;
}

export default function VideoCard({
  id,
  title,
  videoUrl,
  thumbnail,
  description,
  price,
  brandName,
}: VideoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDescription, setShowDescription] = useState(false);
  const { addItem, items } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  // Check if item is in cart
  useEffect(() => {
    setIsInCart(items.some(item => item.id === id));
  }, [items, id]);

  const isYouTubeVideo = videoUrl && (videoUrl.includes('youtube.com/embed') || videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com/watch'));

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    if (url.includes('youtube.com/embed/')) {
      return url.split('youtube.com/embed/')[1].split('?')[0];
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    }
    return null;
  };

  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  useEffect(() => {
    // Only set up video observer if this is actually a video
    if (isYouTubeVideo && videoId) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
          });
        },
        {
          threshold: 0.5,
        }
      );

      const currentContainer = containerRef.current;
      if (currentContainer) {
        observer.observe(currentContainer);
      }

      return () => {
        if (currentContainer) {
          observer.unobserve(currentContainer);
        }
      };
    }
  }, [title, videoId, isYouTubeVideo, watchUrl]);

  const handleAddToCart = () => {
    const cartItem = {
      id: id,
      title,
      price,
      quantity: 1,
      videoUrl,
      thumbnail
    };
    
    addItem(cartItem);
    setIsInCart(true);
  };

  // If this is not a video, just render the image
  if (!isYouTubeVideo || !videoUrl) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-[calc(100vh-4rem)] min-h-[600px] max-h-[800px] bg-black snap-start snap-always overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Bottom Info Section */}
        <div className="absolute bottom-0 pb-20 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
          <div className="space-y-4">
            {/* Title and Brand */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h2>
                <p className="text-sm text-white/80 font-medium">{brandName}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="text-xl font-bold text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  {price.currencyCode} {price.amount.toLocaleString()}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                    isInCart 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isInCart ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <CheckIcon className="w-5 h-5" />
                        <span>Added to Cart</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cart"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center space-x-2"
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Description Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowDescription(!showDescription)}
              className="flex items-center pb-20 text-white/70 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium">
                {showDescription ? 'Hide Description' : 'Show Description'}
              </span>
              <ChevronDownIcon 
                className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                  showDescription ? 'rotate-180' : ''
                }`}
              />
            </motion.button>

            {/* Description */}
            <AnimatePresence>
              {showDescription && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-4 pb-20 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10"
                >
                  <p className="text-sm text-white/90 leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={containerRef} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[calc(100vh-4rem)] min-h-[600px] max-h-[800px] bg-black snap-start snap-always overflow-hidden"
    >
      {isVisible && isYouTubeVideo && embedUrl ? (
        <iframe
          src={`${embedUrl}?autoplay=1&mute=1&controls=1&showinfo=0&rel=0&loop=1&playlist=${videoId}&modestbranding=1`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      )}

      {/* Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
        <div className="space-y-4">
          {/* Title and Brand */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h2>
              <p className="text-sm text-white/80 font-medium">{brandName}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className="text-xl font-bold text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                {price.currencyCode} {price.amount.toLocaleString()}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                  isInCart 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isInCart ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <CheckIcon className="w-5 h-5" />
                      <span>Added to Cart</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Description Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center text-white/70 hover:text-white transition-colors"
          >
            <span className="text-sm font-medium">
              {showDescription ? 'Hide Description' : 'Show Description'}
            </span>
            <ChevronDownIcon 
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                showDescription ? 'rotate-180' : ''
              }`}
            />
          </motion.button>

          {/* Description */}
          <AnimatePresence>
            {showDescription && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10"
              >
                <p className="text-sm text-white/90 leading-relaxed">
                  {description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
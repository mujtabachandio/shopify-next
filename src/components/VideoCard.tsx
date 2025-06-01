"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ChevronDownIcon, ShoppingCartIcon, CheckIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  image: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  category: string;
}

export default function VideoCard({ title, description, videoUrl, image, variants = { edges: [] }, category }: VideoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { addItem, items } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<{
    id: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    availableForSale: boolean;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  } | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Group variants by their options
  const variantOptions = useMemo(() => {
    if (!variants.edges || variants.edges.length === 0) return {};
    
    const options: Record<string, Set<string>> = {};
    variants.edges.forEach(({ node }) => {
      node.selectedOptions.forEach(({ name, value }) => {
        if (!options[name]) {
          options[name] = new Set();
        }
        options[name].add(value);
      });
    });
    return options;
  }, [variants.edges]);

  // Initialize selected options with first variant's options
  useEffect(() => {
    if (!variants.edges || variants.edges.length === 0) return;
    
    const initialOptions: Record<string, string> = {};
    variants.edges[0].node.selectedOptions.forEach(({ name, value }) => {
      initialOptions[name] = value;
    });
    setSelectedOptions(initialOptions);
    setSelectedVariant(variants.edges[0].node);
  }, [variants.edges]);

  const handleOptionChange = useCallback((optionName: string, value: string) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev, [optionName]: value };
      const matchingVariant = variants.edges.find(({ node }) => {
        return node.selectedOptions.every(option => 
          newOptions[option.name] === option.value
        );
      })?.node || null;
      setSelectedVariant(matchingVariant);
      return newOptions;
    });
  }, [variants.edges]);

  // Check if item is in cart
  useEffect(() => {
    const isItemInCart = items.some(item => item.id === selectedVariant?.id);
    console.log('Cart check:', { itemId: selectedVariant?.id, isInCart: isItemInCart, items });
    setIsInCart(isItemInCart);
  }, [items, selectedVariant]);

  // Reset isInCart when selectedVariant changes
  useEffect(() => {
    const isItemInCart = items.some(item => item.id === selectedVariant?.id);
    setIsInCart(isItemInCart);
  }, [selectedVariant, items]);

  const isYouTubeVideo = videoUrl && (videoUrl.includes('youtube.com/embed') || videoUrl.includes('youtu.be') || videoUrl.includes('youtube.com/watch'));
  const isDirectVideo = videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.mov') || videoUrl.endsWith('.webm'));

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
    if ((isYouTubeVideo || isDirectVideo) && videoUrl) {
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
  }, [title, videoId, isYouTubeVideo, isDirectVideo, videoUrl, watchUrl]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    const cartItem = {
      id: selectedVariant.id,
      title: title,
      price: {
        amount: parseFloat(selectedVariant.price.amount),
        currencyCode: selectedVariant.price.currencyCode
      },
      quantity: 1,
      videoUrl,
      thumbnail: image
    };
    
    console.log('Adding to cart:', cartItem);
    addItem(cartItem);
  };

  // If this is not a video, just render the image
  if (!isYouTubeVideo && !isDirectVideo) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-[calc(100vh-4rem)] min-h-[600px] max-h-[800px] bg-black snap-start snap-always overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Bottom Info Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
          <div className="space-y-4">
            {/* Title and Brand */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h2>
                <p className="text-sm text-white/80 font-medium">{category}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="text-xl font-bold text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                  {selectedVariant?.price.currencyCode} {selectedVariant?.price.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Options Toggle Button */}
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center text-white/70 hover:text-white transition-colors mb-2"
            >
              <span className="text-sm font-medium">
                {showOptions ? 'Hide Options' : 'Show Options'}
              </span>
              <ChevronDownIcon 
                className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                  showOptions ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Variant Options */}
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 mb-4 overflow-hidden"
                >
                  {Object.entries(variantOptions).map(([optionName, values]: [string, Set<string>]) => (
                    <div key={optionName} className="space-y-2">
                      <h3 className="text-sm font-medium text-white/90 capitalize">{optionName}</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(values).map((value: string) => {
                          // Find a variant that has this option value
                          const matchingVariant = variants.edges.find(({ node }) => 
                            node.selectedOptions.some(opt => 
                              opt.name === optionName && opt.value === value
                            )
                          )?.node;
                          
                          const isSelected = selectedOptions[optionName] === value;
                          const isAvailable = matchingVariant?.availableForSale ?? true;
                          
                          return (
                            <button
                              key={`${optionName}-${value}`}
                              onClick={() => isAvailable && handleOptionChange(optionName, value)}
                              disabled={!isAvailable}
                              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                isSelected
                                  ? 'bg-white text-black ring-2 ring-white ring-offset-2 ring-offset-black'
                                  : isAvailable
                                    ? 'bg-white/10 text-white hover:bg-white/20'
                                    : 'bg-white/5 text-white/50 cursor-not-allowed'
                              }`}
                            >
                              <span>{value}</span>
                              {matchingVariant && (
                                <span className="text-xs opacity-75">
                                  ({matchingVariant.price.currencyCode} {matchingVariant.price.amount.toLocaleString()})
                                  {!isAvailable && ' - Out of Stock'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

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
      {isVisible && (
        <>
          {isYouTubeVideo && embedUrl ? (
            <iframe
              src={`${embedUrl}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&loop=1&playlist=${videoId}&modestbranding=1`}
              title={title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : isDirectVideo ? (
            <video
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
            />
          ) : (
            <div className="absolute inset-0">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          )}
        </>
      )}

      {/* Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 pb-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
        <div className="space-y-4">
          {/* Title and Price */}
          <div className="flex items-center justify-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h2>
              <p className="text-sm text-white/80 font-medium">{category}</p>
            </div>
            <div className="flex justify-center items-center">
              <span className="text-white bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                {selectedVariant?.price.currencyCode} {selectedVariant?.price.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Options Toggle Button */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center text-white/70 hover:text-white transition-colors mb-2"
          >
            <span className="text-sm font-medium">
              {showOptions ? 'Hide Options' : 'Show Options'}
            </span>
            <ChevronDownIcon 
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                showOptions ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Variant Options */}
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 mb-4 overflow-hidden"
              >
                {Object.entries(variantOptions).map(([optionName, values]: [string, Set<string>]) => (
                  <div key={optionName} className="space-y-2">
                    <h3 className="text-sm font-medium text-white/90 capitalize">{optionName}</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(values).map((value: string) => {
                        // Find a variant that has this option value
                        const matchingVariant = variants.edges.find(({ node }) => 
                          node.selectedOptions.some(opt => 
                            opt.name === optionName && opt.value === value
                          )
                        )?.node;
                        
                        const isSelected = selectedOptions[optionName] === value;
                        const isAvailable = matchingVariant?.availableForSale ?? true;
                        
                        return (
                          <button
                            key={`${optionName}-${value}`}
                            onClick={() => isAvailable && handleOptionChange(optionName, value)}
                            disabled={!isAvailable}
                            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                              isSelected
                                ? 'bg-white text-black ring-2 ring-white ring-offset-2 ring-offset-black'
                                : isAvailable
                                  ? 'bg-white/10 text-white hover:bg-white/20'
                                  : 'bg-white/5 text-white/50 cursor-not-allowed'
                            }`}
                          >
                            <span>{value}</span>
                            {matchingVariant && (
                              <span className="text-xs opacity-75">
                                ({matchingVariant.price.currencyCode} {matchingVariant.price.amount.toLocaleString()})
                                {!isAvailable && ' - Out of Stock'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`w-full px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
              isInCart 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {isInCart ? (
              <div className="flex items-center space-x-2">
                <CheckIcon className="w-5 h-5" />
                <span>Added to Cart</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ShoppingCartIcon className="w-5 h-5" />
                <span>
                  Add to Cart - {selectedVariant?.price.currencyCode} {selectedVariant?.price.amount.toLocaleString()}
                </span>
              </div>
            )}
          </button>

          {/* Description Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center text-white/70 pb-24 hover:text-white transition-colors"
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
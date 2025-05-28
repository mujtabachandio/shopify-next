"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ChevronDownIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

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
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);

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
  };

  // If this is not a video, just render the image
  if (!isYouTubeVideo || !videoUrl) {
    return (
      <div className="relative w-full h-[calc(100vh-4rem)] min-h-[600px] max-h-[800px] bg-black snap-start snap-always">
        <div className="absolute inset-0">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Bottom Info Section */}
        <div className="absolute bottom-0 pb-20 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="space-y-4">
            {/* Title and Brand */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-sm text-white/70 font-medium">{brandName}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="text-xl font-bold text-white">
                  {price.currencyCode} {price.amount.toLocaleString()}
                </span>
                <button
                  onClick={handleAddToCart}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    showDescription ? 'bg-green-500/20 text-green-400' : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>

            {/* Description Toggle */}
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="flex items-center pb-20 text-white/70 hover:text-white transition-colors"
            >
              <span className="text-sm font-medium">
                {showDescription ? 'Hide Description' : 'Show Description'}
              </span>
              <ChevronDownIcon 
                className={`w-4 h-4 ml-1  transition-transform duration-300 ${
                  showDescription ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Description */}
            {showDescription && (
              <div className="mt-2 p-4 pb-20 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
                <p className="text-sm text-white/90 leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[calc(100vh-4rem)] min-h-[600px] max-h-[800px] bg-black snap-start snap-always">
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
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      )}

      {/* Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="space-y-4">
          {/* Title and Brand */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className="text-sm text-white/70 font-medium">{brandName}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className="text-xl font-bold text-white">
                {price.currencyCode} {price.amount.toLocaleString()}
              </span>
              <button
                onClick={handleAddToCart}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  showDescription ? 'bg-green-500/20 text-green-400' : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

          {/* Description Toggle */}
          <button
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
          </button>

          {/* Description */}
          {showDescription && (
            <div className="mt-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-sm text-white/90 leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
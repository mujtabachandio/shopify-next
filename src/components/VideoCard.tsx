"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaVolumeMute,
  FaVolumeUp,
  FaShoppingCart,
} from "react-icons/fa";
import Image from "next/image";

interface VideoCardProps {
  title: string;
  videoUrl: string;
  brandName?: string;
  id: string;
  thumbnail?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  price?: number;
}

export default function VideoCard({
  title,
  videoUrl,
  id,
  thumbnail,
  likes = 0,
  comments = 0,
  shares = 0,
  price = 99.99,
}: VideoCardProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (video) {
              video.play().catch(() => {
                // Handle play error silently
              });
            }
          } else {
            if (video) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (video) {
      observer.observe(video);
    }

    return () => {
      if (video) {
        observer.unobserve(video);
      }
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleOrderClick = () => {
    router.push(`/order?id=${id}&title=${encodeURIComponent(title)}`);
  };

  return (
    <div className="relative w-full h-full bg-background">
      {/* Video Container */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnail}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-3 z-10">
        <button
          onClick={toggleMute}
          className="action-button"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <button
          onClick={handleOrderClick}
          className="action-button flex items-center space-x-2"
        >
          <FaShoppingCart />
          <span className="text-sm">Order Now</span>
        </button>
      </div>

      {/* Brand Logo */}
      <div className="absolute top-4 left-4 glass-card px-3 py-1.5 z-10">
        <Image 
          src="/logo.png" 
          alt="Brand Logo" 
          width={80} 
          height={30} 
          className="h-8 w-auto object-contain" 
        />
      </div>

      {/* Price Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glass-card px-3 py-1.5 z-10">
        <span className="text-sm font-medium text-primary">${price.toFixed(2)}</span>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 md:bottom-24 flex flex-col items-center space-y-4 z-10">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="action-button flex flex-col items-center"
        >
          {isLiked ? (
            <FaHeart className="text-primary text-2xl" />
          ) : (
            <FaRegHeart className="text-2xl" />
          )}
          <span className="text-xs mt-1">{likes}</span>
        </button>

        <button className="action-button flex flex-col items-center">
          <FaComment className="text-2xl" />
          <span className="text-xs mt-1">{comments}</span>
        </button>

        <button className="action-button flex flex-col items-center">
          <FaShare className="text-2xl" />
          <span className="text-xs mt-1">{shares}</span>
        </button>
      </div>

      {/* Video Title */}
      <div className="absolute bottom-32 md:bottom-24 left-4 right-20 z-10">
        <h3 className="text-white text-lg font-medium line-clamp-2">{title}</h3>
      </div>
    </div>
  );
}



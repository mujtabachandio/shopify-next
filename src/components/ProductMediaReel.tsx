"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Add type declaration for model-viewer
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    src?: string;
    alt?: string;
    'auto-rotate'?: boolean;
    'camera-controls'?: boolean;
  }
}

interface Media {
  type: 'IMAGE' | 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D';
  imageUrl?: string;
  videoUrl?: string;
  embedUrl?: string;
  originUrl?: string;
  host?: string;
  alt?: string;
}

interface ProductMediaReelProps {
  media: Media[];
  className?: string;
}

export default function ProductMediaReel({ media, className = '' }: ProductMediaReelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (index: number) => {
    setCurrentIndex(index);
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) {
      console.log('No URL provided to getYouTubeVideoId');
      return null;
    }
    
    console.log('Processing YouTube URL:', url);
    
    // Handle youtu.be URLs
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      console.log('Extracted ID from youtu.be URL:', id);
      return id;
    }
    
    // Handle youtube.com URLs
    if (url.includes('youtube.com')) {
      try {
        const urlObj = new URL(url);
        const id = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
        console.log('Extracted ID from youtube.com URL:', id);
        return id;
      } catch (error) {
        console.error('Error parsing YouTube URL:', error);
        return null;
      }
    }
    
    console.log('URL is not a recognized YouTube format');
    return null;
  };

  const renderMedia = (item: Media, index: number) => {
    console.log('Rendering media item:', {
      type: item.type,
      host: item.host,
      originUrl: item.originUrl,
      embedUrl: item.embedUrl
    });

    switch (item.type) {
      case 'IMAGE':
        return (
          <div key={index} className="relative flex-shrink-0 w-full h-full">
            <Image
              src={item.imageUrl || ''}
              alt={item.alt || 'Product image'}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        );

      case 'VIDEO':
        return (
          <div key={index} className="relative flex-shrink-0 w-full h-full">
            <video
              src={item.videoUrl}
              controls
              className="w-full h-full object-contain"
              poster={item.imageUrl}
            />
          </div>
        );

      case 'EXTERNAL_VIDEO':
        // For YouTube videos
        if (item.host === 'YOUTUBE' || item.originUrl?.includes('youtube.com') || item.originUrl?.includes('youtu.be')) {
          console.log('Processing YouTube video:', item);
          
          // If we have an embedUrl, use it directly
          if (item.embedUrl) {
            console.log('Using provided embed URL:', item.embedUrl);
            return (
              <div key={index} className="relative flex-shrink-0 w-full h-full">
                <iframe
                  src={item.embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            );
          }

          // Otherwise try to extract video ID from originUrl
          const videoId = getYouTubeVideoId(item.originUrl || '');
          console.log('Extracted video ID:', videoId);
          
          if (!videoId) {
            console.log('No video ID found for URL:', item.originUrl);
            return (
              <div key={index} className="relative flex-shrink-0 w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Video unavailable</p>
              </div>
            );
          }

          const embedUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
          console.log('Generated embed URL:', embedUrl);

          return (
            <div key={index} className="relative flex-shrink-0 w-full h-full">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          );
        }

        // For other external videos (like Vimeo)
        console.log('Processing external video:', item);
        return (
          <div key={index} className="relative flex-shrink-0 w-full h-full">
            <iframe
              src={item.embedUrl || item.originUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        );

      case 'MODEL_3D':
        return (
          <div key={index} className="relative flex-shrink-0 w-full h-full">
            <div
              data-model-viewer
              data-src={item.videoUrl}
              data-alt={item.alt || '3D model'}
              data-auto-rotate
              data-camera-controls
              className="w-full h-full"
            />
          </div>
        );

      default:
        console.log('Unknown media type:', item.type);
        return null;
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {media.map((item, index) => (
          <div 
            key={index}
            className="flex-shrink-0 w-full h-full snap-center"
          >
            {renderMedia(item, index)}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {media.length > 1 && (
        <>
          <button
            onClick={() => handleScroll(currentIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Previous media"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleScroll(currentIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Next media"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => handleScroll(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to media ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 
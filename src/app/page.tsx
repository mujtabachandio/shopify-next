"use client"
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import VideoCard from "@/components/VideoCard";
import { VideoProduct } from "@/lib/shopify";
import { useInView } from "react-intersection-observer";
import BottomNav from "@/components/BottomNav";

// Sample video data for testing
const sampleVideos: VideoProduct[] = [
  {
    id: "1",
    title: "Beautiful Summer Collection 2024",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
    thumbnail: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.jpg",
    likes: 1234,
    comments: 89,
    shares: 45,
    price: 129.99
  },
  {
    id: "2",
    title: "New Arrivals - Spring Fashion",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    thumbnail: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.jpg",
    likes: 856,
    comments: 67,
    shares: 34,
    price: 149.99
  },
  {
    id: "3",
    title: "Exclusive Winter Collection",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39764-large.mp4",
    thumbnail: "https://assets.mixkit.co/videos/preview/mixkit-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39764-large.jpg",
    likes: 2345,
    comments: 156,
    shares: 78,
    price: 199.99
  }
];

export default function HomePage() {
  const [videos, setVideos] = useState<VideoProduct[]>(sampleVideos);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && !loading) {
      setLoading(true);
      // Simulate loading more videos
      setTimeout(() => {
        setVideos((prev) => [...prev, ...sampleVideos]);
        setLoading(false);
      }, 1000);
    }
  }, [inView, loading]);

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <div className="flex-1 h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
          {videos.map((video) => (
            <div
              key={video.id}
              className="h-screen w-full snap-start snap-always"
            >
              <VideoCard
                id={video.id}
                title={video.title}
                videoUrl={video.videoUrl}
                thumbnail={video.thumbnail}
                brandName={video.brandName}
                likes={video.likes}
                comments={video.comments}
                shares={video.shares}
                price={video.price}
              />
            </div>
          ))}
          <div ref={ref} className="h-20 flex items-center justify-center">
            {loading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}










 







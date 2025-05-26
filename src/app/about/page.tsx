"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-gradient-to-b from-black to-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-64 h-64 md:w-96 md:h-96"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-center"
          >
            Sasta Bazar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mt-4"
          >
            by Nabeela Adnan
          </motion.p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              We are dedicated to revolutionizing the way people discover and shop for fashion. 
              Our platform combines the power of video content with seamless shopping experiences, 
              making it easier than ever to find and purchase your favorite styles.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Through our innovative approach, we aim to bridge the gap between social media 
              and e-commerce, creating a dynamic space where fashion meets functionality.
            </p>
          </motion.div>

          {/* Logo Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-black p-8 flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src="/logo.png"
                alt="Our Mission"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/5 p-8 rounded-lg backdrop-blur-sm"
          >
            <div className="relative w-16 h-16 mx-auto mb-6">
              <Image
                src="/logo.png"
                alt="Video-First Shopping"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">Video-First Shopping</h3>
            <p className="text-gray-300 text-center">
              Experience products through engaging video content that brings fashion to life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/5 p-8 rounded-lg backdrop-blur-sm"
          >
            <div className="relative w-16 h-16 mx-auto mb-6">
              <Image
                src="/logo.png"
                alt="Seamless Experience"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">Seamless Experience</h3>
            <p className="text-gray-300 text-center">
              Shop directly from videos with our integrated shopping features.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="bg-white/5 p-8 rounded-lg backdrop-blur-sm"
          >
            <div className="relative w-16 h-16 mx-auto mb-6">
              <Image
                src="/logo.png"
                alt="Community Driven"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">Community Driven</h3>
            <p className="text-gray-300 text-center">
              Join a vibrant community of fashion enthusiasts and creators.
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Start Shopping?</h2>
          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-colors"
          >
            Explore Products
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 
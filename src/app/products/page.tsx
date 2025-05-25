"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

// Mock products data
const mockProducts = [
  {
    id: '1',
    title: 'Luxury Summer Dress',
    price: 129.99,
    image: '/sample-product-1.jpg',
    rating: 4.5,
    category: 'Summer',
  },
  {
    id: '2',
    title: 'Winter Coat',
    price: 199.99,
    image: '/sample-product-2.jpg',
    rating: 4.8,
    category: 'Winter',
  },
  // Add more mock products as needed
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = mockProducts.filter(
    product => selectedCategory === 'all' || product.category === selectedCategory
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div className="bg-background/50 p-4 rounded-lg">
            <h2 className="font-bold mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2 py-1 rounded ${
                  selectedCategory === 'all' ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setSelectedCategory('Summer')}
                className={`w-full text-left px-2 py-1 rounded ${
                  selectedCategory === 'Summer' ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                Summer
              </button>
              <button
                onClick={() => setSelectedCategory('Winter')}
                className={`w-full text-left px-2 py-1 rounded ${
                  selectedCategory === 'Winter' ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                Winter
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background/50 px-4 py-2 rounded-lg"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="bg-background/50 rounded-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold">${product.price}</p>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';

// Mock data for a single product
const mockProduct = {
  id: '1',
  title: 'Luxury Summer Dress',
  price: 129.99,
  images: ['/sample-product-1.jpg', '/sample-product-2.jpg', '/sample-product-3.jpg'],
  category: 'Summer',
  description: 'Elegant summer dress with floral pattern. Made from high-quality materials for maximum comfort and style.',
  rating: 4.5,
  reviews: [
    {
      id: 1,
      user: 'Sarah M.',
      rating: 5,
      comment: 'Beautiful dress, perfect for summer!',
      date: '2024-03-15',
    },
    {
      id: 2,
      user: 'John D.',
      rating: 4,
      comment: 'Great quality, but runs a bit small.',
      date: '2024-03-10',
    },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: ['Red', 'Blue', 'Black'],
};

interface ProductClientProps {
  id: string;
}

export default function ProductClient({ id }: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality with Shopify
    console.log('Adding to cart:', {
      productId: id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
      >
        <FaArrowLeft />
        <span>Back to Products</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={mockProduct.images[selectedImage]}
              alt={mockProduct.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mockProduct.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-primary' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${mockProduct.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{mockProduct.title}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(mockProduct.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({mockProduct.reviews.length} reviews)
              </span>
            </div>
          </div>

          <p className="text-2xl font-bold">${mockProduct.price}</p>
          <p className="text-gray-600">{mockProduct.description}</p>

          {/* Size Selection */}
          <div>
            <h3 className="font-medium mb-2">Size</h3>
            <div className="flex gap-2">
              {mockProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedSize === size
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex gap-2">
              {mockProduct.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg ${
                    selectedColor === color
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded-lg"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
            <button
              onClick={() => setIsWishlist(!isWishlist)}
              className={`p-3 rounded-lg border ${
                isWishlist
                  ? 'border-primary text-primary'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              <FaHeart />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="space-y-6">
          {mockProduct.reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.user}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
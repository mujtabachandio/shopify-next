# Fashion Collection App

## Overview
Fashion Collection App is a modern e-commerce platform built with Next.js, TypeScript, and Tailwind CSS. The application showcases fashion videos and products with an interactive and engaging user interface.

## Tech Stack
- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Fa, Md)
- **State Management**: React Context API
- **Video Handling**: HTML5 Video API

## Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── cart/           # Shopping cart functionality
│   ├── contact/        # Contact page
│   ├── order/          # Order processing
│   ├── return/         # Return policy
│   └── product_fetch/  # Product data fetching
├── components/         # Reusable UI components
├── context/           # React context providers
├── lib/               # Utility functions
└── types/             # TypeScript type definitions
```

## Key Features

### 1. Video Showcase
- Interactive video cards with play/pause functionality
- Mute/unmute controls
- Like/unlike feature
- Share functionality
- Grid view toggle
- Price display
- Order placement integration

### 2. User Interface
- Responsive design for all screen sizes
- Dark/Light mode support
- Modern glassmorphism design elements
- Bottom navigation for mobile devices
- Sidebar navigation for desktop
- Search functionality

### 3. E-commerce Features
- Shopping cart management
- Order processing
- Product browsing
- Price display
- Return policy information

### 4. Navigation
- Header with main navigation
- Sidebar for category navigation
- Bottom navigation for mobile users
- Search bar for product discovery

## Component Details

### VideoCard Component
The core component of the application that displays video content with the following features:
- Video playback controls
- Mute/unmute toggle
- Like/unlike functionality
- Share capability
- Grid view toggle
- Price display
- Order placement button
- Brand information display
- Responsive design with glassmorphism effects

### Header Component
- Main navigation
- Brand logo
- User interface controls

### Sidebar Component
- Category navigation
- Filter options
- User account section

### BottomNav Component
- Mobile-optimized navigation
- Quick access to key features
- Responsive design

## State Management
The application uses React's Context API for state management, handling:
- User preferences
- Shopping cart state
- Theme preferences
- Authentication state

## Styling
- Tailwind CSS for utility-first styling
- Custom color schemes
- Responsive design patterns
- Dark/Light mode support
- Glassmorphism effects
- Modern UI components

## Performance Optimizations
- Client-side video loading
- Lazy loading of components
- Optimized image and video assets
- Efficient state management

## Future Enhancements
- User authentication
- Payment gateway integration
- Advanced filtering options
- Wishlist functionality
- Social media integration
- Analytics integration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing
Please read our contributing guidelines before submitting pull requests.

## License
This project is licensed under the MIT License.


.env 
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=aqsa-gull-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=8199af56b16ab2ff265484c51fd506da

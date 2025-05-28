// components/Header.tsx
"use client";
import Link from "next/link";
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaEllipsisV, FaFileAlt, FaShieldAlt, FaChevronRight, FaSun, FaMoon } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/app/providers";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const { items } = useCart();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/collections" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const moreMenuItems = [
    { icon: FaFileAlt, label: "Return Policy", href: "/return-policy" },
    { icon: FaFileAlt, label: "Privacy Policy", href: "/privacy" },
    { icon: FaShieldAlt, label: "Terms & Conditions", href: "/terms" },
  ];

  const iconColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const hoverColor = theme === 'light' ? 'hover:text-gray-600' : 'hover:text-gray-300';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Aneela's Collection"
                width={40}
                height={40}
                className="w-auto h-8"
              />
              <span className="ml-2 text-gray-200 font-semibold">Aneela&apos;s Collection</span>
            </Link>
            <Link href="/cart" className="text-gray-200 hover:text-gray-300">
              <FaShoppingCart className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      <header className="h-16 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="h-full max-w-7xl mx-auto px-4">
          <div className="h-full flex items-center justify-between gap-4">
            {/* Hamburger Menu - Mobile Only */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 ${iconColor} ${hoverColor} transition-colors`}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Aneela's Collection" 
                width={120} 
                height={40} 
                className="h-10 w-auto object-contain" 
                priority
              />
            </Link>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className={`w-full bg-gray-900/50 ${iconColor} placeholder-gray-400 px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconColor}`} />
              </div>
            </div>

            {/* Navigation - Desktop Only */}
            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${iconColor} ${hoverColor} transition-colors`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className={`p-2 ${iconColor} ${hoverColor} transition-colors relative`}>
                <FaShoppingCart className="text-xl" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-gray-200 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {items.length}
                  </span>
                )}
              </Link>
              <Link href="/account" className={`p-2 ${iconColor} ${hoverColor} transition-colors`}>
                <FaUser className="text-xl" />
              </Link>
              {/* More Menu Button - Desktop Only */}
              <div className="relative hidden lg:block">
                <button 
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={`p-2 ${iconColor} ${hoverColor} transition-colors`}
                >
                  <FaEllipsisV className="text-xl" />
                </button>
                
                {/* More Menu Dropdown */}
                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg z-50">
                    {moreMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-3 ${iconColor} hover:bg-gray-800 ${hoverColor} transition-colors`}
                        onClick={() => setIsMoreMenuOpen(false)}
                      >
                        <span className="flex items-center space-x-3">
                          <item.icon className="text-lg" />
                          <span>{item.label}</span>
                        </span>
                        <FaChevronRight className="text-sm" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg bg-primary/10 ${iconColor} hover:bg-primary/20 transition-colors`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <FaMoon className="text-lg" />
              ) : (
                <FaSun className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="pt-20 px-4">
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-3 text-lg font-medium ${iconColor} ${hoverColor} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-700 my-4"></div>
            {moreMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 py-3 text-lg font-medium ${iconColor} ${hoverColor} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}










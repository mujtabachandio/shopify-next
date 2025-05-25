// components/Header.tsx
"use client";
import Link from "next/link";
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaEllipsisV, FaFileAlt, FaShieldAlt, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const moreMenuItems = [
    { icon: FaFileAlt, label: "Return Policy", href: "/return-policy" },
    { icon: FaFileAlt, label: "Privacy Policy", href: "/privacy" },
    { icon: FaShieldAlt, label: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <>
      <header className="h-16 bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="h-full max-w-7xl mx-auto px-4">
          <div className="h-full flex items-center justify-between gap-4">
            {/* Hamburger Menu - Mobile Only */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
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
                  className="w-full bg-background/50 text-foreground placeholder-gray-400 px-4 py-2 pl-10 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Navigation - Desktop Only */}
            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="p-2 text-foreground hover:text-primary transition-colors">
                <FaShoppingCart className="text-xl" />
              </Link>
              <Link href="/account" className="p-2 text-foreground hover:text-primary transition-colors">
                <FaUser className="text-xl" />
              </Link>
              {/* More Menu Button - Desktop Only */}
              <div className="relative hidden lg:block">
                <button 
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                >
                  <FaEllipsisV className="text-xl" />
                </button>
                
                {/* More Menu Dropdown */}
                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg z-50">
                    {moreMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between px-4 py-3 text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
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
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="pt-20 px-4">
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border my-4"></div>
            {moreMenuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 py-3 text-lg font-medium text-foreground hover:text-primary transition-colors"
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










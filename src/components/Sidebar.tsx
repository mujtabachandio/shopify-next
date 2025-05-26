"use client";
import { FaHome, FaShoppingBag, FaShoppingCart, FaInfoCircle, FaCrown, FaSun, FaSnowflake, FaMale, FaChild, FaTag, FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get('category');

  // Close sidebar when route changes on mobile

  const menuItems = [
    {
      name: 'Home',
      href: '/',
      icon: FaHome,
    },
    {
      name: 'Collections',
      href: '/collections',
      icon: FaShoppingBag,
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: FaShoppingCart,
    },
    {
      name: 'About',
      href: '/about',
      icon: FaInfoCircle,
    },
  ];

  const categories = [
    { icon: FaCrown, label: "Luxury Collection", value: "luxury" },
    { icon: FaSun, label: "Summer", value: "summer" },
    { icon: FaSnowflake, label: "Winter", value: "winter" },
    { icon: FaMale, label: "Men's", value: "mens" },
    { icon: FaChild, label: "Kids Accessories", value: "kids" },
    { icon: FaTag, label: "Deals", value: "deals" },
  ];

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === currentCategory) {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="p-4">
      <nav className="space-y-6">
        {/* Main Navigation */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground-muted px-4 mb-2">Navigation</h3>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground-muted hover:bg-primary/5 hover:text-foreground"
                }`}
              >
                <item.icon className="text-xl" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground-muted px-4 mb-2">Categories</h3>
          {categories.map((category) => {
            const isActive = currentCategory === category.value;
            return (
              <button
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground-muted hover:bg-primary/5 hover:text-foreground"
                }`}
              >
                <category.icon className="text-xl" />
                <span className="font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background/95 backdrop-blur-sm border border-border text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
      >
        {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-background/95 backdrop-blur-sm border-r border-border h-screen sticky top-0 hidden lg:block">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <SidebarContent />
        </Suspense>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-background/95 backdrop-blur-sm border-r border-border animate-slide-in">
            <Suspense fallback={<div className="p-4">Loading...</div>}>
              <SidebarContent />
            </Suspense>
          </aside>
        </div>
      )}
    </>
  );
}




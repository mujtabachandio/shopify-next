"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  FaHome, 
  FaShoppingCart, 
  FaUser,
  FaEllipsisV, 
  FaFileAlt, 
  FaShieldAlt, 
  FaTimes 
} from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navItems = [
    { icon: FaHome, label: "Home", href: "/" },
    { icon: FaUser, label: "Account", href: "/account" },
    { icon: FaShoppingCart, label: "Cart", href: "/cart" },
  ];

  const moreMenuItems = [
    { icon: FaFileAlt, label: "Return Policy", href: "/return-policy" },
    { icon: FaFileAlt, label: "Privacy Policy", href: "/privacy" },
    { icon: FaShieldAlt, label: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                    isActive 
                      ? "text-primary" 
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  <div className={`p-2 rounded-full ${isActive ? "bg-primary/10" : ""}`}>
                    <item.icon className="text-xl" />
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
            {/* More Menu Button */}
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                isMoreMenuOpen ? "text-primary" : "text-foreground-muted hover:text-foreground"
              }`}
            >
              <div className={`p-2 rounded-full ${isMoreMenuOpen ? "bg-primary/10" : ""}`}>
                <FaEllipsisV className="text-xl" />
              </div>
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </div>
      </nav>

      {/* More Menu Modal */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 rounded-t-2xl p-4 transform transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">More Options</h2>
              <button 
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-2 text-foreground-muted hover:text-foreground"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {moreMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  onClick={() => setIsMoreMenuOpen(false)}
                >
                  <item.icon className="text-xl" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

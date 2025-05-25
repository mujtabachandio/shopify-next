"use client";
import { FaHome, FaShoppingBag, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: FaHome, label: "Home", href: "/" },
    { icon: FaShoppingBag, label: "Products", href: "/products" },
    { icon: FaInfoCircle, label: "About", href: "/about" },
    { icon: FaEnvelope, label: "Contact", href: "/contact" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-background/95 backdrop-blur-sm border-r border-border h-[calc(100vh-4rem)]">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-foreground-muted hover:bg-primary/5 hover:text-foreground"
                }`}
              >
                <item.icon className="text-xl" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}




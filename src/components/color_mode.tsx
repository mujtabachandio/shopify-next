"use client"
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'



export default function Color_mode() {
    const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
 
  return (
    <div>

<button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-4 rounded-full bg-gray-800 dark:bg-white text-white dark:text-black mt-6 mb-6"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>


    </div>
  )
}






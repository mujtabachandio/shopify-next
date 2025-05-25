"use client";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <Link 
          href="/" 
          className="flex items-center gap-2 p-3 rounded-lg bg-black/20 backdrop-blur-md border border-gray-600/30 text-gray-300 hover:bg-gray-700/30 hover:text-white transition-all duration-300"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <Link 
          href="/" 
          className="p-3 rounded-lg bg-black/20 backdrop-blur-md border border-gray-600/30 text-gray-300 hover:bg-gray-700/30 hover:text-white transition-all duration-300"
          aria-label="Home"
        >
          <Home size={20} />
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto">
        {/* Glassmorphism Card */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-600/30 shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Return Policy</h1>
            <p className="text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            {/* Return Eligibility */}
            <section className="bg-black/10 backdrop-blur-sm p-6 rounded-xl border border-gray-600/20">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Return Eligibility</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Items must be returned within 30 days of purchase</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Products must be unused, unworn, and in original packaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Proof of purchase is required for all returns</span>
                </li>
              </ul>
            </section>

            {/* Non-Returnable Items */}
            <section className="bg-black/10 backdrop-blur-sm p-6 rounded-xl border border-gray-600/20">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Non-Returnable Items</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Personalized or custom-made products</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Underwear, swimwear, and other intimate apparel</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-yellow-400">•</span>
                  <span>Gift cards and downloadable products</span>
                </li>
              </ul>
            </section>

            {/* Return Process */}
            <section className="bg-black/10 backdrop-blur-sm p-6 rounded-xl border border-gray-600/20">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">How to Return</h2>
              <div className="space-y-4 text-gray-300">
                <div className="flex gap-4 items-start">
                  <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="text-yellow-400 font-medium">1</span>
                  </div>
                  <p>Initiate a return request through your account dashboard or contact our support</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="text-yellow-400 font-medium">2</span>
                  </div>
                  <p>Pack the item securely in its original packaging with all tags attached</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="text-yellow-400 font-medium">3</span>
                  </div>
                  <p>Attach the provided return label and drop off at your nearest shipping center</p>
                </div>
              </div>
            </section>

            {/* Refund Information */}
            <section className="bg-black/10 backdrop-blur-sm p-6 rounded-xl border border-gray-600/20">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Refund Information</h2>
              <div className="space-y-3 text-gray-300">
                <p>Refunds will be processed within 5-7 business days after we receive your return.</p>
                <p>Original shipping fees are non-refundable unless the return is due to our error.</p>
                <p>Refunds will be issued to the original payment method.</p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-yellow-400/10 backdrop-blur-sm p-6 rounded-xl border border-yellow-400/30">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Need Help?</h2>
              <div className="space-y-3 text-gray-300">
                <p>Contact our customer support team for any return-related questions:</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <a 
                    href="mailto:returns@yourstore.com" 
                    className="px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/30 rounded-lg text-yellow-400 transition-all duration-300"
                  >
                    Email Us
                  </a>
                  <a 
                    href="tel:+1234567890" 
                    className="px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/30 rounded-lg text-yellow-400 transition-all duration-300"
                  >
                    Call Support
                  </a>
                  <Link 
                    href="/contact" 
                    className="px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/30 rounded-lg text-yellow-400 transition-all duration-300"
                  >
                    Contact Form
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
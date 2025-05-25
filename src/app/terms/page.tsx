"use client";

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function TermsPage() {
  const [isTocOpen, setIsTocOpen] = useState(false);

  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'services', title: '2. Use of Services' },
    { id: 'accounts', title: '3. User Accounts' },
    { id: 'products', title: '4. Product Information' },
    { id: 'pricing', title: '5. Pricing and Payment' },
    { id: 'shipping', title: '6. Shipping and Delivery' },
    { id: 'ip', title: '7. Intellectual Property' },
    { id: 'liability', title: '8. Limitation of Liability' },
    { id: 'changes', title: '9. Changes to Terms' },
    { id: 'contact', title: '10. Contact Information' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>

      {/* Table of Contents for Mobile */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="w-full flex items-center justify-between p-4 bg-background/50 rounded-lg"
        >
          <span className="font-medium">Table of Contents</span>
          <FaChevronDown className={`transform transition-transform ${isTocOpen ? 'rotate-180' : ''}`} />
        </button>
        {isTocOpen && (
          <div className="mt-2 p-4 bg-background/50 rounded-lg">
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-primary hover:underline"
                    onClick={() => setIsTocOpen(false)}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        <section id="agreement" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
          <p className="text-gray-600">
            By accessing and using Fashion Collection&apos;s website and services, you
            agree to be bound by these Terms and Conditions. If you do not agree
            with any part of these terms, you may not access our services.
          </p>
        </section>

        <section id="services" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">2. Use of Services</h2>
          <div className="space-y-4 text-gray-600">
            <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our services in any way that violates any applicable laws</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper working of our website</li>
              <li>Use our services to transmit any harmful code or material</li>
              <li>Engage in any activity that disrupts or interferes with our services</li>
            </ul>
          </div>
        </section>

        <section id="accounts" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
          <p className="text-gray-600 mb-4">When creating an account with us, you must provide accurate and complete information. You are responsible for:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Maintaining the confidentiality of your account</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Ensuring you exit from your account at the end of each session</li>
          </ul>
        </section>

        <section id="products" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">4. Product Information</h2>
          <p className="text-gray-600 mb-4">
            We strive to display our products as accurately as possible. However, we do not guarantee that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Product descriptions are accurate, complete, or error-free</li>
            <li>Product images are accurate representations</li>
            <li>Colors will appear exactly as shown on your device</li>
          </ul>
        </section>

        <section id="pricing" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">5. Pricing and Payment</h2>
          <p className="text-gray-600 mb-4">All prices are subject to change without notice. We reserve the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Modify or discontinue any product without notice</li>
            <li>Refuse any order you place with us</li>
            <li>Limit or cancel quantities purchased per person or per order</li>
          </ul>
        </section>

        <section id="shipping" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">6. Shipping and Delivery</h2>
          <p className="text-gray-600">
            Delivery times are estimates only. We are not responsible for delays
            beyond our control. Risk of loss and title for items purchased pass
            to you upon delivery of the items to the carrier.
          </p>
        </section>

        <section id="ip" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
          <p className="text-gray-600">
            All content on our website, including text, graphics, logos, images,
            and software, is the property of Fashion Collection and is protected
            by intellectual property laws.
          </p>
        </section>

        <section id="liability" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-600">
            Fashion Collection shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use
            of or inability to use our services.
          </p>
        </section>

        <section id="changes" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes by posting the new Terms on this
            page.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
          <p className="text-gray-600">
            Questions about these Terms should be sent to us at{' '}
            <a href="mailto:legal@fashioncollection.com" className="text-primary hover:underline">
              legal@fashioncollection.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
} 
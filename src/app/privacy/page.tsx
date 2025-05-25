"use client";

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function PrivacyPolicyPage() {
  const [isTocOpen, setIsTocOpen] = useState(false);

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-collected', title: 'Information We Collect' },
    { id: 'information-use', title: 'How We Use Your Information' },
    { id: 'information-sharing', title: 'Information Sharing' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies and Tracking' },
    { id: 'security', title: 'Security' },
    { id: 'changes', title: 'Changes to This Policy' },
    { id: 'contact', title: 'Contact Us' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

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
        <section id="introduction" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-gray-600">
            At Fashion Collection, we take your privacy seriously. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website or make a purchase.
          </p>
        </section>

        <section id="information-collected" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
          <div className="space-y-4 text-gray-600">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and contact information</li>
              <li>Billing and shipping addresses</li>
              <li>Payment information</li>
              <li>Email address</li>
              <li>Phone number</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">Usage Information</h3>
            <p>We automatically collect certain information when you visit our website:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Pages visited</li>
              <li>Time spent on pages</li>
            </ul>
          </div>
        </section>

        <section id="information-use" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">We use the collected information for various purposes:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Prevent fraud and enhance security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section id="information-sharing" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
          <p className="text-gray-600 mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Service providers (payment processors, shipping companies)</li>
            <li>Marketing partners (with your consent)</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </section>

        <section id="your-rights" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Object to processing of your information</li>
          </ul>
        </section>

        <section id="cookies" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
          <p className="text-gray-600">
            We use cookies and similar tracking technologies to improve your
            browsing experience and analyze website traffic. You can control
            cookies through your browser settings.
          </p>
        </section>

        <section id="security" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Security</h2>
          <p className="text-gray-600">
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the internet is
            100% secure.
          </p>
        </section>

        <section id="changes" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us
            at{' '}
            <a href="mailto:privacy@fashioncollection.com" className="text-primary hover:underline">
              privacy@fashioncollection.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
} 
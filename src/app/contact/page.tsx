"use client";
import Link from "next/link";
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { ArrowLeft, Home } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-gray-600/30 shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Contact Us</h1>
            <p className="text-gray-300">We would love to hear from you!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-black/10 backdrop-blur-sm p-6 rounded-xl border border-gray-600/20">
                <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Get in Touch</h2>
                
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FaPhone className="text-primary text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FaEnvelope className="text-primary text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-gray-300">support@fashioncollection.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <FaMapMarkerAlt className="text-primary text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Address</h3>
                      <p className="text-gray-300">
                        123 Fashion Street
                        <br />
                        New York, NY 10001
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/10 backdrop-blur-sm p-6 rounded-xl border border-gray-600/20">
                <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Business Hours</h2>
                <div className="space-y-2 text-gray-300">
                  <p className="flex justify-between"><span>Monday - Friday:</span> <span>9:00 AM - 6:00 PM</span></p>
                  <p className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 4:00 PM</span></p>
                  <p className="flex justify-between"><span>Sunday:</span> <span>Closed</span></p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-black/10 backdrop-blur-sm p-6 rounded-xl border border-gray-600/20">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-gray-600/30 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-gray-600/30 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-300 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-gray-600/30 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent"
                    placeholder="What&apos;s this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-black/20 border border-gray-600/30 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
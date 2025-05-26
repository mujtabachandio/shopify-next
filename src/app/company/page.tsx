"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaBuilding, FaUsers, FaCog, FaChartLine, FaBox, FaEdit, FaSave } from 'react-icons/fa';

interface CompanyInfo {
  name: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "Aneela's Collection",
    description: "Your premier destination for luxury fashion and accessories.",
    logo: "/logo.png",
    website: "www.aneelacollection.com",
    email: "contact@aneelacollection.com",
    phone: "+1 (555) 123-4567",
    address: "123 Fashion Street, Style City, SC 12345",
    socialMedia: {
      instagram: "@aneelacollection",
      facebook: "Aneela's Collection",
      twitter: "@aneelacollection"
    }
  });

  const handleSave = () => {
    // Here you would typically save the changes to your backend
    setIsEditing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaBuilding },
    { id: 'products', label: 'Products', icon: FaBox },
    { id: 'customers', label: 'Customers', icon: FaUsers },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Company Account</h1>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FaSave className="text-lg" />
                <span>Save Changes</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <FaEdit className="text-lg" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-foreground-muted hover:bg-primary/5 hover:text-foreground"
                  }`}
                >
                  <tab.icon className="text-xl" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Company Profile */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="flex items-start space-x-6">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={companyInfo.logo}
                        alt={companyInfo.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={companyInfo.name}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                          className="w-full text-2xl font-bold bg-background border border-border rounded-lg px-4 py-2 mb-2"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold mb-2">{companyInfo.name}</h2>
                      )}
                      {isEditing ? (
                        <textarea
                          value={companyInfo.description}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-4 py-2 mb-4"
                          rows={3}
                        />
                      ) : (
                        <p className="text-foreground-muted mb-4">{companyInfo.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground-muted mb-1">Website</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={companyInfo.website}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-4 py-2"
                        />
                      ) : (
                        <p>{companyInfo.website}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground-muted mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={companyInfo.email}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-4 py-2"
                        />
                      ) : (
                        <p>{companyInfo.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground-muted mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={companyInfo.phone}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-4 py-2"
                        />
                      ) : (
                        <p>{companyInfo.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground-muted mb-1">Address</label>
                      {isEditing ? (
                        <textarea
                          value={companyInfo.address}
                          onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-4 py-2"
                          rows={2}
                        />
                      ) : (
                        <p>{companyInfo.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-xl font-semibold mb-4">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground-muted mb-1">Instagram</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={companyInfo.socialMedia.instagram}
                          onChange={(e) => setCompanyInfo({
                            ...companyInfo,
                            socialMedia: { ...companyInfo.socialMedia, instagram: e.target.value }
                          })}
                          className="w-full bg-background border border-border rounded-lg px-4 py-2"
                        />
                      ) : (
                        <p>{companyInfo.socialMedia.instagram}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground-muted mb-1">Facebook</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={companyInfo.socialMedia.facebook}
                          onChange={(e) => setCompanyInfo({
                            ...companyInfo,
                            socialMedia: { ...companyInfo.socialMedia, facebook: e.target.value }
                          })}
                          className="w-full bg-background border border-border rounded-lg px-4 py-2"
                        />
                      ) : (
                        <p>{companyInfo.socialMedia.facebook}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground-muted mb-1">Twitter</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={companyInfo.socialMedia.twitter}
                          onChange={(e) => setCompanyInfo({
                            ...companyInfo,
                            socialMedia: { ...companyInfo.socialMedia, twitter: e.target.value }
                          })}
                          className="w-full bg-background border border-border rounded-lg px-4 py-2"
                        />
                      ) : (
                        <p>{companyInfo.socialMedia.twitter}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Products Management</h2>
                <p className="text-foreground-muted">Product management features coming soon...</p>
              </motion.div>
            )}

            {activeTab === 'customers' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Customer Management</h2>
                <p className="text-foreground-muted">Customer management features coming soon...</p>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
                <p className="text-foreground-muted">Analytics features coming soon...</p>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border p-6"
              >
                <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
                <p className="text-foreground-muted">Settings features coming soon...</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
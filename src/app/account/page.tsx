"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg shadow-lg overflow-hidden border border-border"
        >
          {/* Header */}
          <div className="bg-primary/5 px-6 py-8 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <FaUser className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Account</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-lg p-6 border border-border"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <FaEnvelope className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Email Address</h2>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-lg p-6 border border-border"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <FaCalendarAlt className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Account Created</h2>
                </div>
                <p className="text-muted-foreground">
                  {formatDate(user.metadata.creationTime || '')}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FaCalendarAlt className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Last Sign In</h2>
              </div>
              <p className="text-muted-foreground">
                {formatDate(user.metadata.lastSignInTime || '')}
              </p>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-input bg-background text-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
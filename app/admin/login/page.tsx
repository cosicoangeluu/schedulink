'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://angelu-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('adminLoggedIn', 'true');
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-8000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping animation-delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-red-300 rounded-full opacity-40 animate-ping animation-delay-3000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-50 animate-ping animation-delay-5000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-300 rounded-full opacity-30 animate-ping animation-delay-7000"></div>
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md lg:max-w-lg mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl mb-6 transform hover:rotate-12 transition-transform duration-300">
            <i className="ri-admin-line text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 font-pacifico">
            Admin Portal
          </h1>
          <p className="text-gray-300 text-lg">
            Secure access to your dashboard
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white border-opacity-20 p-8 lg:p-10 relative overflow-hidden">
          {/* Animated Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-blue-500/20 rounded-3xl animate-pulse"></div>

          {/* Form Content */}
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-300 text-sm lg:text-base">Please sign in to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Username Input */}
              <div className="group">
                <label htmlFor="username" className="block text-sm font-semibold text-white mb-3 flex items-center">
                  <i className="ri-user-line mr-2 text-red-400"></i>
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-white bg-opacity-10 backdrop-blur-sm border-2 border-white border-opacity-20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-red-400 focus:bg-opacity-20 focus:ring-4 focus:ring-red-400/20 transition-all duration-300 text-lg"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-3 flex items-center">
                  <i className="ri-lock-line mr-2 text-red-400"></i>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-5 py-4 bg-white bg-opacity-10 backdrop-blur-sm border-2 border-white border-opacity-20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:border-red-400 focus:bg-opacity-20 focus:ring-4 focus:ring-red-400/20 transition-all duration-300 text-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border-2 border-red-400 border-opacity-50 rounded-2xl p-4 text-center backdrop-blur-sm animate-shake">
                  <div className="flex items-center justify-center mb-1">
                    <i className="ri-error-warning-line text-red-300 mr-2"></i>
                    <span className="text-red-100 font-semibold">Error</span>
                  </div>
                  <p className="text-red-100 text-sm">{error}</p>
                </div>
              )}

              {/* Sign In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-2xl text-lg font-bold text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 shadow-2xl hover:shadow-red-500/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                  {/* Button Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="relative flex items-center">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-3">Sign In</span>
                        <i className="ri-arrow-right-line group-hover:translate-x-2 transition-transform duration-300"></i>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Secure admin access • ScheduleLink 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

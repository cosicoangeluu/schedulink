'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChartSection from '../../../components/ChartSection';
import QuickActions from '../../../components/QuickActions';
import RecentActivity from '../../../components/RecentActivity';
import Sidebar from '../../../components/Sidebar';
import UpcomingEvents from '../../../components/UpcomingEvents';
import { useNotifications } from '../../../context/NotificationsContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { pendingCount } = useNotifications();
  const [kpiData, setKpiData] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    pendingEvents: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch total approved events
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const approvedEvents = data.filter(event => event.status === 'approved').length;
          const pendingEvents = data.filter(event => event.status === 'pending').length;
          setKpiData(prev => ({ ...prev, totalEvents: approvedEvents, pendingEvents }));
        }
      })
      .catch(err => console.error('Failed to fetch events:', err));

    // Fetch total registrations
    fetch('http://localhost:5000/api/registrations')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setKpiData(prev => ({ ...prev, totalRegistrations: data.length }));
        }
      })
      .catch(err => console.error('Failed to fetch registrations:', err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Toggle menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
      </div>

      <div className="flex-1 pt-16 md:pt-0 p-4 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* View Pending Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <i className="ri-time-line text-xl text-yellow-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Events</p>
                  <p className="text-lg font-bold text-gray-900">{kpiData.pendingEvents}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/events?status=pending')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                View
              </button>
            </div>
          </div>

          {/* Manage Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="ri-notification-3-line text-xl text-blue-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Notifications</p>
                  <p className="text-lg font-bold text-gray-900">{pendingCount || 0}</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/notifications')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Generate Reports */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <i className="ri-bar-chart-line text-xl text-green-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Generate Reports</p>
                  <p className="text-lg font-bold text-gray-900">Create New</p>
                </div>
              </div>
              <button
                onClick={() => router.push('/reports')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Generate
              </button>
            </div>
          </div>

          {/* User Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{kpiData.totalRegistrations}</p>
              </div>
            </div>
          </div>
        </div>

        <ChartSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <UpcomingEvents />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}

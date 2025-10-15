'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import EventDetailsModal from '../events/EventDetailsModal';
import NotificationCard from './NotificationCard';

interface Notification {
  id: number;
  type: string;
  message: string;
  eventId?: number;
  resourceId?: number;
  bookingId?: number;
  status: string;
  eventName?: string;
  resourceName?: string;
  created_at: string;
}

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  gymnasium: boolean;
  sports_area: boolean;
  application_date: string;
  rental_date: string;
  behalf_of: string;
  contact_info: string;
  nature_of_event: string;
  status: string;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('https://schedulink-backend.onrender.com/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = async (notificationId: number) => {
    try {
      const response = await fetch(`https://schedulink-backend.onrender.com/api/notifications/${notificationId}/approve`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to approve notification');
      }

      // Refetch notifications to update the list
      fetchNotifications();
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleDecline = async (notificationId: number) => {
    try {
      const response = await fetch(`https://schedulink-backend.onrender.com/api/notifications/${notificationId}/decline`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to decline notification');
      }

      // Refetch notifications to update the list
      fetchNotifications();
    } catch (error) {
      console.error('Error declining:', error);
    }
  };

  const handleViewDetails = async (notification: Notification) => {
    if (!notification.eventId) return;
    try {
      const response = await fetch(`https://schedulink-backend.onrender.com/api/events/${notification.eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      const event = await response.json();
      setSelectedEvent(event);
      setShowEventModal(true);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'declined'>('pending');

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch =
      (notification.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (notification.resourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const pendingNotifications = filteredNotifications.filter(n => n.status === 'pending');
  const approvedNotifications = filteredNotifications.filter(n => n.status === 'approved');
  const declinedNotifications = filteredNotifications.filter(n => n.status === 'declined');

  const pendingCount = notifications.filter(n => n.status === 'pending').length;
  const approvedCount = notifications.filter(n => n.status === 'approved').length;
  const declinedCount = notifications.filter(n => n.status === 'declined').length;

  const getCurrentNotifications = () => {
    switch (activeTab) {
      case 'pending':
        return pendingNotifications;
      case 'approved':
        return approvedNotifications;
      case 'declined':
        return declinedNotifications;
      default:
        return pendingNotifications;
    }
  };

  const currentNotifications = getCurrentNotifications();

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

      <div className="flex-1 p-4 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Event Approval Requests
          </h1>
          <p className="text-gray-900 text-lg">Review and manage event approval requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center text-yellow-600">
                  <i className="ri-time-line text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center text-green-600">
                  <i className="ri-checkbox-circle-line text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center text-red-600">
                  <i className="ri-close-circle-line text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-gray-900">{declinedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <i className="ri-time-line"></i>
                  <span>Pending</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                    {pendingCount}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('approved')}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'approved'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>Approved</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {approvedCount}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('declined')}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'declined'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <i className="ri-close-circle-line"></i>
                  <span>Declined</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    {declinedCount}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {currentNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <i className={`text-4xl ${
                    activeTab === 'pending' ? 'ri-time-line' :
                    activeTab === 'approved' ? 'ri-checkbox-circle-line' :
                    'ri-close-circle-line'
                  }`}></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {activeTab} notifications
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'pending' && 'All caught up! No pending approvals at the moment.'}
                  {activeTab === 'approved' && 'No approved notifications yet.'}
                  {activeTab === 'declined' && 'No declined notifications yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentNotifications.map(notification => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onApprove={handleApprove}
                    onDecline={handleDecline}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEventModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
        />
      )}
    </div>
  );
}

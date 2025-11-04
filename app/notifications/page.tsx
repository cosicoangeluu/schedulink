'use client';

import { useEffect, useState } from 'react';
import ApprovalConfirmationModal from '../../components/ApprovalConfirmationModal';
import ApprovalNotificationModal from '../../components/ApprovalNotificationModal';
import Sidebar from '../../components/Sidebar';
import ViewEventModal from '../events/ViewEventModal';
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
  venues: number[];
  equipment: {id: number, quantity: number}[];
  application_date: string;
  rental_date: string;
  behalf_of: string;
  contact_info: string;
  nature_of_event: string;
  requires_equipment?: boolean;
  chairs_qty?: number;
  tables_qty?: number;
  projector?: boolean;
  other_equipment?: string;
  setup_start_time?: string;
  setup_end_time?: string;
  setup_hours?: number;
  event_start_time?: string;
  event_end_time?: string;
  event_hours?: number;
  cleanup_start_time?: string;
  cleanup_end_time?: string;
  cleanup_hours?: number;
  total_hours?: number;
  status: string;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'decline'; notificationId: number; eventName: string } | null>(null);
  const [lastAction, setLastAction] = useState<{ type: 'approved' | 'declined'; eventName: string } | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://schedulink-backend.onrender.com/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
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

  const handleApprove = (notificationId: number, eventName: string) => {
    setPendingAction({ type: 'approve', notificationId, eventName });
    setShowApprovalModal(true);
  };

  const handleDecline = (notificationId: number, eventName: string) => {
    setPendingAction({ type: 'decline', notificationId, eventName });
    setShowApprovalModal(true);
  };

  const confirmAction = async () => {
    if (!pendingAction) return;

    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = pendingAction.type === 'approve' ? 'approve' : 'decline';
      const response = await fetch(`https://schedulink-backend.onrender.com/api/notifications/${pendingAction.notificationId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${pendingAction.type} notification`);
      }

      // Set last action for notification modal
      setLastAction({ type: pendingAction.type === 'approve' ? 'approved' : 'declined', eventName: pendingAction.eventName });

      // Close confirmation modal and show notification modal
      setShowApprovalModal(false);
      setShowNotificationModal(true);

      // Refetch notifications to update the list
      fetchNotifications();
    } catch (error) {
      console.error(`Error ${pendingAction.type}ing:`, error);
    } finally {
      setPendingAction(null);
    }
  };

  const cancelAction = () => {
    setPendingAction(null);
    setShowApprovalModal(false);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setLastAction(null);
  };

  const handleViewDetails = async (notification: Notification) => {
    if (!notification.eventId) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://schedulink-backend.onrender.com/api/events/${notification.eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-2xl shadow-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
          aria-label="Toggle menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
      </div>

      <div className="flex-1 p-4 sm:p-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Event Approval Requests
          </h1>
          <p className="text-gray-700 text-lg">Review and manage event approval requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-7 h-7 flex items-center justify-center text-white">
                  <i className="ri-time-line text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-700">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-7 h-7 flex items-center justify-center text-white">
                  <i className="ri-checkbox-circle-line text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-700">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{approvedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-7 h-7 flex items-center justify-center text-white">
                  <i className="ri-close-circle-line text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-700">Declined</p>
                <p className="text-3xl font-bold text-gray-900">{declinedCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 mb-6 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200/50">
            <div className="flex space-x-1 p-3">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 px-6 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 transform ${
                  activeTab === 'pending'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-white/50 hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <i className="ri-time-line"></i>
                  <span>Pending</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activeTab === 'pending'
                      ? 'bg-white/20 text-white'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {pendingCount}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('approved')}
                className={`flex-1 px-6 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 transform ${
                  activeTab === 'approved'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-white/50 hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>Approved</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activeTab === 'approved'
                      ? 'bg-white/20 text-white'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {approvedCount}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('declined')}
                className={`flex-1 px-6 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 transform ${
                  activeTab === 'declined'
                    ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-white/50 hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <i className="ri-close-circle-line"></i>
                  <span>Declined</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activeTab === 'declined'
                      ? 'bg-white/20 text-white'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {declinedCount}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-8 border-b border-gray-200/50">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400 text-lg"></i>
              </div>
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm text-gray-900 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {currentNotifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg">
                  <i className={`text-5xl text-gray-400 ${
                    activeTab === 'pending' ? 'ri-time-line' :
                    activeTab === 'approved' ? 'ri-checkbox-circle-line' :
                    'ri-close-circle-line'
                  }`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No {activeTab} notifications
                </h3>
                <p className="text-gray-600 text-lg">
                  {activeTab === 'pending' && 'All caught up! No pending approvals at the moment.'}
                  {activeTab === 'approved' && 'No approved notifications yet.'}
                  {activeTab === 'declined' && 'No declined notifications yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className="opacity-0 animate-fade-in"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <NotificationCard
                      notification={notification}
                      onApprove={(id) => handleApprove(id, notification.eventName || 'Unknown Event')}
                      onDecline={(id) => handleDecline(id, notification.eventName || 'Unknown Event')}
                      onViewDetails={handleViewDetails}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEventModal && selectedEvent && (
        <ViewEventModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
        />
      )}

      {showApprovalModal && pendingAction && (
        <ApprovalConfirmationModal
          isOpen={showApprovalModal}
          action={pendingAction.type}
          eventName={pendingAction.eventName}
          onConfirm={confirmAction}
          onCancel={cancelAction}
        />
      )}

      {showNotificationModal && lastAction && (
        <ApprovalNotificationModal
          isOpen={showNotificationModal}
          action={lastAction.type}
          eventName={lastAction.eventName}
          onClose={closeNotificationModal}
        />
      )}
    </div>
  );
}

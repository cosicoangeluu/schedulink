'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChartSection from '../../../components/ChartSection';
import EnhancedTodoList from '../../../components/EnhancedTodoList';
import RecentActivity from '../../../components/RecentActivity';
import Sidebar from '../../../components/Sidebar';
import UpcomingEvents from '../../../components/UpcomingEvents';
import { useNotifications } from '../../../context/NotificationsContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { pendingCount } = useNotifications();
  const [kpiData, setKpiData] = useState({
    totalEvents: 0,
    pendingEvents: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isTodoCollapsed, setIsTodoCollapsed] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const token = localStorage.getItem('adminToken');
    if (!isLoggedIn || !token) {
      router.push('/admin/login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Fetch total approved events
    fetch('https://schedulink-backend.onrender.com/api/events', { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const approvedEvents = data.filter(event => event.status === 'approved').length;
          const pendingEvents = data.filter(event => event.status === 'pending').length;
          setKpiData(prev => ({ ...prev, totalEvents: approvedEvents, pendingEvents }));
        }
      })
      .catch(err => console.error('Failed to fetch events:', err));

    // Check for upcoming tasks due within 10 minutes
    fetch('https://schedulink-backend.onrender.com/api/tasks', { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const now = new Date();
          const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
          const upcoming = data.filter((task: any) => {
            if (!task.due_date || task.completed) return false;
            const dueDate = new Date(task.due_date);
            return dueDate >= now && dueDate <= tenMinutesFromNow;
          });
          if (upcoming.length > 0) {
            setUpcomingTasks(upcoming);
            setShowPopup(true);
          }
        }
      })
      .catch(err => console.error('Failed to fetch tasks for notifications:', err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400/15 to-teal-400/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl shadow-2xl hover:shadow-red-500/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          aria-label="Toggle menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
      </div>

      <div className="flex-1 pt-16 md:pt-0 p-4 sm:p-8 relative z-10">
        {/* Enhanced Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-black text-lg">Welcome back! Here's what's happening with your events today.</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                <div className="flex items-center space-x-2">
                  <i className="ri-calendar-line text-red-500"></i>
                  <span className="text-sm font-medium text-black">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Quick Access and TodoList Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          {/* Quick Access Card */}
          <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Quick Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* View Pending Events */}
              <div className="group bg-gradient-to-br from-yellow-50/70 to-orange-50/70 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-yellow-100/50 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-time-line text-xl text-white"></i>
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-900">{kpiData.pendingEvents}</p>
                  <p className="text-xs text-gray-500 font-medium">Pending</p>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Pending Events</h4>
                <p className="text-xs text-gray-600 mb-3">Events awaiting approval</p>
                <button
                  onClick={() => router.push('/notifications')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 font-semibold text-xs"
                >
                  <span className="flex items-center justify-center">
                    View Events
                    <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </span>
                </button>
              </div>

              {/* Manage Resources */}
              <div className="group bg-gradient-to-br from-blue-50/70 to-indigo-50/70 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-blue-100/50 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-folder-line text-xl text-white"></i>
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-900">Files</p>
                  <p className="text-xs text-gray-500 font-medium">Available</p>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Resources</h4>
                <p className="text-xs text-gray-600 mb-3">Manage event resources</p>
                <button
                  onClick={() => router.push('/resources')}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold text-xs"
                >
                  <span className="flex items-center justify-center">
                    Manage Resource
                    <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </span>
                </button>
              </div>

              {/* Generate Reports */}
              <div className="group bg-gradient-to-br from-green-50/70 to-emerald-50/70 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-green-100/50 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <i className="ri-bar-chart-line text-xl text-white"></i>
                </div>
                <div className="mb-2">
                  <p className="text-lg font-bold text-gray-900">New</p>
                  <p className="text-xs text-gray-500 font-medium">Available</p>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Reports</h4>
                <p className="text-xs text-gray-600 mb-3">Generate analytics</p>
                <button
                  onClick={() => router.push('/reports')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25 font-semibold text-xs"
                >
                  <span className="flex items-center justify-center">
                    Generate
                    <i className="ri-arrow-right-line ml-1 group-hover:translate-x-1 transition-transform duration-300"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* TodoList Section */}
          <div className="lg:col-span-1">
            {!isTodoCollapsed ? (
              <EnhancedTodoList onCollapse={() => setIsTodoCollapsed(true)} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">My Tasks</h4>
                  <button
                    onClick={() => setIsTodoCollapsed(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Expand TodoList"
                  >
                    <i className="ri-arrow-down-s-line text-xl"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <ChartSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <UpcomingEvents />
          </div>
          <div className="space-y-8">
            <RecentActivity />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upcoming Tasks Reminder</h3>
            <p className="text-sm text-black-600 mb-4">You have tasks due within the next 10 minutes:</p>
            <ul className="space-y-2 mb-4">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="text-sm bg-gray-50 p-2 rounded">
                  <strong>{task.title}</strong>
                  <br />
                  Due: {new Date(task.due_date).toLocaleString()}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

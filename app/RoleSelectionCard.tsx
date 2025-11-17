'use client';

import { useRouter } from 'next/navigation';
import { useRole } from '../components/RoleContext';
import RoleCard from './RoleCard';

export default function RoleSelectionCard() {
  const router = useRouter();
  const { setRole } = useRole();

  const handleSelectRole = (role: string) => {
    setRole(role as 'admin' | 'student' | 'other-admin');
    // Navigate to different pages based on role selection
    if (role === 'admin') {
      router.push('/admin/login');
    } else if (role === 'student') {
      router.push('/student/dashboard');
    } else if (role === 'other-admin') {
      router.push('/calendar');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 p-4 overflow-auto relative">

      {/* Admin Login - Upper Right Corner of Screen */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={() => handleSelectRole('admin')}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 hover:scale-105"
        >
          <i className="ri-user-line text-lg"></i>
          <span className="text-sm font-medium">Login as Admin</span>
        </button>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Minimal Header */}
        <div className="text-center mb-12 md:mb-16 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full shadow-md mb-6">
            <i className="ri-calendar-event-line text-4xl text-white"></i>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to ScheduleLink
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Streamline your event management experience. Choose your role below to access personalized features and tools.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="w-12 h-1 bg-white/60 rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-12 h-1 bg-white/60 rounded-full"></div>
          </div>
        </div>

        {/* Main Container with Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          <div className="transform hover:scale-105 transition-all duration-300">
            <RoleCard
              role="other-admin"
              title="Calendar Viewing"
              description="View calendar and get notified about approved events."
              gradient="bg-red-600"
              icon="ri-calendar-line"
              iconColor="text-red-600"
              onSelect={handleSelectRole}
            />
          </div>

          <div className="transform hover:scale-105 transition-all duration-300">
            <RoleCard
              role="student"
              title="Student / Department Head"
              description="Register for events, Send Event Reports and View Schedules."
              gradient="bg-gray-800"
              icon="ri-user-line"
              iconColor="text-gray-700"
              onSelect={handleSelectRole}
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 md:mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Why Choose ScheduleLink?</h2>
            <p className="text-white/80 text-lg">Experience seamless event management with our powerful features</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-calendar-check-line text-2xl text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Scheduling</h3>
              <p className="text-white/80 text-sm">Create and manage events with our intuitive interface</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-notification-3-line text-2xl text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Notifications</h3>
              <p className="text-white/80 text-sm">Stay updated with instant alerts and reminders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-bar-chart-line text-2xl text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics & Reports</h3>
              <p className="text-white/80 text-sm">Generate insights with comprehensive reporting tools</p>
            </div>
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="mt-16 md:mt-24 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
            <i className="ri-heart-line text-white"></i>
            <p className="text-white/80 text-sm font-medium">
              © 2025 ScheduleLink. Built with passion for seamless event management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

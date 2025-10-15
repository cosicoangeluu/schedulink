'use client';

import { useRouter } from 'next/navigation';
import { useRole } from '../components/RoleContext';
import AnimatedBackground from './AnimatedBackground';
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 overflow-auto relative">
      <AnimatedBackground />

      <div className="w-full max-w-md sm:max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-pacifico">
            Welcome to ScheduleLink
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Choose your role to get started
          </p>
        </div>

        {/* Main Container with Cards */}
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          <RoleCard
            role="admin"
            title="Admin"
            description="Manage events, users, and resources. Approve events and generate reports."
            gradient="bg-gradient-to-br from-red-500 via-red-600 to-red-700"
            icon="ri-admin-line"
            iconColor="text-red-600"
            onSelect={handleSelectRole}
          />

          <RoleCard
            role="other-admin"
            title="Calendar Viewing"
            description="View calendar and get notified about approved events."
            gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
            icon="ri-calendar-line"
            iconColor="text-blue-600"
            onSelect={handleSelectRole}
          />

          <RoleCard
            role="student"
            title="Student / Department Head"
            description="Register for events, Send Event Reports and View Schedules."
            gradient="bg-gradient-to-br from-gray-800 via-gray-900 to-black"
            icon="ri-user-line"
            iconColor="text-gray-800"
            onSelect={handleSelectRole}
          />
        </div>

        {/* Bottom Info Section */}
        <div className="mt-8 md:mt-16 text-center">
          <p className="text-gray-500 text-sm md:text-base font-medium">
            © 2025 ScheduleLink. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

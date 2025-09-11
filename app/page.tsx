
'use client';

import ChartSection from '../components/ChartSection';
import KPICard from '../components/KPICard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import Sidebar from '../components/Sidebar';
import UpcomingEvents from '../components/UpcomingEvents';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KPICard 
            title="Total Events" 
            value="12" 
            icon="ri-calendar-event-line"
            trend={{ value: "+15%", positive: true }}
          />
          <KPICard 
            title="Registrations" 
            value="245" 
            icon="ri-user-add-line"
            trend={{ value: "+8.2%", positive: true }}
          />
          <KPICard 
            title="Active Notifications" 
            value="4" 
            icon="ri-notification-3-line"
          />
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

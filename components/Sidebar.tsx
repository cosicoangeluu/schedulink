
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: 'ri-dashboard-line', label: 'Dashboard', href: '/' },
    { icon: 'ri-calendar-event-line', label: 'Events', href: '/events' },
    { icon: 'ri-folder-line', label: 'Resources', href: '/resources' },
    { icon: 'ri-user-add-line', label: 'Registrations', href: '/registrations' },
    { icon: 'ri-notification-3-line', label: 'Notifications', href: '/notifications' },
    { icon: 'ri-bar-chart-line', label: 'Reports', href: '/reports' },
    { icon: 'ri-logout-box-line', label: 'Logout', href: '#' }
  ];

  return (
    <div className="w-64 bg-red-600 text-white p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">ScheduleLink</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <Link 
            key={index}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              pathname === item.href ? 'bg-red-700' : 'hover:bg-red-700'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={item.icon}></i>
            </div>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

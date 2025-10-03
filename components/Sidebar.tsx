'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useNotifications } from '../context/NotificationsContext';
import { useRole } from './RoleContext';

export default function Sidebar({ isMobileOpen = false, onClose }: { isMobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { role, clearRole } = useRole();
  const router = useRouter();
  const { pendingCount } = useNotifications();

  const allMenuItems = [
    { icon: 'ri-dashboard-line', label: 'Dashboard', href: role === 'admin' ? '/admin/dashboard' : '/student/dashboard' },
    { icon: 'ri-calendar-line', label: 'Calendar', href: '/calendar' },
    { icon: 'ri-calendar-event-line', label: 'Events', href: '/events' },
    { icon: 'ri-folder-line', label: 'Resources', href: '/resources' },
    { icon: 'ri-user-add-line', label: 'Registrations', href: '/registrations' },
    { icon: 'ri-notification-3-line', label: 'Notifications', href: '/notifications', badge: pendingCount },
    { icon: 'ri-bar-chart-line', label: 'Reports', href: '/reports' },
    { icon: 'ri-logout-box-line', label: 'Logout', href: '#', action: 'logout' }
  ];

  const menuItems = role === 'admin' ? allMenuItems : [
    { icon: 'ri-dashboard-line', label: 'Dashboard', href: '/student/dashboard' },
    { icon: 'ri-calendar-line', label: 'Calendar', href: '/calendar' },
    { icon: 'ri-logout-box-line', label: 'Logout', href: '#', action: 'logout' }
  ];

  if (isMobileOpen) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => onClose?.()}></div>
        <div className="fixed left-0 top-0 h-full w-64 bg-red-600 text-white p-6 z-40 md:hidden">
          <div className="mb-8">
            <h1 className="text-xl font-bold">ScheduleLink</h1>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              item.action === 'logout' ? (
                <button
                  key={index}
                  onClick={() => {
                    clearRole();
                    router.push('/');
                    onClose && onClose();
                  }}
                  className="flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap w-full text-left hover:bg-red-700"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={item.icon}></i>
                  </div>
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    pathname === item.href ? 'bg-red-700' : 'hover:bg-red-700'
                  }`}
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <i className={item.icon}></i>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </>
    );
  }

  return (
    <div className="hidden md:block w-64 bg-red-600 text-white p-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">ScheduleLink</h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          item.action === 'logout' ? (
            <button
              key={index}
              onClick={() => {
                clearRole();
                router.push('/');
              }}
              className="flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap w-full text-left hover:bg-red-700"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={item.icon}></i>
              </div>
              <span>{item.label}</span>
            </button>
          ) : (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                pathname === item.href ? 'bg-red-700' : 'hover:bg-red-700'
              }`}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <i className={item.icon}></i>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
}

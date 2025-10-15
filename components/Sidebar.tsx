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
    { icon: 'ri-notification-3-line', label: 'Notifications', href: '/notifications', badge: pendingCount },
    { icon: 'ri-bar-chart-line', label: 'Reports', href: '/reports' },
    { icon: 'ri-logout-box-line', label: 'Logout', href: '#', action: 'logout' }
  ];

  let menuItems;
  if (role === 'other-admin') {
    menuItems = [
      { icon: 'ri-calendar-line', label: 'Calendar', href: '/calendar' },
      { icon: 'ri-logout-box-line', label: 'Logout', href: '#', action: 'logout' }
    ];
  } else if (role === 'admin') {
    menuItems = [
      { icon: 'ri-dashboard-line', label: 'Dashboard', href: '/admin/dashboard' },
      { icon: 'ri-calendar-line', label: 'Calendar', href: '/calendar' },
      { icon: 'ri-calendar-event-line', label: 'Events', href: '/events' },
      { icon: 'ri-folder-line', label: 'Resources', href: '/resources' },
      { icon: 'ri-notification-3-line', label: 'Notifications', href: '/notifications', badge: pendingCount },
      { icon: 'ri-bar-chart-line', label: 'Reports', href: '/reports' },
      { icon: 'ri-user-settings-line', label: 'Admin Management', href: '/admin/manage' },
      { icon: 'ri-logout-box-line', label: 'Logout', href: '#', action: 'logout' }
    ];
  } else {
    menuItems = [
      { icon: 'ri-dashboard-line', label: 'Dashboard', href: '/student/dashboard' },
      { icon: 'ri-calendar-line', label: 'Calendar', href: '/calendar' },
      { icon: 'ri-logout-box-line', label: 'Logout', href: '#', action: 'logout' }
    ];
  }

  if (isMobileOpen) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300" onClick={() => onClose?.()}></div>
        <div className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-red-600 to-red-700 text-white p-6 z-40 md:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-8">
            <h1 className="text-xl font-bold text-white drop-shadow-lg">ScheduleLink</h1>
          </div>

          <nav className="space-y-3">
            {menuItems.map((item, index) => (
              item.action === 'logout' ? (
              <button
                key={index}
                onClick={() => {
                  clearRole();
                  router.push('/');
                  onClose && onClose();
                }}
                className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap w-full text-left hover:bg-white/10 hover:scale-105 hover:shadow-lg group"
              >
                  <div className="w-6 h-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap group ${
                    pathname === item.href ? 'bg-white/20 shadow-lg scale-105' : 'hover:bg-white/10 hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <div className="relative w-6 h-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
                    <i className={`${item.icon} text-lg`}></i>
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            ))}
          </nav>
        </div>
      </>
    );
  }

  return (
    <div className="hidden md:block w-64 bg-gradient-to-b from-red-600 to-red-700 text-white p-6 shadow-2xl">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white drop-shadow-lg">ScheduleLink</h1>
      </div>

      <nav className="space-y-3">
        {menuItems.map((item, index) => (
          item.action === 'logout' ? (
            <button
              key={index}
              onClick={() => {
                clearRole();
                router.push('/');
              }}
              className="flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap w-full text-left hover:bg-white/10 hover:scale-105 hover:shadow-lg group"
            >
              <div className="w-6 h-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
                <i className={`${item.icon} text-lg`}></i>
              </div>
              <span className="font-medium">{item.label}</span>
            </button>
          ) : (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap group ${
                pathname === item.href ? 'bg-white/20 shadow-lg scale-105' : 'hover:bg-white/10 hover:scale-105 hover:shadow-lg'
              }`}
            >
              <div className="relative w-6 h-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
                <i className={`${item.icon} text-lg`}></i>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-md animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';

interface Event {
  id: number;
  name: string;
  status: string;
  created_at: string;
}



interface Notification {
  id: number;
  type: string;
  message: string;
  status: string;
  created_at: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  user: string;
  time: string;
  timestamp: Date;
  icon: string;
  iconColor: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const [eventsRes, notificationsRes] = await Promise.all([
        fetch('https://schedulink-backend.onrender.com/api/events'),
        fetch('https://schedulink-backend.onrender.com/api/notifications')
      ]);

      const events = await eventsRes.json();
      const notifications = await notificationsRes.json();

      const eventsArray = Array.isArray(events) ? events : [];
      const notificationsArray = Array.isArray(notifications) ? notifications : [];

      const activityList: Activity[] = [];

      // Add recent events
      eventsArray.slice(0, 10).forEach(event => {
        let icon = 'ri-calendar-event-line';
        let iconColor = 'text-blue-600 bg-blue-50';
        let title = '';

        if (event.status === 'approved') {
          title = `Event approved: ${event.name}`;
          icon = 'ri-checkbox-circle-line';
          iconColor = 'text-green-600 bg-green-50';
        } else if (event.status === 'declined') {
          title = `Event declined: ${event.name}`;
          icon = 'ri-close-circle-line';
          iconColor = 'text-red-600 bg-red-50';
        } else {
          title = `New event created: ${event.name}`;
          icon = 'ri-calendar-event-line';
          iconColor = 'text-blue-600 bg-blue-50';
        }

        activityList.push({
          id: `event-${event.id}`,
          type: 'event',
          title,
          user: 'Admin',
          time: getTimeAgo(event.created_at),
          timestamp: new Date(event.created_at),
          icon,
          iconColor
        });
      });

      // Add recent notifications
      notificationsArray.slice(0, 5).forEach(notif => {
        let icon = 'ri-notification-3-line';
        let iconColor = 'text-yellow-600 bg-yellow-50';

        if (notif.type === 'event_approval') {
          icon = 'ri-calendar-check-line';
          iconColor = 'text-purple-600 bg-purple-50';
        } else if (notif.type === 'resource_booking') {
          icon = 'ri-archive-line';
          iconColor = 'text-blue-600 bg-blue-50';
        }

        activityList.push({
          id: `notif-${notif.id}`,
          type: 'notification',
          title: notif.message || 'New notification',
          user: 'System',
          time: getTimeAgo(notif.created_at),
          timestamp: new Date(notif.created_at),
          icon,
          iconColor
        });
      });

      // Sort by timestamp (most recent first) and take top 5
      const sortedActivities = activityList
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 5);

      setActivities(sortedActivities);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button 
          onClick={fetchRecentActivity}
          className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer whitespace-nowrap"
          title="Refresh"
        >
          <i className="ri-refresh-line"></i>
        </button>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-gray-400">
            <i className="ri-history-line text-3xl"></i>
          </div>
          <p className="text-sm text-gray-600">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${activity.iconColor}`}>
                <i className={activity.icon}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{activity.title}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>by {activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

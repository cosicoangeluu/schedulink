
'use client';

const activities = [
  {
    id: 1,
    type: 'registration',
    title: 'New registration for Tech Conference 2024',
    user: 'Sarah Johnson',
    time: '2 minutes ago',
    icon: 'ri-user-add-line',
    iconColor: 'text-green-600 bg-green-50'
  },
  {
    id: 2,
    type: 'event',
    title: 'Marketing Workshop scheduled',
    user: 'Admin',
    time: '15 minutes ago',
    icon: 'ri-calendar-event-line',
    iconColor: 'text-blue-600 bg-blue-50'
  },
  {
    id: 3,
    type: 'cancellation',
    title: 'Event cancelled: Product Launch',
    user: 'Mike Chen',
    time: '1 hour ago',
    icon: 'ri-close-circle-line',
    iconColor: 'text-red-600 bg-red-50'
  },
  {
    id: 4,
    type: 'feedback',
    title: 'New feedback received',
    user: 'Emma Wilson',
    time: '2 hours ago',
    icon: 'ri-star-line',
    iconColor: 'text-yellow-600 bg-yellow-50'
  },
  {
    id: 5,
    type: 'registration',
    title: 'Bulk registration for Leadership Summit',
    user: 'Corporate Team',
    time: '3 hours ago',
    icon: 'ri-team-line',
    iconColor: 'text-purple-600 bg-purple-50'
  }
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer whitespace-nowrap">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${activity.iconColor}`}>
              <i className={activity.icon}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>by {activity.user}</span>
                <span>•</span>
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

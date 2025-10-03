
'use client';

const actions = [
  {
    title: 'Create Event',
    description: 'Schedule a new event',
    icon: 'ri-add-circle-line',
    color: 'bg-blue-50 text-blue-600',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    title: 'Send Notification',
    description: 'Broadcast to attendees',
    icon: 'ri-notification-3-line',
    color: 'bg-green-50 text-green-600',
    hoverColor: 'hover:bg-green-100'
  },
  {
    title: 'Generate Report',
    description: 'Export analytics data',
    icon: 'ri-file-chart-line',
    color: 'bg-purple-50 text-purple-600',
    hoverColor: 'hover:bg-purple-100'
  },
  {
    title: 'Manage Resources',
    description: 'Update materials',
    icon: 'ri-folder-settings-line',
    color: 'bg-orange-50 text-orange-600',
    hoverColor: 'hover:bg-orange-100'
  }
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`p-4 rounded-lg border border-gray-200 text-left transition-colors cursor-pointer whitespace-nowrap ${action.hoverColor}`}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${action.color} mb-3`}>
              <i className={action.icon}></i>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
            <p className="text-sm text-gray-600">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

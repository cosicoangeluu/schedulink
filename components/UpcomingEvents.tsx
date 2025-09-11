
'use client';

const events = [
  {
    id: 1,
    title: 'Digital Marketing Summit 2024',
    date: 'March 15, 2024',
    time: '9:00 AM - 5:00 PM',
    attendees: 245,
    status: 'confirmed',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 2,
    title: 'Leadership Workshop Series',
    date: 'March 18, 2024',
    time: '2:00 PM - 4:00 PM',
    attendees: 89,
    status: 'pending',
    statusColor: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 3,
    title: 'Product Launch Webinar',
    date: 'March 22, 2024',
    time: '11:00 AM - 12:00 PM',
    attendees: 156,
    status: 'confirmed',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 4,
    title: 'Customer Success Training',
    date: 'March 25, 2024',
    time: '10:00 AM - 3:00 PM',
    attendees: 67,
    status: 'draft',
    statusColor: 'bg-gray-100 text-gray-800'
  }
];

export default function UpcomingEvents() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <button className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer whitespace-nowrap">
          View Calendar
        </button>
      </div>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-200 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900">{event.title}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${event.statusColor}`}>
                {event.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-calendar-line"></i>
                  </div>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-time-line"></i>
                  </div>
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-user-line"></i>
                </div>
                <span>{event.attendees} attendees</span>
              </div>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer whitespace-nowrap">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

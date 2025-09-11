
'use client';

import Sidebar from '../../components/Sidebar';

const eventReports = [
  {
    id: 1,
    eventName: 'Tech Conference',
    date: '2025-05-10',
    attendees: 120
  },
  {
    id: 2,
    eventName: 'Startup Pitch',
    date: '2025-05-15',
    attendees: 80
  },
  {
    id: 3,
    eventName: 'Innovation Summit',
    date: '2025-06-01',
    attendees: 200
  },
  {
    id: 4,
    eventName: 'AI Expo',
    date: '2025-06-20',
    attendees: 150
  }
];

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Event Attendance Reports</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventReports.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.eventName}</h3>
              <p className="text-sm text-gray-500 mb-4">Date: {event.date}</p>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-blue-600">{event.attendees}</span>
                <span className="text-blue-600 ml-2">Attendees</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

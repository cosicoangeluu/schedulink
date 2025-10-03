'use client';

import { useEffect, useState } from 'react';
import { useRole } from '../../components/RoleContext';
import Sidebar from '../../components/Sidebar';
import { useNotifications } from '../../context/NotificationsContext';
import AddEventModal from '../events/AddEventModal';

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: string;
  created_at: string;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { role } = useRole();
  const today = new Date().toISOString().split('T')[0];
  const filteredEventList = eventList;

  const { refreshNotifications } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

  const fetchApprovedEvents = () => {
    fetch('http://localhost:5000/api/events?status=approved')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Backend already filters by status=approved, no need to filter again
          setEventList(data);
        } else {
          console.error('Unexpected events data format:', data);
          setEventList([]);
        }
      })
      .catch(err => console.error('Failed to fetch approved events:', err));
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const venues = ['EMRC', 'Gymnasium', 'HRM Function Hall', 'Sport And Recreational Hall', 'Quadrangle'];

  const eventsByDate: { [key: string]: Event[] } = {};
  filteredEventList.forEach(event => {
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : startDate;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    }
  });

  const handleAddEvent = (newEvent: { name: string; description: string; start_date: string; end_date?: string }) => {
    fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // Don't add to calendar list since it's pending (calendar only shows approved events)
        // Just close modal and refresh notifications
        setShowAddModal(false);
        refreshNotifications();
        // Optionally show a success message that event is pending approval
        alert('Event created successfully! It will appear on the calendar once approved by an admin.');
      })
      .catch(err => {
        console.error('Failed to add event:', err);
        alert('Failed to create event. Please try again.');
      });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Toggle menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
      </div>

      <div className="flex-1 p-4 sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{monthNames[month]} {year} Calendar</h1>
            <p className="text-sm text-gray-600 mt-1">Showing approved events only</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
              className="bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
            >
              <i className="ri-arrow-left-line"></i> Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
              className="bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
            >
              Next <i className="ri-arrow-right-line"></i>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line mr-1"></i> Add Event
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-semibold text-gray-700">{day}</div>
          ))}

          {/* Empty cells before first day */}
          {[...Array(firstDay)].map((_, i) => (
            <div key={'empty-' + i} />
          ))}

          {/* Days of the month */}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const events = eventsByDate[dateStr] || [];
            const isToday = dateStr === today;

            return (
              <div 
                key={dateStr} 
                className={`border rounded-lg p-2 min-h-[100px] flex flex-col ${
                  isToday ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-red-600' : 'text-gray-700'}`}>
                  {day}
                </div>
                <div className="flex flex-col space-y-1 overflow-y-auto flex-1">
                  {events.length > 0 ? (
                    events.map((event: Event) => (
                      <div 
                        key={event.id} 
                        className="bg-green-100 text-green-800 rounded px-2 py-1 text-xs truncate hover:bg-green-200 transition-colors cursor-pointer" 
                        title={`${event.name}\n${event.description || 'No description'}`}
                      >
                        <i className="ri-checkbox-circle-fill mr-1"></i>
                        {event.name}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 italic">No events</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEvent}
        />
      )}
    </div>
  );
}

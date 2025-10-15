'use client';

import { useEffect, useState } from 'react';
import { useRole } from '../../components/RoleContext';
import Sidebar from '../../components/Sidebar';
import { useNotifications } from '../../context/NotificationsContext';
import AddEventModal from '../events/AddEventModal';
import EventDetailsModal from '../events/EventDetailsModal';

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  gymnasium: boolean;
  sports_area: boolean;
  application_date: string;
  rental_date: string;
  behalf_of: string;
  contact_info: string;
  nature_of_event: string;
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
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
  }, [currentDate]);

  const fetchApprovedEvents = () => {
    fetch('https://schedulink-backend.onrender.com/api/events?status=approved')
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          console.error('Fetch failed with status:', res.status);
          return [];
        }
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
      .catch(err => {
        console.error('Failed to fetch approved events:', err);
        setEventList([]);
      });
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const venues = ['EMRC', 'Gymnasium', 'HRM Function Hall', 'Sport And Recreational Hall', 'Quadrangle'];

  // Helper function to normalize dates to local midnight
  const normalizeDate = (dateStr: string): Date => {
    const date = new Date(dateStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const eventsByDate: { [key: string]: Event[] } = {};
  filteredEventList.forEach(event => {
    const startDate = normalizeDate(event.start_date);
    const endDate = event.end_date ? normalizeDate(event.end_date) : startDate;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    }
  });

  // Sort events in each date by start time
  Object.keys(eventsByDate).forEach(date => {
    eventsByDate[date].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  });

  // Helper function to get event color based on ID
  const getEventColor = (eventId: number) => {
    const colors = [
      { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', border: 'border-blue-600' },
      { bg: 'bg-green-500', hover: 'hover:bg-green-600', border: 'border-green-600' },
      { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', border: 'border-purple-600' },
      { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', border: 'border-orange-600' },
      { bg: 'bg-pink-500', hover: 'hover:bg-pink-600', border: 'border-pink-600' },
      { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', border: 'border-indigo-600' },
      { bg: 'bg-teal-500', hover: 'hover:bg-teal-600', border: 'border-teal-600' },
      { bg: 'bg-cyan-500', hover: 'hover:bg-cyan-600', border: 'border-cyan-600' },
    ];
    return colors[eventId % colors.length];
  };

  // Collect events visible in current month for positioning
  const allEventsInMonth: Array<Event & { visibleStart: Date; visibleEnd: Date; startDay: number; endDay: number }> = [];
  filteredEventList.forEach(event => {
    const start = normalizeDate(event.start_date);
    const end = event.end_date ? normalizeDate(event.end_date) : start;
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    
    // Check if event overlaps with current month
    if (end >= monthStart && start <= monthEnd) {
      const visibleStart = start < monthStart ? monthStart : start;
      const visibleEnd = end > monthEnd ? monthEnd : end;
      const startDay = visibleStart.getDate();
      const endDay = visibleEnd.getDate();
      
      allEventsInMonth.push({ ...event, visibleStart, visibleEnd, startDay, endDay });
    }
  });
  
  // Sort by start date AND time (earlier events first)
  allEventsInMonth.sort((a, b) => {
    const aTime = new Date(a.start_date).getTime();
    const bTime = new Date(b.start_date).getTime();
    return aTime - bTime;
  });
  console.log('filteredEventList length:', filteredEventList.length);
  console.log('allEventsInMonth length:', allEventsInMonth.length);

  // Assign row positions to handle overlapping events per week
  const eventRows: Array<{ event: Event & { visibleStart: Date; visibleEnd: Date; startDay: number; endDay: number }; row: number; weekRow: number }> = [];
  
  allEventsInMonth.forEach(event => {
    // Calculate which week row the event starts in
    const startWeekRow = Math.floor((firstDay + event.startDay - 1) / 7);
    
    let assignedRow = 0;
    while (true) {
      // Check for overlapping events in the same visual row and week
      const overlapping = eventRows.filter(e => {
        const eStartWeekRow = Math.floor((firstDay + e.event.startDay - 1) / 7);
        const eEndWeekRow = Math.floor((firstDay + e.event.endDay - 1) / 7);
        const currentEndWeekRow = Math.floor((firstDay + event.endDay - 1) / 7);
        
        // Check if they're in the same row and have overlapping weeks
        return e.row === assignedRow && 
               ((eStartWeekRow <= currentEndWeekRow && eEndWeekRow >= startWeekRow)) &&
               (e.event.endDay >= event.startDay && e.event.startDay <= event.endDay);
      });
      
      if (overlapping.length === 0) {
        break;
      }
      assignedRow++;
    }
    eventRows.push({ event, row: assignedRow, weekRow: startWeekRow });
  });
  console.log('eventRows length:', eventRows.length);

  const handleAddEvent = (newEvent: { name: string; description: string; start_date: string; end_date?: string }) => {
    fetch('https://schedulink-backend.onrender.com/api/events', {
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-red-400/15 to-pink-400/15 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl shadow-2xl hover:shadow-red-500/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          aria-label="Toggle menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
      </div>

      <div className="flex-1 p-4 sm:p-8 relative z-10">
        {/* Enhanced Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent mb-2">
                {monthNames[month]} {year} Calendar
              </h1>
              <p className="text-gray-900 text-lg">Calendar View • Approved Events Only</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                <div className="flex items-center space-x-2">
                  <i className="ri-calendar-line text-red-500"></i>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
                className="group bg-white/80 backdrop-blur-xl text-gray-700 px-4 py-3 rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 font-semibold text-sm flex items-center gap-2 hover:scale-105"
              >
                <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform duration-300"></i>
                Previous
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="group bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 font-semibold text-sm flex items-center gap-2 hover:scale-105"
              >
                <i className="ri-calendar-event-line"></i>
                Today
              </button>
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
                className="group bg-white/80 backdrop-blur-xl text-gray-700 px-4 py-3 rounded-2xl hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 font-semibold text-sm flex items-center gap-2 hover:scale-105"
              >
                Next
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="group bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-green-500/25 font-semibold text-sm flex items-center gap-2 hover:scale-105 whitespace-nowrap"
            >
              <i className="ri-add-line group-hover:rotate-90 transition-transform duration-300"></i>
              Add Event
            </button>
          </div>
        </div>

        {/* Enhanced Calendar Grid */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 overflow-hidden">
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-bold text-gray-800 p-3 text-sm bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 relative min-h-[600px]">
            {/* Empty cells before first day */}
            {[...Array(firstDay)].map((_, i) => (
              <div key={'empty-' + i} className="p-1" />
            ))}

            {/* Days of the month */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const isToday = dateStr === today;
              const eventsOnDay = eventsByDate[dateStr] || [];

              return (
                <div
                  key={dateStr}
                  className={`group relative p-2 min-h-[120px] rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    isToday
                      ? 'bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 shadow-lg'
                      : 'bg-white/80 hover:bg-white/90 border border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  <div className={`text-sm font-bold mb-2 ${isToday ? 'text-red-600' : 'text-gray-700'} group-hover:scale-110 transition-transform duration-300 inline-block`}>
                    {day}
                  </div>

                  {/* Event indicators */}
                  <div className="space-y-1">
                    {eventsOnDay.slice(0, 3).map((event, idx) => {
                      const eventColor = getEventColor(event.id);
                      const eventTime = new Date(event.start_date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });

                      return (
                        <div
                          key={event.id}
                          className={`text-xs p-1.5 rounded-lg ${eventColor.bg} text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer truncate`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setShowDetailsModal(true);
                          }}
                          title={`${event.name} at ${eventTime}`}
                        >
                          <div className="flex items-center gap-1">
                            <i className="ri-time-line text-xs opacity-80"></i>
                            <span className="truncate font-medium">{eventTime}</span>
                          </div>
                          <div className="truncate text-xs opacity-90 mt-0.5">{event.name}</div>
                        </div>
                      );
                    })}
                    {eventsOnDay.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium bg-gray-100 rounded-lg px-2 py-1">
                        +{eventsOnDay.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-information-line text-blue-500"></i>
            Calendar Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { bg: 'bg-blue-500', label: 'Event Type A' },
              { bg: 'bg-green-500', label: 'Event Type B' },
              { bg: 'bg-purple-500', label: 'Event Type C' },
              { bg: 'bg-orange-500', label: 'Event Type D' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${item.bg} shadow-sm`}></div>
                <span className="text-sm text-gray-700 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEvent}
        />
      )}

      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => { setShowDetailsModal(false); setSelectedEvent(null); }}
        />
      )}
    </div>
  );
}

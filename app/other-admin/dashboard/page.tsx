'use client';

import ViewEventModal from '@/app/events/ViewEventModal';
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../../../components/Sidebar';

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

export default function OtherAdminDashboard() {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notifications, setNotifications] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date().toISOString().split('T')[0];



  // SSE setup - runs once on mount
  useEffect(() => {
    const eventSource = new EventSource('https://schedulink-backend.onrender.com/api/sse');
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'event_approved') {
        setNotifications(prev => [...prev, data.message]);

      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      console.error('SSE readyState:', eventSource.readyState);
      if (eventSource.readyState === EventSource.CLOSED) {
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            eventSourceRef.current?.close();
            const newEventSource = new EventSource('https://schedulink-backend.onrender.com/api/sse');
            eventSourceRef.current = newEventSource;
            // Re-attach handlers
            newEventSource.onmessage = eventSource.onmessage;
            newEventSource.onerror = eventSource.onerror;
            eventSourceRef.current = newEventSource;
          }
        }, 5000);
      }
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, []);

  // Fetch events on date change
  useEffect(() => {
    fetchApprovedEvents();
  }, [currentDate]);

  const fetchApprovedEvents = () => {
    // No token needed for public calendar view - backend allows unauthenticated access to approved events
    fetch('https://schedulink-backend.onrender.com/api/events?status=approved', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
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

  const normalizeDate = (dateStr: string): Date => {
    const date = new Date(dateStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const eventsByDate: { [key: string]: Event[] } = {};
  eventList.forEach(event => {
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

  Object.keys(eventsByDate).forEach(date => {
    eventsByDate[date].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  });

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

  const allEventsInMonth: Array<Event & { visibleStart: Date; visibleEnd: Date; startDay: number; endDay: number }> = [];
  eventList.forEach(event => {
    const start = normalizeDate(event.start_date);
    const end = event.end_date ? normalizeDate(event.end_date) : start;
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    if (end >= monthStart && start <= monthEnd) {
      const visibleStart = start < monthStart ? monthStart : start;
      const visibleEnd = end > monthEnd ? monthEnd : end;
      const startDay = visibleStart.getDate();
      const endDay = visibleEnd.getDate();

      allEventsInMonth.push({ ...event, visibleStart, visibleEnd, startDay, endDay });
    }
  });

  allEventsInMonth.sort((a, b) => {
    const aTime = new Date(a.start_date).getTime();
    const bTime = new Date(b.start_date).getTime();
    return aTime - bTime;
  });

  const eventRows: Array<{ event: Event & { visibleStart: Date; visibleEnd: Date; startDay: number; endDay: number }; row: number; weekRow: number }> = [];

  allEventsInMonth.forEach(event => {
    const startWeekRow = Math.floor((firstDay + event.startDay - 1) / 7);

    let assignedRow = 0;
    while (true) {
      const overlapping = eventRows.filter(e => {
        const eStartWeekRow = Math.floor((firstDay + e.event.startDay - 1) / 7);
        const eEndWeekRow = Math.floor((firstDay + e.event.endDay - 1) / 7);
        const currentEndWeekRow = Math.floor((firstDay + event.endDay - 1) / 7);

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

      <div className="flex-1 pt-16 md:pt-0 p-4 sm:p-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Other Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and view approved events calendar</p>
        </div>

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
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0 text-center relative">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-semibold text-gray-700 p-2">{day}</div>
          ))}

          {[...Array(firstDay)].map((_, i) => (
            <div key={'empty-' + i} className="p-2" />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const isToday = dateStr === today;

            return (
              <div
                key={dateStr}
                className={`border rounded-lg p-2 min-h-[140px] relative ${
                  isToday ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-red-600' : 'text-gray-700'}`}>
                  {day}
                </div>
              </div>
            );
          })}

          <div className="absolute inset-0 pointer-events-none" style={{ top: '40px' }}>
            {eventRows.map(({ event, row, weekRow }) => {
              const startDay = event.startDay;
              const endDay = event.endDay;
              const eventColor = getEventColor(event.id);

              const startPosition = firstDay + startDay - 1;
              const endPosition = firstDay + endDay - 1;

              const startWeek = Math.floor(startPosition / 7);
              const endWeek = Math.floor(endPosition / 7);

              const eventBars = [];
              for (let week = startWeek; week <= endWeek; week++) {
                const weekStartPos = week * 7;
                const weekEndPos = weekStartPos + 6;

                const segmentStart = Math.max(startPosition, weekStartPos);
                const segmentEnd = Math.min(endPosition, weekEndPos);

                const startCol = segmentStart % 7;
                const endCol = segmentEnd % 7;
                const span = endCol - startCol + 1;

                const leftPercent = (startCol / 7) * 100;
                const widthPercent = (span / 7) * 100;
                const topPx = week * 140 + 28 + row * 26;

                const eventTime = new Date(event.start_date).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                });

                eventBars.push(
                  <div
                    key={`${event.id}-week-${week}`}
                    className={`absolute ${eventColor.bg} text-white rounded-md px-2 py-1 text-xs font-medium shadow-sm border-l-4 ${eventColor.border} cursor-pointer ${eventColor.hover} pointer-events-auto`}
                    style={{
                      left: `calc(${leftPercent}% + 4px)`,
                      width: `calc(${widthPercent}% - 8px)`,
                      top: `${topPx}px`,
                      height: '22px',
                      lineHeight: '22px',
                      zIndex: 10
                    }}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowDetailsModal(true);
                    }}
                    title={`${event.name}\n${eventTime}\n${event.description || 'No description'}`}
                  >
                    <div className="flex items-center gap-1 truncate">
                      <i className="ri-time-line text-xs"></i>
                      <span className="truncate">{eventTime} - {event.name}</span>
                    </div>
                  </div>
                );
              }

              return eventBars;
            })}
          </div>
        </div>
      </div>

      {showDetailsModal && selectedEvent && (
        <ViewEventModal
          event={selectedEvent}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}

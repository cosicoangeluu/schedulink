
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: string;
  created_at: string;
}



export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const eventsRes = await fetch('https://schedulink-backend.onrender.com/api/events?status=approved');

      const eventsData = await eventsRes.json();

      // Filter for upcoming events (future dates only)
      const now = new Date();
      let upcomingEvents: Event[] = [];
      if (Array.isArray(eventsData)) {
        upcomingEvents = eventsData
          .filter(event => new Date(event.start_date) >= now)
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 4); // Show only next 4 events
      }

      setEvents(upcomingEvents);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const startTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (endDate) {
      const end = new Date(endDate);
      const endTime = end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${startTime} - ${endTime}`;
    }

    return startTime;
  };

  const getAttendeeCount = (eventId: number) => {
    return 0;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        <Link href="/calendar" className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer whitespace-nowrap">
          View Calendar
        </Link>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 text-gray-400">
            <i className="ri-calendar-event-line text-3xl"></i>
          </div>
          <p className="text-sm text-gray-600">No upcoming events scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-200 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{event.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              
              {event.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{event.description}</p>
              )}
              
              <div className="text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-calendar-line"></i>
                    </div>
                    <span>{formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-time-line"></i>
                    </div>
                    <span>{formatTime(event.start_date, event.end_date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Link
                  href="/events"
                  className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer whitespace-nowrap"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

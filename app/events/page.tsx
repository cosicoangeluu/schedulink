'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import EventCard from './EventCard';

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: string;
  created_at: string;
}

const isEventArray = (data: any): data is Event[] => {
  return Array.isArray(data);
};

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [eventList, setEventList] = useState<Event[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (isEventArray(data)) {
          setEventList(data);
        } else {
          console.error('Unexpected data format for events:', data);
          setEventList([]);
        }
      })
      .catch(err => console.error('Failed to fetch events:', err));
  }, []);

  const filteredEvents = eventList.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate === '' || event.start_date.startsWith(selectedDate);
    return matchesSearch && matchesDate;
  });

  const handleDeleteEvent = (eventId: number) => {
    fetch(`http://localhost:5000/api/events/${eventId}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setEventList(prev => prev.filter(event => event.id !== eventId));
        } else {
          console.error('Failed to delete event');
        }
      })
      .catch(err => console.error('Failed to delete event:', err));
  };

  const handleEditEvent = (eventId: number, updatedEvent: { name: string; description: string; start_date: string; end_date?: string }) => {
    fetch(`http://localhost:5000/api/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent)
    })
      .then(res => res.json())
      .then(data => {
        setEventList(prev => prev.map(event => event.id === eventId ? { ...event, ...updatedEvent } : event));
      })
      .catch(err => console.error('Failed to edit event:', err));
  };


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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDeleteEvent}
              onEdit={handleEditEvent}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <i className="ri-calendar-event-line text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}

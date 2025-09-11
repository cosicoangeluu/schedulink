
'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AddEventModal from './AddEventModal';
import EventCard from './EventCard';

interface Event {
  id: number;
  name: string;
  date: string;
  venue: string;
  status: string;
  attendees: number;
  addedBy: string;
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventList, setEventList] = useState<Event[]>([]);

  const venues = ['EMPC', 'Gymnasium', 'Convention Center', 'Training Hall', 'Auditorium', 'Meeting Room A'];

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEventList(data))
      .catch(err => console.error('Failed to fetch events:', err));
  }, []);

  const filteredEvents = eventList.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVenue = selectedVenue === '' || event.venue === selectedVenue;
    const matchesDate = selectedDate === '' || event.date === selectedDate;
    return matchesSearch && matchesVenue && matchesDate;
  });

  const handleDeleteEvent = (eventId: number) => {
    fetch(`http://localhost:5000/api/events/${eventId}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setEventList(eventList.filter(event => event.id !== eventId));
        } else {
          console.error('Failed to delete event');
        }
      })
      .catch(err => console.error('Failed to delete event:', err));
  };

  const handleAddEvent = (newEvent: any) => {
    fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })
      .then(res => res.json())
      .then(data => {
        setEventList([...eventList, { ...newEvent, id: data.id, attendees: newEvent.attendees || 0 }]);
        setShowAddModal(false);

        // Create notification for the new event
        const notification = {
          eventName: newEvent.name,
          status: 'New Event Added',
          studentName: 'System',
          course: 'N/A',
          studentId: 'N/A',
          submittedDate: new Date().toISOString().split('T')[0]
        };

        fetch('http://localhost:5000/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        })
          .then(res => res.json())
          .then(() => console.log('Notification created for new event'))
          .catch(err => console.error('Failed to create notification:', err));
      })
      .catch(err => console.error('Failed to add event:', err));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                type="text"
                placeholder="Event Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="relative">
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm appearance-none bg-white"
              >
                <option value="">Select Venue</option>
                {venues.map(venue => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-gray-400"></i>
                </div>
              </div>
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
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <i className="ri-calendar-event-line text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search filters or add a new event.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEvent}
          venues={venues}
        />
      )}
    </div>
  );
}

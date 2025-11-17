'use client';

import { useEffect, useState } from 'react';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import Sidebar from '../../components/Sidebar';
import EditEventModal from './EditEventModal';
import EventCard from './EventCard';
import { API_ENDPOINTS } from '@/lib/api-config';

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  venues: number[];
  equipment: {id: number, quantity: number}[];
  application_date: string;
  rental_date: string;
  behalf_of: string;
  contact_info: string;
  nature_of_event: string;
  requires_equipment?: boolean;
  chairs_qty?: number;
  tables_qty?: number;
  projector?: boolean;
  other_equipment?: string;
  setup_start_time?: string;
  setup_end_time?: string;
  setup_hours?: number;
  event_start_time?: string;
  event_end_time?: string;
  event_hours?: number;
  cleanup_start_time?: string;
  cleanup_end_time?: string;
  cleanup_hours?: number;
  total_hours?: number;
  multi_day_schedule?: string;
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventForDelete, setSelectedEventForDelete] = useState<Event | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.error('No admin token found. Please log in as admin.');
      return;
    }
    fetch(API_ENDPOINTS.events, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
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
    const isApproved = event.status === 'approved';
    return matchesSearch && matchesDate && isApproved;
  });

  const handleDeleteEvent = async (eventId: number) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_ENDPOINTS.events}/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setEventList(prev => prev.filter(event => event.id !== eventId));
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
      throw err; // Re-throw to allow error handling in the component
    }
  };

  const handleAddEvent = async (eventData: { name: string; description: string; start_date: string; end_date?: string; venues: number[]; equipment: {id: number, quantity: number}[]; application_date: string; rental_date: string; behalf_of: string; contact_info: string; nature_of_event: string; requires_equipment?: boolean; chairs_qty?: number; tables_qty?: number; projector?: boolean; other_equipment?: string; setup_start_time?: string; setup_end_time?: string; setup_hours?: number; event_start_time?: string; event_end_time?: string; event_hours?: number; cleanup_start_time?: string; cleanup_end_time?: string; cleanup_hours?: number; total_hours?: number; multi_day_schedule?: File }) => {
    const formData = new FormData();

    // Add all fields to FormData
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'venues' || key === 'equipment') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'multi_day_schedule' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(API_ENDPOINTS.events, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error('Failed to add event');
      }

      const data = await res.json();
      setEventList(prev => [...prev, data]);
    } catch (err) {
      console.error('Failed to add event:', err);
      throw err;
    }
  };

  const handleEditEvent = async (eventId: number, updatedEvent: { name: string; description: string; start_date: string; end_date?: string; venues: number[]; equipment: {id: number, quantity: number}[]; application_date: string; rental_date: string; behalf_of: string; contact_info: string; nature_of_event: string; requires_equipment?: boolean; chairs_qty?: number; tables_qty?: number; projector?: boolean; other_equipment?: string; setup_start_time?: string; setup_end_time?: string; setup_hours?: number; event_start_time?: string; event_end_time?: string; event_hours?: number; cleanup_start_time?: string; cleanup_end_time?: string; cleanup_hours?: number; total_hours?: number; multi_day_schedule?: string | File }) => {
    const formData = new FormData();

    // Add all fields to FormData
    Object.entries(updatedEvent).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'venues' || key === 'equipment') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'multi_day_schedule' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_ENDPOINTS.events}/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error('Failed to edit event');
      }

      const data = await res.json();
      setEventList(prev => prev.map(event => event.id === eventId ? { ...event, ...data } : event));
      setShowEditModal(false);
      setSelectedEventForEdit(null);
    } catch (err) {
      console.error('Failed to edit event:', err);
      throw err;
    }
  };

  const handleOpenEditModal = (event: Event) => {
    setSelectedEventForEdit(event);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEventForEdit(null);
  };

  const handleOpenDeleteModal = (event: Event) => {
    setSelectedEventForDelete(event);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEventForDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedEventForDelete) {
      try {
        await handleDeleteEvent(selectedEventForDelete.id);
        setShowDeleteModal(false);
        setSelectedEventForDelete(null);
      } catch (err) {
        // Error handling is done in handleDeleteEvent
      }
    }
  };


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
                Event Management
              </h1>
              <p className="text-gray-900 text-lg">Manage and oversee all approved events</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                <div className="flex items-center space-x-2">
                  <i className="ri-calendar-event-line text-red-500"></i>
                  <span className="text-sm font-medium text-gray-700">
                    {filteredEvents.length} Events
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search & Filter Section */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="ri-search-line text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
                  <p className="text-sm text-gray-900">Find events by name or date</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                  <i className="ri-file-search-line text-blue-500"></i>
                  Search Events
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by event name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-lg text-sm font-medium text-gray-900"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-900 group-focus-within:text-blue-500 transition-colors duration-300">
                    <i className="ri-search-line text-lg"></i>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                  <i className="ri-calendar-line text-green-500"></i>
                  Filter by Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:shadow-lg text-sm font-medium text-gray-900"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300">
                    <i className="ri-calendar-line text-lg"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedDate) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {searchTerm && (
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
                    <i className="ri-search-line"></i>
                    "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="hover:bg-blue-100 rounded-full p-1 transition-colors duration-200"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </div>
                )}
                {selectedDate && (
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
                    <i className="ri-calendar-line"></i>
                    {new Date(selectedDate).toLocaleDateString()}
                    <button
                      onClick={() => setSelectedDate('')}
                      className="hover:bg-green-100 rounded-full p-1 transition-colors duration-200"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${showEditModal || showDeleteModal ? 'pointer-events-none opacity-50' : ''}`}>
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
            >
              <EventCard
                event={event}
                onDelete={handleOpenDeleteModal}
                onEdit={handleOpenEditModal}
              />
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredEvents.length === 0 && (
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <i className="ri-calendar-event-line text-6xl text-gray-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Found</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {searchTerm || selectedDate
                ? "Try adjusting your search filters to find more events."
                : "There are no approved events at the moment."
              }
            </p>
            {(searchTerm || selectedDate) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDate('');
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 font-semibold"
              >
                <i className="ri-refresh-line"></i>
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedEventForEdit && (
          <EditEventModal
            event={selectedEventForEdit}
            onClose={handleCloseEditModal}
            onSave={handleEditEvent}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedEventForDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            message={`Are you sure you want to delete the event "${selectedEventForDelete.name}"? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCloseDeleteModal}
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
}

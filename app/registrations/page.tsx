'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AddRegistrationModal from './AddRegistrationModal';
import RegistrationCard from './RegistrationCard';

interface Registration {
  id: number;
  fullName: string;
  studentId: string;
  course: string;
  eventName: string;
  eventId?: number;
  registrationDate: string;
  email?: string;
  phone?: string;
  status: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
  venue: string;
  status: string;
  attendees: number;
  addedBy: string;
}

const courses = ['BSCS', 'CITHM', 'BSBA', 'BSCE', 'BSA','BSN' ];

export default function RegistrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // New state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteRegistrationId, setDeleteRegistrationId] = useState<number | null>(null);
  const [deleteRegistrationName, setDeleteRegistrationName] = useState<string>('');

  useEffect(() => {
    // Fetch registrations
    fetch('http://localhost:5000/api/registrations')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setRegistrations(data);
        } else {
          console.error('Invalid registrations data:', data);
        }
      })
      .catch(err => console.error('Failed to fetch registrations:', err));

    // Fetch events
    fetch('http://localhost:5000/api/events')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Invalid events data:', data);
        }
      })
      .catch(err => console.error('Failed to fetch events:', err));
  }, []);

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch =
      (registration.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (registration.studentId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (registration.course?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === '' || registration.eventName === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  // Updated handleDeleteRegistration to show modal instead of confirm dialog
  const handleDeleteRegistration = (registrationId: number, registrationName: string) => {
    setDeleteRegistrationId(registrationId);
    setDeleteRegistrationName(registrationName);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const confirmDeleteRegistration = () => {
    if (deleteRegistrationId === null) return;

    fetch(`http://localhost:5000/api/registrations/${deleteRegistrationId}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setRegistrations(registrations.filter(reg => reg.id !== deleteRegistrationId));
        } else {
          console.error('Failed to delete registration');
        }
      })
      .catch(err => console.error('Failed to delete registration:', err))
      .finally(() => {
        setShowDeleteModal(false);
        setDeleteRegistrationId(null);
        setDeleteRegistrationName('');
      });
  };

  // Cancel delete action
  const cancelDeleteRegistration = () => {
    setShowDeleteModal(false);
    setDeleteRegistrationId(null);
    setDeleteRegistrationName('');
  };

  const handleEditRegistration = (id: number, updatedRegistration: Partial<Registration>) => {
    // Update registration locally
    setRegistrations(prev =>
      prev.map(reg => (reg.id === id ? { ...reg, ...updatedRegistration } : reg))
    );

    // Optionally, send update to backend
    fetch(`http://localhost:5000/api/registrations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRegistration)
    }).catch(err => console.error('Failed to update registration:', err));
  };

    const handleAddRegistration = (newRegistration: any) => {
    fetch('http://localhost:5000/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRegistration)
    })
      .then(res => {
        if (res.status === 409) {
          setSubmitStatus('Registration already exists for this student and event');
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setRegistrations([...registrations, data]);
          setSubmitStatus('Registration added successfully!');
          setShowAddModal(false); // Close modal after successful addition
        }
      })
      .catch(err => {
        console.error('Failed to add registration:', err);
        setSubmitStatus('Failed to add registration');
      });
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
          <h1 className="text-2xl font-bold text-gray-900">Event Participants</h1>
          <p className="text-gray-600 mt-1">Manage students who participated in events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center text-blue-600">
                  <i className="ri-user-add-line text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center text-green-600">
                  <i className="ri-calendar-event-line text-xl"></i>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Add New Participant</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
            >
              Add Participant
            </button>
          </div>
          {submitStatus && (
            <p className={`text-sm ${submitStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {submitStatus}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {filteredRegistrations.map(registration => (
            <RegistrationCard
              key={registration.id}
              registration={registration}
          onDelete={handleDeleteRegistration}
          onEdit={handleEditRegistration}
        />
      ))}
        </div>

        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <i className="ri-user-add-line text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No participants found</h3>
            <p className="text-gray-600">Try adjusting your search filters or add a new participant.</p>
          </div>
        )}

        {showAddModal && (
          <AddRegistrationModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddRegistration}
            events={events.map(e => ({ id: e.id, name: e.name }))}
            courses={courses}
          />
        )}
      </div>
    </div>
  );
}

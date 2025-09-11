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
  registrationDate: string;
  email?: string;
  phone?: string;
  status: string;
}

const events = [
  'Tech Conference',
  'Startup Pitch',
  'Digital Marketing Summit',
  'Leadership Workshop',
  'Product Launch',
  'Customer Success Training'
];

const courses = ['BSCS', 'BSIT', 'BSBA', 'BSCE', 'BSME'];

export default function RegistrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/registrations')
      .then(res => res.json())
      .then(data => setRegistrations(data))
      .catch(err => console.error('Failed to fetch registrations:', err));
  }, []);

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch =
      registration.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === '' || registration.eventName === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  const handleDeleteRegistration = (registrationId: number) => {
    fetch(`http://localhost:5000/api/registrations/${registrationId}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setRegistrations(registrations.filter(reg => reg.id !== registrationId));
        } else {
          console.error('Failed to delete registration');
        }
      })
      .catch(err => console.error('Failed to delete registration:', err));
  };

  const handleAddRegistration = (newRegistration: any) => {
    const registrationWithDate = {
      ...newRegistration,
      registrationDate: new Date().toISOString()
    };
    fetch('http://localhost:5000/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationWithDate)
    })
      .then(res => res.json())
      .then(data => {
        setRegistrations([...registrations, { ...registrationWithDate, id: data.id }]);
        setSubmitStatus('Registration added successfully!');
        setShowAddModal(false); // Close modal after successful addition
      })
      .catch(err => {
        console.error('Failed to add registration:', err);
        setSubmitStatus('Failed to add registration');
      });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
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
              onEdit={handleAddRegistration}
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
            events={events}
            courses={courses}
          />
        )}
      </div>
    </div>
  );
}

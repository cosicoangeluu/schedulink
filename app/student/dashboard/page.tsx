'use client';

import { useEffect, useState } from 'react';
import { useRole } from '../../../components/RoleContext';
import Sidebar from '../../../components/Sidebar';
import AddEventModal from '../../events/AddEventModal';

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: string;
  created_at: string;
  attendees?: number;
}

interface Registration {
  id: number;
  eventId: number;
  status: string;
}

interface Report {
  id: number;
  eventId: number;
  filePath: string;
  uploadedBy: string;
  uploadedAt: string;
  eventName: string;
  attendees: number;
}

export default function StudentDashboard() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<'events' | 'reports'>('events');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Events tab state
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // View Modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Reports tab state
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    if (activeTab === 'events') {
      fetchMyEvents();
    } else {
      fetchApprovedEvents();
      fetchReports();
    }
  }, [activeTab]);

  const fetchMyEvents = async () => {
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        fetch('http://localhost:5000/api/events'),
        fetch('http://localhost:5000/api/registrations')
      ]);

      if (eventsRes.ok && registrationsRes.ok) {
        const eventsData = await eventsRes.json();
        const registrationsData = await registrationsRes.json();
        
        setRegistrations(registrationsData);
        
        // Add attendee count to each event
        const eventsWithAttendees = eventsData.map((event: Event) => ({
          ...event,
          attendees: registrationsData.filter(
            (reg: Registration) => reg.eventId === event.id && reg.status === 'registered'
          ).length
        }));
        
        setMyEvents(eventsWithAttendees);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchApprovedEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events?status=approved');
      if (response.ok) {
        const data = await response.json();
        setApprovedEvents(data);
        if (data.length > 0 && selectedEventId === 0) {
          setSelectedEventId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching approved events:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleAddEvent = (newEvent: { name: string; description: string; start_date: string; end_date?: string }) => {
    fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add event');
        return res.json();
      })
      .then(data => {
        setShowAddModal(false);
        alert('Event added successfully and is pending approval.');
        fetchMyEvents();
      })
      .catch(err => {
        console.error('Failed to add event:', err);
        alert('Failed to add event. Please try again.');
      });
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !role) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('report', selectedFile);
    formData.append('eventId', selectedEventId.toString());
    formData.append('uploadedBy', role);

    try {
      const response = await fetch('http://localhost:5000/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Report uploaded successfully!');
        setSelectedFile(null);
        fetchReports();
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        alert('Failed to upload report');
      }
    } catch (error) {
      console.error('Error uploading report:', error);
      alert('Error uploading report');
    } finally {
      setUploading(false);
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
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const pendingCount = myEvents.filter(e => e.status === 'pending').length;
  const approvedCount = myEvents.filter(e => e.status === 'approved').length;
  const declinedCount = myEvents.filter(e => e.status === 'declined').length;

  return (
    <div className="flex min-h-screen bg-gray-50
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

      <div className="flex-1 pt-16 md:pt-0 p-4 sm:p-8 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 / Department Head Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your events and submit narrative reports</p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Add Event Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <i className="ri-add-circle-line text-xl text-red-600
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 Event</p>
                  <p className="text-lg font-bold text-gray-900 New</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Pending Events Stat */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-xl text-yellow-600
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 Events</p>
                <p className="text-2xl font-bold text-gray-900
              </div>
            </div>
          </div>

          {/* Upload Report Action */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="ri-upload-2-line text-xl text-blue-600
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 Report</p>
                  <p className="text-lg font-bold text-gray-900 New</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('reports')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Upload
              </button>
            </div>
          </div>

          {/* My Reports Stat */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <i className="ri-file-text-line text-xl text-green-600
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 Reports</p>
                <p className="text-2xl font-bold text-gray-900
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Interface */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
          {/* Compact Tabs */}
          <div className="border-b border-gray-200
            <div className="flex space-x-1 p-1">
              <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'events'
                    ? 'bg-red-50 text-red-700 border border-red-200
                    : 'text-gray-600 hover:bg-gray-50
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <i className="ri-calendar-event-line text-sm"></i>
                  <span>Events</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-red-50 text-red-700 border border-red-200
                    : 'text-gray-600 hover:bg-gray-50
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <i className="ri-file-text-line text-sm"></i>
                  <span>Reports</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 Events</h2>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap flex items-center"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Event
                  </button>
                </div>

                {loadingEvents ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading events...</p>
                  </div>
                ) : myEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400
                      <i className="ri-calendar-event-line text-4xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                    <p className="text-gray-600 mb-4">Create your first event to get started</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
                    >
                      Add Event
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg overflow-hidden">
                      <thead className="bg-gray-50
                        <tr>
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700
                          <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700
                        </tr>
                      </thead>
                      <tbody>
                        {myEvents.map(event => (
                          <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                            <td className="border border-gray-200 px-4 py-3">
                              <div className="font-medium text-gray-900
                              {event.description && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{event.description}</p>
                              )}
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600
                            <td className="border border-gray-200 px-4 py-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-blue-600 || 0}</td>
                            <td className="border border-gray-200 px-4 py-3">
                              <button 
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setShowViewModal(true);
                                }}
                                className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Submit Narrative Reports</h2>

                {/* Upload Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Upload New Report</h3>
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    <div>
                      <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Approved Event <span className="text-red-600
                      </label>
                      <select
                        id="event-select"
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white
                        required
                      >
                        <option value={0}>Select an event...</option>
                        {approvedEvents.map(event => (
                          <option key={event.id} value={event.id}>
                            {event.name} - {formatDate(event.start_date)}
                          </option>
                        ))}
                      </select>
                      {approvedEvents.length === 0 && (
                        <p className="text-xs text-gray-500 mt-1">No approved events available. Events must be approved before you can submit reports.</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                        Select PDF File <span className="text-red-600
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Only PDF files are accepted. Maximum file size: 10MB</p>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading || approvedEvents.length === 0 || selectedEventId === 0}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium cursor-pointer flex items-center"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className="ri-upload-2-line mr-2"></i>
                          Upload Report
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Uploaded Reports Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-200
                    <h3 className="text-md font-semibold text-gray-900 Uploaded Reports</h3>
                  </div>
                  {loadingReports ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-gray-600 mt-4">Loading reports...</p>
                    </div>
                  ) : reports.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400
                        <i className="ri-file-text-line text-4xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No reports uploaded yet</h3>
                      <p className="text-gray-600 mb-4">Upload your first narrative report to get started</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-50
                          <tr>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 Name</th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 At</th>
                            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700
                          </tr>
                        </thead>
                        <tbody>
                          {reports.map(report => (
                            <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-200 px-4 py-3">
                                <div className="font-medium text-gray-900
                                <p className="text-sm text-gray-600 mt-1">Attendees: {report.attendees}</p>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600
                              <td className="border border-gray-200 px-4 py-3">
                                <a
                                  href={`http://localhost:5000/uploads/${report.filePath.split('/').pop()}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                                >
                                  View
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

<AddEventModal show={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddEvent} />

{selectedEvent && <EventDetailsModal show={showViewModal} onClose={() => setShowViewModal(false)} event={selectedEvent} />}

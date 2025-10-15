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
  gymnasium: boolean;
  sports_area: boolean;
  application_date: string;
  rental_date: string;
  behalf_of: string;
  contact_info: string;
  nature_of_event: string;
  status: string;
  created_at: string;
  attendees?: number;
}



export default function StudentDashboard() {
  const { role } = useRole();
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Reports state
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number>(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchApprovedEvents();

    // Connect to SSE for real-time notifications
    const eventSource = new EventSource('https://schedulink-backend.onrender.com/api/sse');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'event_approved') {
        setNotifications(prev => [...prev, data.message]);
        // Show toast notification
        showToast(data.message);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      // Attempt to reconnect on error
      setTimeout(() => {
        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('Attempting to reconnect SSE...');
          const newEventSource = new EventSource('https://schedulink-backend.onrender.com/api/sse');
          newEventSource.onmessage = eventSource.onmessage;
          newEventSource.onerror = eventSource.onerror;
          // Replace the old eventSource with the new one
          eventSource.close();
          // Note: In a real implementation, you'd need to manage the new connection properly
        }
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const fetchApprovedEvents = async () => {
    try {
      const response = await fetch('https://schedulink-backend.onrender.com/api/events?status=approved');
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

  const handleAddEvent = (newEvent: { name: string; description: string; start_date: string; end_date?: string }) => {
    fetch('https://schedulink-backend.onrender.com/api/events', {
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
      const response = await fetch('https://schedulink-backend.onrender.com/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Report uploaded successfully!');
        setSelectedFile(null);
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

  const showToast = (message: string) => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 5000);
  };

  return (
    <>
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

        <div className="flex-1 pt-16 md:pt-0 p-4 sm:p-8 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent mb-2">
              Student Dashboard
            </h1>
            <p className="text-gray-900 text-lg">Manage your events and submit narrative reports</p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Add Event Card */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-md border border-red-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                    <i className="ri-add-circle-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Create Event</p>
                    <p className="text-xs text-gray-700 mt-1">Add new event request</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  Add Event
                </button>
              </div>
            </div>

            {/* Upload Report Action */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <i className="ri-file-upload-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Submit Report</p>
                    <p className="text-xs text-gray-700 mt-1">Upload narrative report</p>
                  </div>
                </div>
                <button
                  onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <div id="upload-section" className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className="ri-file-text-line text-2xl text-white"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Narrative Report Submission</h2>
                  <p className="text-red-100 text-sm mt-1">Upload your event report in PDF format</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Step Indicators */}
              <div className="flex items-center justify-center mb-8 space-x-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    1
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-900">Select Event</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    2
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-900">Choose File</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    3
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-900">Submit</span>
                </div>
              </div>

              {/* Upload Form Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 p-8 shadow-sm">
                <form onSubmit={handleFileUpload} className="space-y-6">
                  {/* Step 1: Select Event */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <i className="ri-calendar-event-line text-red-600"></i>
                      </div>
                      <label htmlFor="event-select" className="text-base font-bold text-gray-900">
                        Step 1: Select Approved Event <span className="text-red-600">*</span>
                      </label>
                    </div>
                    <select
                      id="event-select"
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base text-gray-900 bg-white font-medium transition-all"
                      required
                    >
                      <option value={0}>Choose an event from the list...</option>
                      {approvedEvents.map(event => (
                        <option key={event.id} value={event.id}>
                          {event.name} - {formatDate(event.start_date)}
                        </option>
                      ))}
                    </select>
                    {approvedEvents.length === 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
                        <i className="ri-information-line text-yellow-600 mt-0.5"></i>
                        <p className="text-sm text-gray-800">No approved events available. Events must be approved before you can submit reports.</p>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Upload File */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="ri-file-pdf-line text-blue-600"></i>
                      </div>
                      <label htmlFor="file-input" className="text-base font-bold text-gray-900">
                        Step 2: Upload PDF File <span className="text-red-600">*</span>
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input
                        id="file-input"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer transition-all"
                        required
                      />
                      {selectedFile && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                          <i className="ri-checkbox-circle-line text-green-600"></i>
                          <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <i className="ri-information-line text-blue-600 mt-0.5"></i>
                        <div className="text-sm text-gray-800">
                          <p className="font-semibold">File Requirements:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>Format: PDF only</li>
                            <li>Maximum size: 10MB</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Submit Button */}
                  <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="ri-send-plane-line text-green-600"></i>
                      </div>
                      <span className="text-base font-bold text-gray-900">Step 3: Submit Your Report</span>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={uploading || approvedEvents.length === 0 || selectedEventId === 0 || !selectedFile}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base font-bold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full"></div>
                          <span>Uploading Report...</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-upload-cloud-line text-xl"></i>
                          <span>Submit Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {showAddModal && <AddEventModal onClose={() => setShowAddModal(false)} onAdd={handleAddEvent} />}
      </div>
    </>
  );
}

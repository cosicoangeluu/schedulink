'use client';

import { useEffect, useState } from 'react';
import { useRole } from '../../components/RoleContext';
import Sidebar from '../../components/Sidebar';

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  status: string;
  attendees: number;
}

interface UploadedFile {
  id: number;
  eventId: number;
  filePath: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  eventName: string;
  fileSize: number;
  exists: boolean;
}

export default function ReportsPage() {
  const { role } = useRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEventsAndAttendees();
    fetchUploadedFiles();
  }, []);

  const fetchEventsAndAttendees = async () => {
    setLoadingEvents(true);
    setEventsError(null);
    try {
      const token = role === 'admin' ? localStorage.getItem('adminToken') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch('https://schedulink-backend.onrender.com/api/events?status=approved', {
        headers
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        // Set default event selection to first event
        if (data.length > 0 && selectedEventId === 0) {
          setSelectedEventId(data[0].id);
        }
      } else {
        setEventsError('Failed to load events. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEventsError('Unable to connect to server. Please check your connection.');
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchUploadedFiles = async () => {
    setLoadingFiles(true);
    setFilesError(null);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://schedulink-backend.onrender.com/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data);
        console.log('Fetched uploaded files:', data);
      } else {
        setFilesError('Failed to load uploaded files. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
      setFilesError('Unable to connect to server. Please check your connection.');
    } finally {
      setLoadingFiles(false);
    }
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
        const result = await response.json();
        setSuccessMessage('Report uploaded successfully!');
        setSuccessModalOpen(true);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchUploadedFiles();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Failed to upload report: ${errorData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error uploading report:', error);
      alert('Error uploading report');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://schedulink-backend.onrender.com/api/reports/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccessMessage('Report deleted successfully!');
        setSuccessModalOpen(true);
        fetchUploadedFiles();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Failed to delete report: ${errorData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Error deleting report');
    }
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
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Event Reports
          </h1>
          <p className="text-gray-900 text-lg">View and manage event reports and attendance data</p>
        </div>

        {/* Upload Form for Admin and Student */}
        {(role === 'admin' || role === 'student') && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <i className="ri-upload-cloud-line text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Upload Narrative Report</h2>
                <p className="text-sm text-gray-600">Select an event and upload your PDF report</p>
              </div>
            </div>
            <form onSubmit={handleFileUpload} className="space-y-6">
              <div>
                <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-3">
                  <i className="ri-calendar-event-line mr-2"></i>
                  Select Event
                </label>
                {loadingEvents ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 flex items-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Loading events...
                  </div>
                ) : eventsError ? (
                  <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 text-red-600 flex items-center justify-between">
                    <span className="flex items-center">
                      <i className="ri-error-warning-line mr-2"></i>
                      {eventsError}
                    </span>
                    <button
                      type="button"
                      onClick={fetchEventsAndAttendees}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Retry
                    </button>
                  </div>
                ) : events.length === 0 ? (
                  <div className="w-full px-4 py-3 border border-yellow-300 rounded-lg bg-yellow-50 text-yellow-700">
                    <i className="ri-information-line mr-2"></i>
                    No approved events available. Please create and approve an event first.
                  </div>
                ) : (
                  <select
                    id="event-select"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-gray-50 hover:bg-white transition-colors duration-200"
                    required
                  >
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <i className="ri-file-pdf-line mr-2"></i>
                  Select PDF File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-gray-50 hover:bg-white transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={uploading || loadingEvents || events.length === 0}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="ri-upload-line mr-2"></i>
                    Upload Report
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Uploaded Files - Admin Only */}
        {role === 'admin' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Uploaded Files</h2>
              <button
                onClick={fetchUploadedFiles}
                disabled={loadingFiles}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className={`ri-refresh-line ${loadingFiles ? 'animate-spin' : ''}`}></i>
                <span>Refresh</span>
              </button>
            </div>
            
            {filesError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 flex items-center justify-between">
                <span className="flex items-center">
                  <i className="ri-error-warning-line mr-2"></i>
                  {filesError}
                </span>
                <button
                  onClick={fetchUploadedFiles}
                  className="text-red-700 hover:text-red-900 font-medium"
                >
                  Retry
                </button>
              </div>
            )}
            
            {loadingFiles ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-loader-4-line text-blue-600 text-2xl animate-spin"></i>
                </div>
                <p className="text-gray-600 text-lg">Loading uploaded files...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${file.exists ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <i className={`text-lg ${file.exists ? 'ri-file-pdf-line text-blue-600' : 'ri-file-forbid-line text-gray-400'}`}></i>
                        </div>
                        <div>
                          <h3 className={`font-semibold text-lg ${file.exists ? 'text-gray-900' : 'text-gray-500'}`}>{file.fileName}</h3>
                          <p className="text-sm text-gray-500">PDF File</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600"><span className="font-medium">Event:</span> {file.eventName}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Uploaded by:</span> {file.uploadedBy}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Date:</span> {new Date(file.uploadedAt).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Size:</span> {(file.fileSize / 1024).toFixed(2)} KB</p>
                        {!file.exists && <p className="text-sm text-red-500 flex items-center"><i className="ri-error-warning-line mr-1"></i>File not found on server</p>}
                      </div>
                      {file.exists && (
                        <div className="flex space-x-2">
                          <a
                            href={`https://schedulink-backend.onrender.com/api/reports/file/${file.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg text-sm"
                          >
                            <i className="ri-eye-line mr-1"></i>
                            View
                          </a>
                          <a
                            href={`https://schedulink-backend.onrender.com/api/reports/file/${file.id}`}
                            download={file.fileName}
                            className="inline-flex items-center justify-center flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg text-sm"
                          >
                            <i className="ri-download-line mr-1"></i>
                            Download
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="inline-flex items-center justify-center flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg text-sm"
                          >
                            <i className="ri-delete-bin-line mr-1"></i>
                            Delete
                          </button>
                        </div>
                      )}
                      {!file.exists && (
                        <div className="inline-flex items-center justify-center w-full bg-gray-300 text-gray-500 px-4 py-3 rounded-lg font-medium cursor-not-allowed">
                          <i className="ri-file-forbid-line mr-2"></i>
                          File Unavailable
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {uploadedFiles.length === 0 && !filesError && (
                  <div className="col-span-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-folder-open-line text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-500 text-lg mb-2">No files uploaded yet.</p>
                    <p className="text-gray-400 text-sm">Upload a report using the form above to get started.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Event Attendance Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Approved Events</h2>
            <button
              onClick={fetchEventsAndAttendees}
              disabled={loadingEvents}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i className={`ri-refresh-line ${loadingEvents ? 'animate-spin' : ''}`}></i>
              <span>Refresh</span>
            </button>
          </div>
          
          {eventsError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 flex items-center justify-between">
              <span className="flex items-center">
                <i className="ri-error-warning-line mr-2"></i>
                {eventsError}
              </span>
              <button
                onClick={fetchEventsAndAttendees}
                className="text-red-700 hover:text-red-900 font-medium"
              >
                Retry
              </button>
            </div>
          )}
          
          {loadingEvents ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-loader-4-line text-green-600 text-2xl animate-spin"></i>
              </div>
              <p className="text-gray-600 text-lg">Loading approved events...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-calendar-check-line text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                      <p className="text-sm text-gray-500">Approved Event</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center">
                      <i className="ri-calendar-line mr-2"></i>
                      <span className="font-medium">Date:</span> {new Date(event.start_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {events.length === 0 && !eventsError && (
                <div className="col-span-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-calendar-event-line text-gray-400 text-2xl"></i>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">No approved events available.</p>
                  <p className="text-gray-400 text-sm">Events need to be created and approved before they appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

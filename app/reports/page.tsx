
'use client';

import { useEffect, useState } from 'react';
import { useRole } from '../../components/RoleContext';
import Sidebar from '../../components/Sidebar';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  status: string;
  attendees: number;
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

export default function ReportsPage() {
  const { role } = useRole();
  const [events, setEvents] = useState<Event[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchReports();
    fetchEventsAndAttendees();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('https://angelu-backend.onrender.com/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchEventsAndAttendees = async () => {
    try {
      // Fetch approved events
      const eventsResponse = await fetch('https://angelu-backend.onrender.com/api/events?status=approved');
      const approvedEvents = await eventsResponse.json();

      // Set attendee count to 0 for all events
      const eventsWithAttendees = approvedEvents.map((event: any) => ({
        ...event,
        attendees: 0
      }));

      setEvents(eventsWithAttendees);
      if (eventsWithAttendees.length > 0) {
        setSelectedEventId(eventsWithAttendees[0].id);
      }
    } catch (error) {
      console.error('Error fetching events and attendees:', error);
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
      const response = await fetch('https://angelu-backend.onrender.com/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Report uploaded successfully!');
        setSelectedFile(null);
        fetchReports();
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Narrative Report</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Event
                </label>
                <select
                  id="event-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 "
              >
                {uploading ? 'Uploading...' : 'Upload Report'}
              </button>
            </form>
          </div>
        )}

        {/* Uploaded Reports */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Narrative Reports</h2>
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-black">{report.eventName}</h3>
                    <p className="text-sm text-gray-500">Uploaded by: {report.uploadedBy}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(report.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <a
                    href={`https://angelu-backend.onrender.com/${report.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    View PDF
                  </a>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <p className="text-gray-500">No reports uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Event Attendance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-black mb-2">{event.name}</h3>
              <p className="text-sm text-gray-500 mb-4">Date: {new Date(event.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

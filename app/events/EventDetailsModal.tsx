'use client';

import { useEffect } from 'react';

interface EventDetailsModalProps {
  event: {
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
  };
  onClose: () => void;
}

export default function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString(); // Readable format
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{event.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[60px]">{event.description || 'No description'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formatDate(event.start_date)}</p>
          </div>
          {event.end_date && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formatDate(event.end_date)}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg capitalize">{event.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {event.gymnasium && event.sports_area ? 'Gymnasium and Sports Area' :
               event.gymnasium ? 'Gymnasium' :
               event.sports_area ? 'Sports and Recreational Area' : 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{event.application_date ? new Date(event.application_date).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rental Date</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{event.rental_date ? new Date(event.rental_date).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application on behalf of</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{event.behalf_of || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{event.contact_info || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Event</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[60px]">{event.nature_of_event || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formatDate(event.created_at)}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

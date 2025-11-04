'use client';

import { useState } from 'react';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import EditEventModal from './EditEventModal';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

function Notification({ message, type, onClose }: NotificationProps) {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 animate-fade-in`}>
      <i className={`ri-${type === 'success' ? 'check' : type === 'error' ? 'error-warning' : 'information'}-line text-xl`}></i>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="hover:bg-black/20 rounded-full p-1 transition-colors">
        <i className="ri-close-line"></i>
      </button>
    </div>
  );
}

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

interface EventCardProps {
  event: Event;
  onDelete: (id: number) => void;
  onEdit: (id: number, updatedEvent: { name: string; description: string; start_date: string; end_date?: string; venues: number[]; equipment: {id: number, quantity: number}[]; application_date: string; rental_date: string; behalf_of: string; contact_info: string; nature_of_event: string; requires_equipment?: boolean; chairs_qty?: number; tables_qty?: number; projector?: boolean; other_equipment?: string; setup_start_time?: string; setup_end_time?: string; setup_hours?: number; event_start_time?: string; event_end_time?: string; event_hours?: number; cleanup_start_time?: string; cleanup_end_time?: string; cleanup_hours?: number; total_hours?: number; multi_day_schedule?: string | File }) => void;
}

export default function EventCard({ event, onDelete, onEdit }: EventCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateRange = (startDateString: string, endDateString?: string) => {
    const startDate = new Date(startDateString);
    const startFormatted = startDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (endDateString && endDateString !== startDateString) {
      const endDate = new Date(endDateString);
      const endFormatted = endDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return `${startFormatted} - ${endFormatted}`;
    }

    return startFormatted;
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(event.id);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
          {event.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <div className="w-4 h-4 flex items-center justify-center mr-2">
            <i className="ri-calendar-line"></i>
          </div>
          <span>{formatDateRange(event.start_date, event.end_date)}</span>
        </div>

        {event.description && (
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-4 h-4 flex items-center justify-center mr-2">
              <i className="ri-file-text-line"></i>
            </div>
            <span>{event.description}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <div className="w-4 h-4 flex items-center justify-center mr-2">
            <i className="ri-time-line"></i>
          </div>
          <span>Created: {new Date(event.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => setShowEditModal(true)}
          className="flex-1 bg-gray-100 text-black px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
        >
          Edit
        </button>
        <button
          onClick={handleDeleteClick}
          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
        >
          Delete
        </button>
      </div>

      {showEditModal && (
        <EditEventModal
          event={event}
          onClose={() => setShowEditModal(false)}
          onSave={(id: number, updatedEvent: { name: string; description: string; start_date: string; end_date?: string; venues: number[]; equipment: {id: number, quantity: number}[]; application_date: string; rental_date: string; behalf_of: string; contact_info: string; nature_of_event: string; requires_equipment?: boolean; chairs_qty?: number; tables_qty?: number; projector?: boolean; other_equipment?: string; setup_start_time?: string; setup_end_time?: string; setup_hours?: number; event_start_time?: string; event_end_time?: string; event_hours?: number; cleanup_start_time?: string; cleanup_end_time?: string; cleanup_hours?: number; total_hours?: number; multi_day_schedule?: string }) => {
            onEdit(id, updatedEvent);
            setShowEditModal(false);
            setNotification({ message: 'Event updated successfully!', type: 'success' });
            setTimeout(() => setNotification(null), 3000);
          }}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        message={`Are you sure you want to delete the event "${event.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}

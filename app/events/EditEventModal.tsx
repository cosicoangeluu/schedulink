'use client';

import { useState } from 'react';

interface EditEventModalProps {
  event: {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date?: string;
  };
  onClose: () => void;
  onSave: (id: number, updatedEvent: { name: string; description: string; start_date: string; end_date?: string }) => void;
}

export default function EditEventModal({ event, onClose, onSave }: EditEventModalProps) {
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  };

  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description || '');
  const [startDate, setStartDate] = useState(formatDateForInput(event.start_date));
  const [endDate, setEndDate] = useState(formatDateForInput(event.end_date || ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatDateForSubmit = (dateString: string) => {
      if (!dateString) return '';
      return dateString.replace('T', ' ') + ':00'; // YYYY-MM-DD HH:MM:00
    };
    const updatedEvent = {
      name,
      description,
      start_date: formatDateForSubmit(startDate),
      ...(endDate && { end_date: formatDateForSubmit(endDate) })
    };
    onSave(event.id, updatedEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              step="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Select date and time (hours and minutes)</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              step="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for single-day events</p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

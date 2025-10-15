'use client';

import { useState } from 'react';

interface EditEventModalProps {
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
  };
  onClose: () => void;
  onSave: (id: number, updatedEvent: { name: string; description: string; start_date: string; end_date?: string; gymnasium: boolean; sports_area: boolean; application_date: string; rental_date: string; behalf_of: string; contact_info: string; nature_of_event: string }) => void;
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
  const [gymnasium, setGymnasium] = useState(event.gymnasium || false);
  const [sportsArea, setSportsArea] = useState(event.sports_area || false);
  const [applicationDate, setApplicationDate] = useState(event.application_date || '');
  const [rentalDate, setRentalDate] = useState(event.rental_date || '');
  const [behalfOf, setBehalfOf] = useState(event.behalf_of || '');
  const [contactInfo, setContactInfo] = useState(event.contact_info || '');
  const [natureOfEvent, setNatureOfEvent] = useState(event.nature_of_event || '');

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
      ...(endDate && { end_date: formatDateForSubmit(endDate) }),
      gymnasium,
      sports_area: sportsArea,
      application_date: applicationDate,
      rental_date: rentalDate,
      behalf_of: behalfOf,
      contact_info: contactInfo,
      nature_of_event: natureOfEvent
    };
    onSave(event.id, updatedEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={gymnasium}
                  onChange={(e) => setGymnasium(e.target.checked)}
                  className="mr-2"
                />
                Gymnasium
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sportsArea}
                  onChange={(e) => setSportsArea(e.target.checked)}
                  className="mr-2"
                />
                Sports and Recreational Area
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Date
            </label>
            <input
              type="date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rental Date
            </label>
            <input
              type="date"
              value={rentalDate}
              onChange={(e) => setRentalDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application on behalf of
            </label>
            <input
              type="text"
              value={behalfOf}
              onChange={(e) => setBehalfOf(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              placeholder="e.g., Business, Individual, Organization"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact information #
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              placeholder="Enter contact number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nature of Event
            </label>
            <textarea
              value={natureOfEvent}
              onChange={(e) => setNatureOfEvent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              placeholder="Kindly specify: i.e., Youth basketball game, karate tournament, meeting, seminar, etc."
              rows={2}
            />
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


'use client';

import { useState } from 'react';

interface AddEventModalProps {
  onClose: () => void;
  onAdd: (event: { name: string; description: string; start_date: string; end_date?: string; gymnasium: boolean; sports_area: boolean; application_date: string; rental_date: string; behalf_of: string; contact_info: string; nature_of_event: string }) => void;
}

export default function AddEventModal({ onClose, onAdd }: AddEventModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    gymnasium: false,
    sports_area: false,
    application_date: '',
    rental_date: '',
    behalf_of: '',
    contact_info: '',
    nature_of_event: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.start_date) {
      const eventData = {
        name: formData.name,
        description: formData.description,
        start_date: formData.start_date,
        ...(formData.end_date && { end_date: formData.end_date }),
        gymnasium: formData.gymnasium,
        sports_area: formData.sports_area,
        application_date: formData.application_date,
        rental_date: formData.rental_date,
        behalf_of: formData.behalf_of,
        contact_info: formData.contact_info,
        nature_of_event: formData.nature_of_event
      };
      onAdd(eventData);
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        gymnasium: false,
        sports_area: false,
        application_date: '',
        rental_date: '',
        behalf_of: '',
        contact_info: '',
        nature_of_event: ''
      });
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-close-line text-xl"></i>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black"
                placeholder="Enter event name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black"
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                step="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Select date and time (hours and minutes)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                step="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for single-day events</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <div className="space-y-2">
                <label className="flex items-center text-black">
                  <input
                    type="checkbox"
                    name="gymnasium"
                    checked={formData.gymnasium}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Gymnasium
                </label>
                <label className="flex items-center text-black">
                  <input
                    type="checkbox"
                    name="sports_area"
                    checked={formData.sports_area}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Sports and Recreational Area
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Date
              </label>
              <input
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rental Date
              </label>
              <input
                type="date"
                name="rental_date"
                value={formData.rental_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application on behalf of
              </label>
              <input
                type="text"
                name="behalf_of"
                value={formData.behalf_of}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black"
                placeholder="e.g., Business, Individual, Organization"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact information #
              </label>
              <input
                type="text"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nature of Event
              </label>
              <textarea
                name="nature_of_event"
                value={formData.nature_of_event}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-black"
                placeholder="Kindly specify: i.e., Youth basketball game, karate tournament, meeting, seminar, etc."
                rows={2}
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

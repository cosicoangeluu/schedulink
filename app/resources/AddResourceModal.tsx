  'use client';

import { useState } from 'react';

interface AddResourceModalProps {
  onClose: () => void;
  onAdd: (resource: any) => void;
  type: 'Resource' | 'Venue';
}

export default function AddResourceModal({ onClose, onAdd, type }: AddResourceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    total: '',
    location: '',
    availability: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'Venue') {
      if (formData.name && formData.description) {
        onAdd({
          name: formData.name,
          description: formData.description,
          category: 'Venue',
          availability: true
        });
      }
    } else {
      if (formData.name && formData.total && formData.location) {
        const total = parseInt(formData.total);
        const available = formData.availability ? total : 0;
        onAdd({
          name: formData.name,
          description: formData.description,
          total,
          available,
          location: formData.location,
          status: 'available',
          condition: 'good',
          category: 'Equipment'
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add New Resource</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-close-line"></i>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">{type === 'Venue' ? 'Venue Name' : 'Resource Name'}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black"
              rows={3}
              required={type === 'Venue'}
            />
          </div>

          {type === 'Resource' && (
            <>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Total Quantity</label>
                <input
                  type="number"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Availability</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              Add Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

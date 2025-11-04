'use client';

import React, { useEffect, useState } from 'react';

interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  availability: boolean;
  created_at: string;
  type: 'equipment' | 'venue';
  total?: number;
  available?: number;
  location?: string;
  status?: string;
  condition?: string;
}

interface EditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (resource: Resource) => void;
  resource: Resource | null;
}

export default function EditResourceModal({ isOpen, onClose, onEdit, resource }: EditResourceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    total: '',
    location: '',
    status: 'available',
    condition: 'good',
    availability: true
  });

  useEffect(() => {
    if (resource) {
      if (resource.type === 'equipment') {
        setFormData({
          name: resource.name,
          description: resource.description || '',
          total: resource.total?.toString() || '',
          location: resource.location || '',
          status: resource.status || 'available',
          condition: resource.condition || 'good',
          availability: resource.availability ?? true
        });
      } else {
        setFormData({
          name: resource.name,
          description: resource.description || '',
          total: '',
          location: '',
          status: 'available',
          condition: 'good',
          availability: resource.availability ?? true
        });
      }
    }
  }, [resource]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resource) return;

      if (resource.type === 'venue') {
        if (formData.name && formData.description) {
          onEdit({
            ...resource,
            name: formData.name,
            description: formData.description,
            category: 'Venue',
            availability: formData.availability
          });
        }
      } else {
        if (formData.name && formData.total && formData.location) {
          const total = parseInt(formData.total);
          const available = formData.availability ? total : 0;
          onEdit({
            ...resource,
            name: formData.name,
            description: formData.description,
            total,
            available,
            location: formData.location,
            status: formData.status,
            condition: formData.condition,
            availability: formData.availability,
            category: 'Equipment'
          });
        }
      }
  };

  if (!isOpen || !resource) return null;

  const isVenue = resource.type === 'venue';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit {isVenue ? 'Venue' : 'Resource'}</h2>
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
            <label className="block text-sm font-medium text-black mb-1">{isVenue ? 'Venue Name' : 'Resource Name'}</label>
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
              required={isVenue}
            />
          </div>

          {!isVenue && (
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

              <div>
                <label className="block text-sm font-medium text-black mb-1">Condition</label>
                <div className="relative">
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white text-black"
                  >
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-arrow-down-s-line text-gray-400"></i>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {isVenue && (
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
              Update {isVenue ? 'Venue' : 'Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

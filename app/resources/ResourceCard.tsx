'use client';

import { useState } from 'react';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  availability: boolean;
  created_at: string;
}

interface ResourceCardProps {
  resource: Resource;
  onDelete: (id: number) => void;
}

export default function ResourceCard({ resource, onDelete }: ResourceCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getAvailabilityColor = (availability: boolean) => {
    return availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sports':
        return 'ri-basketball-line';
      case 'Events':
        return 'ri-calendar-event-line';
      case 'Education':
        return 'ri-book-line';
      case 'Recreation':
        return 'ri-gamepad-line';
      default:
        return 'ri-archive-line';
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(resource.id);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
            <i className={`${getCategoryIcon(resource.category)} text-gray-600`}></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{resource.name}</h3>
            <p className="text-sm text-gray-600">{resource.category}</p>
          </div>
        </div>

        <div className="flex space-x-1">
          <button title="Edit" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-edit-line"></i>
            </div>
          </button>
          <button
            title="Delete"
            onClick={handleDeleteClick}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-delete-bin-line"></i>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Availability</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(resource.availability)}`}>
            {resource.availability ? 'Available' : 'Unavailable'}
          </span>
        </div>

        {resource.description && (
          <div>
            <span className="text-sm text-gray-600">Description</span>
            <p className="text-sm text-gray-900 mt-1">{resource.description}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Created</span>
          <span className="text-sm font-medium text-gray-900">{new Date(resource.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        message={`Are you sure you want to delete the resource "${resource.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

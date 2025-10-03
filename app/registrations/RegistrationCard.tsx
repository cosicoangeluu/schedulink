
'use client';

import { useState } from 'react';

interface Registration {
  id: number;
  fullName: string;
  studentId: string;
  course: string;
  eventName: string;
  registrationDate: string;
  email?: string;
  phone?: string;
  status: string;
}

interface RegistrationCardProps {
  registration: Registration;
  onDelete: (id: number, name: string) => void;
  onEdit: (id: number, updatedRegistration: Partial<Registration>) => void;
}

export default function RegistrationCard({ registration, onDelete, onEdit }: RegistrationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(registration.fullName);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleSaveEdit = () => {
    onEdit(registration.id, { fullName: editName });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(registration.fullName);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-lg font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-red-500"
                autoFocus
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900">{registration.fullName}</h3>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-2">
                <i className="ri-user-line"></i>
              </div>
              <span>ID: {registration.studentId}</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-2">
                <i className="ri-book-line"></i>
              </div>
              <span>{registration.course}</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-2">
                <i className="ri-calendar-event-line"></i>
              </div>
              <span>{registration.eventName}</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-2">
                <i className="ri-calendar-line"></i>
              </div>
              <span>{formatDate(registration.registrationDate)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end">
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSaveEdit}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Save
              </button>
              <button 
                onClick={handleCancelEdit}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Edit
              </button>
              
              <button 
                onClick={() => onDelete(registration.id, registration.fullName)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

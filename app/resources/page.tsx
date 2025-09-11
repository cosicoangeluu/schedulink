'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AddResourceModal from './AddResourceModal';
import ResourceCard from './ResourceCard';

interface Resource {
  id: number;
  name: string;
  total: number;
  available: number;
  inUse: number;
  status: string;
  location: string;
  condition: string;
}

const facilities = [
  { id: 1, name: 'Gymnasium', color: 'bg-blue-500' },
  { id: 2, name: 'Function Hall', color: 'bg-green-500' },
  { id: 3, name: 'Recreational Hall', color: 'bg-purple-500' },
  { id: 4, name: 'EMRC', color: 'bg-orange-500' }
];

const statuses = ['available', 'maintenance', 'out-of-stock'];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, selectedStatus]);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];
    if (selectedStatus) {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }
    setFilteredResources(filtered);
  };

  const handleAddResource = async (newResource) => {
    try {
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource),
      });
      if (!response.ok) {
        throw new Error('Failed to add resource');
      }
      const result = await response.json();
      setResources(prev => [...prev, { ...newResource, id: result.id }]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resources/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Resources</h1>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm appearance-none bg-white"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-down-s-line text-gray-400"></i>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
          >
            Add Resource
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDelete={handleDeleteResource}
            />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <i className="ri-archive-line text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search filters or add a new resource.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddResourceModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddResource}
        />
      )}
    </div>
  );
}

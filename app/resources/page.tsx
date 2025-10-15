'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ResourceCard from './ResourceCard';

interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  availability: boolean;
  created_at: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('https://schedulink-backend.onrender.com/api/resources');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id: number) => {
    try {
      const response = await fetch(`https://schedulink-backend.onrender.com/api/resources/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete resource' }));
        throw new Error(errorData.error || 'Failed to delete resource');
      }
      setResources(prev => prev.filter(r => r.id !== id));
      alert('Resource deleted successfully!');
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete resource. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-red-600 text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Toggle menu"
        >
          <i className="ri-menu-line text-xl"></i>
        </button>
      </div>

      <div className="flex-1 p-4 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Resource Management
          </h1>
          <p className="text-gray-900 text-lg">Manage and oversee all available resources</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDelete={handleDeleteResource}
            />
          ))}
        </div>

        {resources.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <i className="ri-folder-line text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Resources will appear here once added.</p>
          </div>
        )}
      </div>
    </div>
  );
}

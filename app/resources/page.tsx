'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import SuccessNotificationModal from '../../components/SuccessNotificationModal';
import AddResourceModal from './AddResourceModal';
import EditResourceModal from './EditResourceModal';
import EventCard from './EventCard';
import ResourceCard from './ResourceCard';

interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  availability: boolean;
  created_at: string;
  type: 'equipment' | 'venue';
}

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string | null;
  venues: any[];
  equipment: any[];
  status: string;
  created_at: string;
}

export default function ResourcesPage() {
  const [equipment, setEquipment] = useState<Resource[]>([]);
  const [venues, setVenues] = useState<Resource[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'equipment' | 'venues' | 'events'>('equipment');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const [resourcesRes, venuesRes, eventsRes] = await Promise.all([
        fetch('https://schedulink-backend.onrender.com/api/resources', { headers }),
        fetch('https://schedulink-backend.onrender.com/api/venues', { headers }),
        fetch('https://schedulink-backend.onrender.com/api/events', { headers })
      ]);

      if (!resourcesRes.ok || !venuesRes.ok || !eventsRes.ok) {
        throw new Error('Failed to fetch resources');
      }

      const [resourcesData, venuesData, eventsData] = await Promise.all([
        resourcesRes.json(),
        venuesRes.json(),
        eventsRes.json()
      ]);

      // Add type to each item
      const equipmentData = resourcesData.map((item: any) => ({ ...item, type: 'equipment' as const, availability: item.available > 0 }));
      const venuesDataTyped = venuesData.map((item: any) => ({ ...item, type: 'venue' as const }));

      setEquipment(equipmentData);
      setVenues(venuesDataTyped);
      setEvents((eventsData as Event[]).filter(event => event.status === 'approved'));
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id: number, type: 'equipment' | 'venue') => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = type === 'equipment' ? 'resources' : 'venues';
      const response = await fetch(`https://schedulink-backend.onrender.com/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete resource' }));
        throw new Error(errorData.error || 'Failed to delete resource');
      }
      if (type === 'equipment') {
        setEquipment(prev => prev.filter(r => r.id !== id));
      } else {
        setVenues(prev => prev.filter(r => r.id !== id));
      }
      setSuccessMessage('Resource deleted successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete resource. Please try again.');
    }
  };

  const handleAddResource = async (resourceData: any) => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = resourceData.category === 'Venue' ? 'venues' : 'resources';
      const response = await fetch(`https://schedulink-backend.onrender.com/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });
      if (!response.ok) {
        throw new Error('Failed to add resource');
      }
      const newResource = await response.json();
      const type = resourceData.category === 'Venue' ? 'venue' : 'equipment';
      const newItem = { ...newResource, type };
      if (type === 'equipment') {
        setEquipment(prev => [...prev, newItem]);
      } else {
        setVenues(prev => [...prev, newItem]);
      }
      setSuccessMessage('Resource added successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error adding resource:', error);
      alert(error instanceof Error ? error.message : 'Failed to add resource. Please try again.');
    }
  };

  const handleEditResource = async (resourceData: Resource) => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = resourceData.type === 'venue' ? 'venues' : 'resources';
      const response = await fetch(`https://schedulink-backend.onrender.com/api/${endpoint}/${resourceData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });
      if (!response.ok) {
        throw new Error('Failed to update resource');
      }
      const updatedResource = await response.json();
      // Preserve created_at from original resource and calculate availability properly
      const updatedItem = {
        ...updatedResource,
        type: resourceData.type,
        created_at: updatedResource.created_at || resourceData.created_at,
        availability: resourceData.type === 'equipment' ? (updatedResource.available > 0) : updatedResource.availability
      };
      if (resourceData.type === 'equipment') {
        setEquipment(prev => prev.map(r => r.id === resourceData.id ? updatedItem : r));
      } else {
        setVenues(prev => prev.map(r => r.id === resourceData.id ? updatedItem : r));
      }
      setShowEditModal(false);
      setSelectedResource(null);
      setSuccessMessage('Resource updated successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating resource:', error);
      alert(error instanceof Error ? error.message : 'Failed to update resource. Please try again.');
    }
  };

  const handleEditClick = (resource: Resource) => {
    setSelectedResource(resource);
    setShowEditModal(true);
  };

  const currentItems = activeTab === 'equipment' ? equipment : activeTab === 'venues' ? venues : events;
  const modalType = activeTab === 'equipment' ? 'Resource' : 'Venue';

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
          <p className="text-gray-900 text-lg">Manage and oversee all available resources and venues</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('equipment')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'equipment'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Equipment
              </button>
              <button
                onClick={() => setActiveTab('venues')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'venues'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Venues
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Events
              </button>
            </nav>
          </div>
        </div>

        {activeTab !== 'events' && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
            >
              <i className="ri-add-line mr-2"></i>Add {activeTab === 'equipment' ? 'Equipment' : 'Venue'}
            </button>
          </div>
        )}

        <div key={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'events' ? (
            currentItems.map((event, index) => (
              <div
                key={event.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <EventCard
                  event={event as Event}
                />
              </div>
            ))
          ) : (
            currentItems.map((resource, index) => (
              <div
                key={resource.id}
                className="opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <ResourceCard
                  resource={resource as Resource}
                  onDelete={(id) => handleDeleteResource(id, (resource as Resource).type)}
                  onEdit={handleEditClick}
                />
              </div>
            ))
          )}
        </div>

        {currentItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 text-gray-400">
              <i className="ri-folder-line text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
            <p className="text-gray-600">
              {activeTab === 'equipment' ? 'Equipment' : activeTab === 'venues' ? 'Venues' : 'Events'} will appear here once added.
            </p>
          </div>
        )}

        {showAddModal && (
          <AddResourceModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddResource}
            type={modalType}
          />
        )}

        {showEditModal && (
          <EditResourceModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedResource(null);
            }}
            onEdit={handleEditResource}
            resource={selectedResource}
          />
        )}

        {showSuccessModal && (
          <SuccessNotificationModal
            isOpen={showSuccessModal}
            message={successMessage}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </div>
    </div>
  );
}

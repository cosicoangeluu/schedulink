'use client';

import { useEffect, useState } from 'react';

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

interface EquipmentDetail {
  id: number;
  name: string;
  quantity: number;
}

interface VenueDetail {
  id: number;
  name: string;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentDetail[]>([]);
  const [venueDetails, setVenueDetails] = useState<VenueDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showDetails && (event.equipment.length > 0 || event.venues.length > 0)) {
      setLoading(true);
      const fetchDetails = async () => {
        try {
          // Fetch equipment details
          if (event.equipment.length > 0) {
            // No token needed for public resource details
            const equipmentIds = event.equipment.map((eq: any) => eq.id);
            const equipmentPromises = equipmentIds.map((id: number) =>
              fetch(`https://schedulink-backend.onrender.com/api/resources/${id}`, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(res => res.json())
                .then(data => ({
                  id: data.id,
                  name: data.name,
                  quantity: event.equipment.find((eq: any) => eq.id === id)?.quantity || 0
                }))
            );
            const equipmentResults = await Promise.all(equipmentPromises);
            setEquipmentDetails(equipmentResults);
          } else {
            setEquipmentDetails([]);
          }

          // Fetch venue details
          if (event.venues.length > 0) {
            // No token needed for public venue details
            const venuePromises = event.venues.map((venueId: number) =>
              fetch(`https://schedulink-backend.onrender.com/api/venues/${venueId}`, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(res => res.json())
                .then(data => ({
                  id: data.id,
                  name: data.name
                }))
            );
            const venueResults = await Promise.all(venuePromises);
            setVenueDetails(venueResults);
          } else {
            setVenueDetails([]);
          }
        } catch (error) {
          console.error('Error fetching details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [showDetails, event.equipment, event.venues]);



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
            <i className="ri-calendar-event-line text-blue-600"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{event.name}</h3>
            <p className="text-sm text-gray-600">{new Date(event.start_date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={`ri-${showDetails ? 'eye-off' : 'eye'}-line`}></i>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        {event.description && (
          <div>
            <span className="text-sm text-gray-600">Description</span>
            <p className="text-sm text-gray-900 mt-1">{event.description}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Created</span>
          <span className="text-sm font-medium text-gray-900">{new Date(event.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500 mt-2">Loading details...</p>
              </div>
            ) : (
              <>
                {venueDetails.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Venues Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {venueDetails.map((venue) => (
                        <span key={venue.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {venue.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {equipmentDetails.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Equipment Used:</h4>
                    <div className="flex flex-wrap gap-2">
                      {equipmentDetails.map((equip) => (
                        <span key={equip.id} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {equip.name} <span className="text-black">(Qty: {equip.quantity})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {venueDetails.length === 0 && equipmentDetails.length === 0 && (
                  <p className="text-sm text-gray-500">No venues or equipment assigned to this event.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

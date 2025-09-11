
'use client';

interface Event {
  id: number;
  name: string;
  date: string;
  venue: string;
  status: string;
  attendees: number;
  addedBy: string;
}

interface EventCardProps {
  event: Event;
  onDelete: (id: number) => void;
}

export default function EventCard({ event, onDelete }: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
          {event.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <div className="w-4 h-4 flex items-center justify-center mr-2">
            <i className="ri-calendar-line"></i>
          </div>
          <span>{formatDate(event.date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <div className="w-4 h-4 flex items-center justify-center mr-2">
            <i className="ri-map-pin-line"></i>
          </div>
          <span>{event.venue}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <div className="w-4 h-4 flex items-center justify-center mr-2">
            <i className="ri-user-line"></i>
          </div>
          <span>{event.attendees} attendees</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <div className="w-4 h-4 flex items-center justify-center mr-2">
            <i className="ri-user-add-line"></i>
          </div>
          <span>Added by: {event.addedBy}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap">
          Edit
        </button>
        <button 
          onClick={() => onDelete(event.id)}
          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

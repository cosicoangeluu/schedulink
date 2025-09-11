'use client';

interface Resource {
  id: number;
  name: string;
  category: string;
  total: number;
  available: number;
  inUse: number;
  status: string;
  location: string;
  condition: string;
}

interface ResourceCardProps {
  resource: Resource;
  onDelete: (id: number) => void;
}

export default function ResourceCard({ resource, onDelete }: ResourceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Chairs':
        return 'ri-armchair-line';
      case 'Electric Fans':
        return 'ri-hurricane-line';
      default:
        return 'ri-archive-line';
    }
  };

  const utilizationRate = Math.round((resource.inUse / resource.total) * 100);

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
          <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-edit-line"></i>
            </div>
          </button>
          <button 
            onClick={() => onDelete(resource.id)}
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
          <span className="text-sm text-gray-600">Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
            {resource.status.charAt(0).toUpperCase() + resource.status.slice(1).replace('-', ' ')}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Location</span>
          <span className="text-sm font-medium text-gray-900">{resource.location}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Condition</span>
          <span className={`text-sm font-medium ${getConditionColor(resource.condition)}`}>
            {resource.condition.charAt(0).toUpperCase() + resource.condition.slice(1)}
          </span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Availability</span>
            <span className="text-sm font-medium text-gray-900">{resource.available}/{resource.total}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(resource.available / resource.total) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>In Use: {resource.inUse}</span>
            <span>Utilization: {utilizationRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
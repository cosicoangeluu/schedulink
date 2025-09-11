'use client';

interface NotificationCardProps {
  notification: {
    id: number;
    eventName: string;
    status: string;
    studentName: string;
    course: string;
    studentId: string;
    submittedDate: string;
  };
  onApprove: (id: number) => void;
  onDecline: (id: number) => void;
}

export default function NotificationCard({ notification, onApprove, onDecline }: NotificationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Declined':
        return 'bg-red-100 text-red-800';
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{notification.eventName}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(notification.status)}`}>
              {notification.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-2">
                <i className="ri-user-line"></i>
              </div>
              <span>{notification.studentName} (ID: {notification.studentId})</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-2">
                <i className="ri-book-line"></i>
              </div>
              <span>{notification.course}</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-4 h-4 flex items-center justify-center mr-2">
                <i className="ri-calendar-line"></i>
              </div>
              <span>Submitted: {formatDate(notification.submittedDate)}</span>
            </div>
          </div>
        </div>
        
        {notification.status === 'Pending' && (
          <div className="flex space-x-2 ml-4">
            <button 
              onClick={() => onApprove(notification.id)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
            >
              Approve
            </button>
            
            <button 
              onClick={() => onDecline(notification.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer whitespace-nowrap"
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
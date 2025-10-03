'use client';

interface NotificationCardProps {
  notification: {
    id: number;
    type: string;
    message: string;
    eventId?: number;
    resourceId?: number;
    bookingId?: number;
    registrationId?: number;
    status: string;
    eventName?: string;
    resourceName?: string;
    registrationStatus?: string;
    created_at: string;
  };
  onApprove: (notificationId: number) => void;
  onDecline: (notificationId: number) => void;
}

export default function NotificationCard({ notification, onApprove, onDecline }: NotificationCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row justify-between items-center">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{notification.message}</p>
        {notification.eventName && <p className="text-sm text-gray-600">Event: {notification.eventName}</p>}
        {notification.resourceName && <p className="text-sm text-gray-600">Resource: {notification.resourceName}</p>}
        <p className="text-xs text-gray-400">Created: {new Date(notification.created_at).toLocaleString()}</p>
      </div>
      {notification.status === 'pending' && (
        <div className="mt-4 md:mt-0 md:ml-4 flex space-x-2">
          <button
            onClick={() => onApprove(notification.id)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => onDecline(notification.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Decline
          </button>
        </div>
      )}
      {notification.status !== 'pending' && (
        <div className="mt-4 md:mt-0 md:ml-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              notification.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
}

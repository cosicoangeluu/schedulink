'use client';

interface ApprovalNotificationModalProps {
  isOpen: boolean;
  action: 'approved' | 'declined';
  eventName: string;
  onClose: () => void;
}

export default function ApprovalNotificationModal({
  isOpen,
  action,
  eventName,
  onClose,
}: ApprovalNotificationModalProps) {
  if (!isOpen) return null;

  const isApproved = action === 'approved';
  const title = isApproved ? 'Event Approved!' : 'Event Declined';
  const message = `The event "${eventName}" has been ${action}.`;
  const iconColor = isApproved ? 'text-green-500' : 'text-red-500';
  const bgColor = isApproved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 border-2 ${bgColor}`}>
        <div className="text-center">
          <div className={`w-16 h-16 ${iconColor} mx-auto mb-4`}>
            <i className={`text-6xl ${isApproved ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'}`}></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-700 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              isApproved ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

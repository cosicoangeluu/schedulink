'use client';

interface ApprovalConfirmationModalProps {
  isOpen: boolean;
  action: 'approve' | 'decline';
  eventName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ApprovalConfirmationModal({
  isOpen,
  action,
  eventName,
  onConfirm,
  onCancel,
}: ApprovalConfirmationModalProps) {
  if (!isOpen) return null;

  const isApprove = action === 'approve';
  const title = isApprove ? 'Confirm Approval' : 'Confirm Decline';
  const message = `Are you sure you want to ${action} the event "${eventName}"?`;
  const confirmText = isApprove ? 'Approve' : 'Decline';
  const confirmColor = isApprove ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex space-x-4 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

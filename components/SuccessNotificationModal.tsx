'use client';

interface SuccessNotificationModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessNotificationModal({
  isOpen,
  message,
  onClose,
}: SuccessNotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <i className="ri-check-line text-green-600 text-2xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Success!</h2>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

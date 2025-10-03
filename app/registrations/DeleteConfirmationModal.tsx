'use client';

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  registrationName: string;
}

export default function DeleteConfirmationModal({ onConfirm, onCancel, registrationName }: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mr-4">
              <div className="w-6 h-6 flex items-center justify-center text-red-600">
                <i className="ri-delete-bin-line text-xl"></i>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Delete Registration</h2>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the registration for <strong>{registrationName}</strong>? This action cannot be undone.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

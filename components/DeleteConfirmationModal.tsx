'use client';

import { useEffect } from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-[10000]"
    >
      {/* Backdrop overlay - completely covers everything */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onCancel}
      />

      {/* Modal content */}
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative animate-slideUp z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
          <i className="ri-error-warning-line text-4xl text-red-600"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Confirm Deletion</h2>
        <p className="text-gray-700 mb-8 text-center leading-relaxed">{message}</p>
        <div className="flex space-x-4 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

interface EventCreatedNotificationProps {
  isOpen: boolean;
  eventName: string;
  onClose: () => void;
}

export default function EventCreatedNotification({
  isOpen,
  eventName,
  onClose,
}: EventCreatedNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 3000); // Show for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl border border-green-400/20 backdrop-blur-sm max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="ri-checkbox-circle-line text-2xl"></i>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Event Created!</h3>
            <p className="text-green-100 text-sm">
              "{eventName}" has been submitted for approval.
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>
        {/* Progress bar */}
        <div className="mt-3 bg-white/20 rounded-full h-1">
          <div className="bg-white h-1 rounded-full animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}

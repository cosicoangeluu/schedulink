'use client';

import { useState } from 'react';

interface RoleCardProps {
  role: string;
  title: string;
  description: string;
  gradient: string;
  icon: string;
  iconColor: string;
  onSelect: (role: string) => void;
}

export default function RoleCard({ role, title, description, gradient, icon, iconColor, onSelect }: RoleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(role)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full group relative transform transition-all duration-500 ease-out hover:scale-105"
    >
      <div className={`
        ${gradient}
        rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10
        shadow-xl hover:shadow-2xl
        transform transition-all duration-500 ease-out
        ${isHovered ? 'scale-105 shadow-2xl rotate-1' : 'shadow-xl'}
        relative overflow-hidden
      `}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>

        <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 relative z-10">
          {/* Icon */}
          <div className="w-14 h-14 sm:w-16 md:w-20 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:rotate-12 transition-transform duration-300">
            <i className={`${icon} text-2xl sm:text-3xl md:text-4xl ${iconColor} group-hover:scale-110 transition-transform duration-300`}></i>
          </div>

          {/* Content */}
          <div className="flex-1 text-left min-w-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 group-hover:text-yellow-100 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-red-100 text-sm sm:text-base md:text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
              {description}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex items-center">
            <i className={`
              ri-arrow-right-line text-xl sm:text-2xl md:text-3xl text-white
              transform transition-all duration-300 group-hover:translate-x-3 group-hover:scale-125
              ${isHovered ? 'translate-x-2 scale-110' : ''}
            `}></i>
          </div>
        </div>
      </div>
    </button>
  );
}

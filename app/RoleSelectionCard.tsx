'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRole } from '../components/RoleContext';

export default function RoleSelectionCard() {
  const router = useRouter();
  const { setRole } = useRole();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleSelectRole = (role: string) => {
    setRole(role as 'admin' | 'student');
    // Navigate to different pages based on role selection
    if (role === 'admin') {
      router.push('/admin/login');
    } else if (role === 'student') {
      router.push('/student/dashboard');
    }
  };

  const handleFlip = (flipped: boolean) => {
    setIsFlipped(flipped);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 overflow-auto">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-4xl">
        {/* Main Container with Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-start">
          
          {/* Left Side - Branding Card with Flip Effect */}
          <div className="perspective-1000 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px] w-full">
            <div 
              className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
              onMouseEnter={() => handleFlip(true)}
              onMouseLeave={() => handleFlip(false)}
            >
              
              {/* Front Side */}
              <div className="absolute w-full h-full backface-hidden">
                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 text-white relative overflow-hidden h-full flex flex-col justify-center">
                  {/* Decorative circles - scaled for mobile */}
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 md:w-48 lg:w-64 bg-white opacity-5 rounded-full -mr-12 sm:-mr-16 md:-mr-24 lg:-mr-32 -mt-12 sm:-mt-16 md:-mt-24 lg:-mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 md:w-32 lg:w-48 bg-white opacity-5 rounded-full -ml-8 sm:-ml-12 md:-ml-16 lg:-ml-24 -mb-8 sm:-mb-12 md:-mb-16 lg:-mb-24"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center h-full justify-center px-2">
                    {/* Logo/Icon - responsive size */}
                    <div className="w-12 h-12 sm:w-16 md:w-20 lg:w-24 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 md:mb-6 shadow-lg">
                      <i className="ri-calendar-schedule-line text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-red-600"></i>
                    </div>
                    
                    {/* Brand Name - responsive font */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 md:mb-4 tracking-tight">ScheduLink</h1>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-red-100 leading-relaxed px-1 sm:px-2">Thesis project developed for streamlining administrative management of educational resources and events</p>
                  </div>
                  
                  {/* Arrow - positioned responsively */}
                  <i className={`
                    ri-arrow-right-line text-lg sm:text-xl md:text-2xl lg:text-3xl text-white 
                    transform transition-transform duration-300 absolute bottom-2 sm:bottom-4 right-2 sm:right-4
                  `}></i>
                </div>
              </div>

              {/* Back Side - Thesis Info */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg sm:shadow-xl md:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 text-white relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="relative z-10 flex flex-col items-center text-center h-full justify-center px-2">
                    <div className="w-12 h-12 sm:w-16 md:w-20 lg:w-24 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 md:mb-6 shadow-lg">
                      <i className="ri-graduation-cap-line text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-red-600"></i>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">Thesis Project</h2>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-red-100 leading-relaxed px-1 sm:px-2 max-w-md mb-4">
                      Developed by: Cosico, Angelu and Alcantara, Reuven<br />
                      Purpose: Streamlining administrative management of educational resources and events for efficient scheduling and reporting.
                    </p>
                    <p className="text-xs sm:text-sm text-red-200 italic">Hover to flip back</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Role Selection Cards */}
          <div className="space-y-4 md:space-y-6">
            {/* Admin Card */}
            <button
              onClick={() => handleSelectRole('admin')}
              onMouseEnter={() => setHoveredCard('admin')}
              onMouseLeave={() => setHoveredCard(null)}
              className="w-full group relative"
            >
              <div className={`
                bg-gradient-to-r from-red-500 to-red-600 
                rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 
                transform transition-all duration-300 
                ${hoveredCard === 'admin' ? 'scale-105 shadow-xl md:shadow-2xl' : 'shadow-lg hover:shadow-xl'}
              `}>
                <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 md:w-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <i className="ri-admin-line text-xl sm:text-2xl md:text-3xl text-red-600"></i>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">Admin</h3>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2">
                      Manage events, users, and resources. Approve events and generate reports.
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <i className={`
                    ri-arrow-right-line text-lg sm:text-xl md:text-2xl text-white
                    transform transition-transform duration-300
                    ${hoveredCard === 'admin' ? 'translate-x-2' : ''}
                  `}></i>
                </div>
              </div>
            </button>

            {/* Student/Department Head Card */}
            <button
              onClick={() => handleSelectRole('student')}
              onMouseEnter={() => setHoveredCard('student')}
              onMouseLeave={() => setHoveredCard(null)}
              className="w-full group relative"
            >
              <div className={`
                bg-gradient-to-r from-gray-800 to-gray-900 
                rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 
                transform transition-all duration-300 
                ${hoveredCard === 'student' ? 'scale-105 shadow-xl md:shadow-2xl' : 'shadow-lg hover:shadow-xl'}
              `}>
                <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 md:w-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <i className="ri-user-line text-xl sm:text-2xl md:text-3xl text-gray-800"></i>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">Student / Department Head</h3>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2">
                      Register for events, Send Event Reports and View Schedules.
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <i className={`
                    ri-arrow-right-line text-lg sm:text-xl md:text-2xl text-white
                    transform transition-transform duration-300
                    ${hoveredCard === 'student' ? 'translate-x-2' : ''}
                  `}></i>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="mt-6 md:mt-12 text-center">
          <p className="text-gray-600 text-xs sm:text-sm">
            © 2024 ScheduLink. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

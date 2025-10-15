'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useRole } from './RoleContext';
import TodoList from './TodoList';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const draggedRef = useRef(false);
  const [dragStart, setDragStart] = useState({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (role === 'student' && pathname === '/') {
      router.push('/calendar');
    }
  }, [role, pathname, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedPosition = localStorage.getItem('noteButtonPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      // Default positions
      if (isMobile) {
        setPosition({ x: window.innerWidth - 60, y: window.innerHeight - 60 });
      } else {
        setPosition({ x: window.innerWidth - 60, y: 16 });
      }
    }
  }, [isMobile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    draggedRef.current = false;
    setDragStart({ mouseX: e.clientX, mouseY: e.clientY, posX: position.x, posY: position.y });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    draggedRef.current = false;
    const touch = e.touches[0];
    setDragStart({ mouseX: touch.clientX, mouseY: touch.clientY, posX: position.x, posY: position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    draggedRef.current = true;
    const deltaX = e.clientX - dragStart.mouseX;
    const deltaY = e.clientY - dragStart.mouseY;
    setPosition({ x: dragStart.posX + deltaX, y: dragStart.posY + deltaY });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    draggedRef.current = true;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.mouseX;
    const deltaY = touch.clientY - dragStart.mouseY;
    setPosition({ x: dragStart.posX + deltaX, y: dragStart.posY + deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (!draggedRef.current) {
      setShowTodoModal(true);
    } else {
      // Save the current position
      localStorage.setItem('noteButtonPosition', JSON.stringify(position));
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      {children}

      {/* Movable Note Button for Admin */}
      {role === 'admin' && pathname !== '/' && pathname !== '/admin/login' && (
        <button
          ref={buttonRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
            zIndex: 50,
          }}
          className={`bg-red-600 text-white ${isMobile ? 'p-2' : 'p-3'} rounded-lg shadow-lg hover:bg-red-700`}
          aria-label="Open Todo List"
        >
          <i className={`ri-sticky-note-line ${isMobile ? 'text-lg' : 'text-xl'}`}></i>
        </button>
      )}

      {/* TodoList Modal */}
      <TodoList showModal={showTodoModal} onClose={() => setShowTodoModal(false)} />
    </>
  );
}

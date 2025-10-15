import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface NotificationsContextType {
  pendingCount: number;
  refreshNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  pendingCount: 0,
  refreshNotifications: () => {}
});

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      if (Array.isArray(data)) {
        const pending = data.filter((n) => n.status === 'pending').length;
        setPendingCount(pending);
      } else {
        setPendingCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setPendingCount(0);
    }
  };

  useEffect(() => {
    fetchPendingCount();
  }, []);

  const refreshNotifications = () => {
    fetchPendingCount();
  };

  return (
    <NotificationsContext.Provider value={{ pendingCount, refreshNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);

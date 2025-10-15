'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Role = 'admin' | 'student' | 'other-admin' | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as Role;
    if (storedRole) {
      setRoleState(storedRole);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem('userRole', newRole);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const clearRole = () => {
    setRoleState(null);
    localStorage.removeItem('userRole');
  };

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

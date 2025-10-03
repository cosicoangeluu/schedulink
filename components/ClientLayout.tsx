'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRole } from './RoleContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (role === 'student' && pathname === '/') {
      router.push('/calendar');
    }
  }, [role, pathname, router]);

  return <>{children}</>;
}

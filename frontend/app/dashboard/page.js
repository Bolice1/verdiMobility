'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth-store';

export default function DashboardEntryPage() {
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role || 'admin');

  useEffect(() => {
    router.replace(`/dashboard/${role}`);
  }, [role, router]);

  return null;
}

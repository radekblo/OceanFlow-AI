import { AppLayout } from '@/components/layout/app-layout';
import type { ReactNode } from 'react';

export default function ApplicationGroupLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

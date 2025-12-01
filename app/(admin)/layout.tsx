import type { Metadata } from 'next';
import { AdminShell } from '@/features/admin';

export const metadata: Metadata = {
  title: 'Admin | Pronoyon',
  description: 'Administrative console for managing Pronoyon teams and roles.',
};

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

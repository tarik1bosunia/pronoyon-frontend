import type { Metadata } from 'next';
import { ManagerShell } from '@/features/manager';

export const metadata: Metadata = {
  title: 'Manager Dashboard | Pronoyon',
  description: 'Content creator dashboard for adding and managing questions to enrich the question bank database.',
};

export default function ManagerGroupLayout({ children }: { children: React.ReactNode }) {
  return <ManagerShell>{children}</ManagerShell>;
}

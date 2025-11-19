import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - AiRicePest',
  description: '管理员控制台',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
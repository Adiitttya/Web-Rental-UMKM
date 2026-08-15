import React from 'react';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';

export const metadata = {
  title: 'Admin Dashboard — DsterGame Studio CMS',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}

import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminProtectedRoute>
  );
}

import { ProtectedLayout } from '../../components/layout/ProtectedLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout requireAdminOrHR={true}>{children}</ProtectedLayout>;
}

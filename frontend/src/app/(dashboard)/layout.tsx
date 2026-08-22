import { ProtectedLayout } from '../../components/layout/ProtectedLayout';

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

import { ResetForm } from '@/components/admin/reset-form';

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : '';
  return <ResetForm token={token} />;
}

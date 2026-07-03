import { LoginForm } from '@/components/admin/login-form';

export const dynamic = 'force-dynamic';

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = typeof searchParams.next === 'string' ? searchParams.next : '/admin';
  return <LoginForm next={next} />;
}

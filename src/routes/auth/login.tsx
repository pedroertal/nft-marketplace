import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/LoginForm';

export interface AuthSearchParams {
  redirect?: string;
}

export const Route = createFileRoute('/auth/login')({
  validateSearch: (search: Record<string, unknown>): AuthSearchParams => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    };
  },
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();

  return (
    <div className="container flex min-h-[calc(100vh-14rem)] items-center justify-center py-12 px-4">
      <LoginForm redirectTo={redirect} />
    </div>
  );
}

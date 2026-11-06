import { createFileRoute } from '@tanstack/react-router';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export interface RegisterSearchParams {
  redirect?: string;
}

export const Route = createFileRoute('/auth/register')({
  validateSearch: (search: Record<string, unknown>): RegisterSearchParams => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    };
  },
  component: RegisterPage,
});

function RegisterPage() {
  const { redirect } = Route.useSearch();

  return (
    <div className="container flex min-h-[calc(100vh-14rem)] items-center justify-center py-12 px-4">
      <RegisterForm redirectTo={redirect} />
    </div>
  );
}

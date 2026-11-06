import * as React from 'react';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/app/providers/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/profile/_auth')({
  component: ProfileAuthGuard,
});

function ProfileAuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Previne condição de corrida na transição imediata pós-login
  const hasLocalToken =
    typeof window !== 'undefined' && Boolean(localStorage.getItem('nft_token'));

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasLocalToken) {
      navigate({
        to: '/auth/login',
        search: {
          redirect: '/profile',
        },
      });
    }
  }, [isLoading, isAuthenticated, hasLocalToken, navigate]);

  if (isLoading || (!isAuthenticated && hasLocalToken)) {
    return (
      <div className="container py-12 max-w-5xl space-y-8">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-96 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Outlet />;
}

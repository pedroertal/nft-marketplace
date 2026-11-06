import { createFileRoute, Link } from '@tanstack/react-router';
import { WalletListCard } from '@/features/profile/components/WalletListCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/profile/_auth/wallets')({
  component: ProfileWalletsPage,
});

function ProfileWalletsPage() {
  return (
    <div className="container py-8 max-w-4xl space-y-6">
      <Link to="/profile">
        <Button variant="ghost" size="sm" className="gap-2 text-xs">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Perfil
        </Button>
      </Link>
      <WalletListCard />
    </div>
  );
}

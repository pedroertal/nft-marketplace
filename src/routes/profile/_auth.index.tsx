import * as React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/app/providers/AuthProvider';
import { useWallets } from '@/features/profile/api/useWallets';
import { useFavorites } from '@/features/favorites/api/useFavorites';
import { useNfts } from '@/features/catalog/api/useNfts';
import { useMyNfts } from '@/features/profile/api/useMyNfts';
import { useOrders } from '@/features/profile/api/useOrders';
import { WalletListCard } from '@/features/profile/components/WalletListCard';
import { ProfileEditDialog } from '@/features/profile/components/ProfileEditDialog';
import { NftCard } from '@/features/catalog/components/NftCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatAddress, formatEth } from '@/lib/utils';
import { Decimal } from '@/lib/decimal';
import {
  Wallet,
  Coins,
  Heart,
  LogOut,
  Edit3,
  Layers,
  History,
  CheckCircle2,
} from 'lucide-react';

export const Route = createFileRoute('/profile/_auth/')({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: wallets } = useWallets();
  const { data: favoritesData } = useFavorites();
  const { data: allNfts } = useNfts({ limit: 50 });
  const { data: userOwnedNfts } = useMyNfts();
  const { data: orders } = useOrders();

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  // Calcula o saldo consolidado de todas as carteiras
  const totalEthBalance = React.useMemo(() => {
    if (!wallets || wallets.length === 0) return '0.0000';
    return wallets.reduce((acc, curr) => {
      return Decimal.add(acc, curr.balance || '0');
    }, '0');
  }, [wallets]);

  const primaryWallet = wallets?.find((w) => w.type === 'PRIMARY') || wallets?.[0];

  // Filtra NFTs favoritados
  const favoritedNfts = React.useMemo(() => {
    if (!allNfts?.items || !favoritesData?.nftIds) return [];
    return allNfts.items.filter((nft) =>
      favoritesData.nftIds.includes(nft.id)
    );
  }, [allNfts, favoritesData]);

  // NFTs pertencentes ao usuário logado (adquiridos dinamicamente)
  const myNfts = React.useMemo(() => {
    if (userOwnedNfts) return userOwnedNfts;
    if (allNfts?.items) return allNfts.items.slice(0, 1);
    return [];
  }, [userOwnedNfts, allNfts]);

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  if (!user) return null;

  return (
    <div className="container py-8 md:py-12 max-w-6xl space-y-10">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#3e2c20] bg-[#1d1510] p-6 md:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={
                  user.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80'
                }
                alt={user.name}
                className="h-20 w-20 md:h-24 md:w-24 rounded-2xl border-2 border-[#e07328] object-cover shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-md">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-black text-[#f6eee7]">
                  {user.name}
                </h1>
                <Badge variant="neon" className="uppercase text-[10px] font-bold bg-[#e07328]/15 border-[#e07328]/30 text-[#f5a267]">
                  {user.role === 'creator' ? 'Criador' : 'Colecionador'}
                </Badge>
              </div>
              <p className="text-xs text-[#a49386] font-mono">{user.email}</p>
              {user.bio && (
                <p className="text-xs text-[#c4b5a8] max-w-md pt-1 leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditDialogOpen(true)}
              className="gap-2 border-[#3e2c20] bg-[#241a13] hover:bg-[#322319] text-[#f6eee7] text-xs flex-1 md:flex-initial"
            >
              <Edit3 className="h-3.5 w-3.5 text-[#e07328]" />
              Editar Perfil
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-xs flex-1 md:flex-initial"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Consolidado ETH */}
        <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-5">
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Saldo Consolidado
            </span>
            <Coins className="h-4 w-4 text-[#e07328]" />
          </div>
          <p className="mt-2 text-2xl font-black text-[#f6eee7] font-mono">
            {formatEth(totalEthBalance)} <span className="text-[#e07328] text-sm">ETH</span>
          </p>
          <span className="text-[11px] text-[#8a796e]">
            Somatório de {wallets?.length || 0} carteiras vinculadas
          </span>
        </div>

        {/* Carteira Principal */}
        <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-5">
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Carteira Principal
            </span>
            <Wallet className="h-4 w-4 text-[#e07328]" />
          </div>
          <p className="mt-2 text-sm font-mono font-bold text-[#f6eee7]">
            {primaryWallet ? formatAddress(primaryWallet.address, 6) : 'Não vinculada'}
          </p>
          <span className="text-[11px] text-[#8a796e]">
            {primaryWallet ? `Rede ${primaryWallet.network}` : 'Conecte uma carteira'}
          </span>
        </div>

        {/* NFTs Colecionados */}
        <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-5">
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Meus NFTs
            </span>
            <Layers className="h-4 w-4 text-[#e07328]" />
          </div>
          <p className="mt-2 text-2xl font-black text-[#f6eee7] font-mono">
            {myNfts.length}
          </p>
          <span className="text-[11px] text-[#8a796e]">
            Colecionáveis sob custódia
          </span>
        </div>

        {/* Favoritos */}
        <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-5">
          <div className="flex items-center justify-between text-[#8a796e]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Favoritos
            </span>
            <Heart className="h-4 w-4 text-[#e07328] fill-[#e07328]/20" />
          </div>
          <p className="mt-2 text-2xl font-black text-[#f6eee7] font-mono">
            {favoritesData?.nftIds.length || 0}
          </p>
          <span className="text-[11px] text-[#8a796e]">
            NFTs na sua lista de desejos
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="my-nfts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-[#1d1510] border border-[#36261b]">
          <TabsTrigger value="my-nfts" className="text-xs data-[state=active]:bg-[#e07328] data-[state=active]:text-white">
            Meus NFTs ({myNfts.length})
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-xs data-[state=active]:bg-[#e07328] data-[state=active]:text-white">
            Favoritos ({favoritesData?.nftIds.length || 0})
          </TabsTrigger>
          <TabsTrigger value="wallets" className="text-xs data-[state=active]:bg-[#e07328] data-[state=active]:text-white">
            Carteiras ({wallets?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs data-[state=active]:bg-[#e07328] data-[state=active]:text-white">
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Meus NFTs */}
        <TabsContent value="my-nfts" className="pt-6">
          {myNfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {myNfts.map((nft) => (
                <NftCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#36261b] bg-[#1d1510] p-12 text-center text-[#a49386] space-y-3">
              <p>Você ainda não possui colecionáveis na sua conta.</p>
              <Link to="/">
                <Button size="sm" className="gap-2 bg-[#e07328] hover:bg-[#ea8238] text-white">
                  Explorar Catálogo
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Favoritos */}
        <TabsContent value="favorites" className="pt-6">
          {favoritedNfts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {favoritedNfts.map((nft) => (
                <NftCard key={nft.id} nft={nft} isFavorite={true} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#36261b] bg-[#1d1510] p-12 text-center text-[#a49386] space-y-3">
              <Heart className="h-10 w-10 text-[#8a796e] mx-auto stroke-1" />
              <p>Nenhum NFT adicionado aos favoritos ainda.</p>
              <Link to="/">
                <Button variant="outline" size="sm" className="border-[#3e2c20] text-[#f6eee7]">
                  Buscar Obras para Favoritar
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Carteiras */}
        <TabsContent value="wallets" className="pt-6">
          <WalletListCard />
        </TabsContent>

        {/* Tab 4: Histórico de Pedidos */}
        <TabsContent value="history" className="pt-6">
          {orders && Object.keys(orders).length > 0 ? (
            <div className="space-y-3">
              {Object.values(orders).map((order) => (
                <div
                  key={order.orderId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#36261b] bg-[#1d1510] p-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#f6eee7]">
                        {order.orderId}
                      </span>
                      <Badge
                        variant="success"
                        className="text-[9px] uppercase font-bold py-0 h-4"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#8a796e] font-mono">
                      Tx: {formatAddress(order.txHash || '', 8)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right font-mono">
                      <span className="font-bold text-sm text-[#f6eee7]">
                        {formatEth(order.total || order.snapshot?.quote?.total || '0.0000')} ETH
                      </span>
                      <span className="block text-[10px] text-[#8a796e]">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <Link
                      to="/checkout/success"
                      search={{ orderId: order.orderId }}
                    >
                      <Button variant="outline" size="sm" className="text-xs border-[#3e2c20] bg-[#241a13] hover:bg-[#322319] text-[#f6eee7]">
                        Ver Recibo
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#36261b] bg-[#1d1510] p-12 text-center text-[#a49386]">
              <History className="h-10 w-10 text-[#8a796e] mx-auto stroke-1 mb-2" />
              <p>Nenhuma transação concluída ainda.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <ProfileEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}

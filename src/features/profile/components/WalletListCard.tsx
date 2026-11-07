import * as React from 'react';
import { useWallets } from '../api/useWallets';
import { Web3ConnectModal } from './Web3ConnectModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAddress, formatEth } from '@/lib/utils';
import { Wallet as WalletIcon, Plus, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function WalletListCard() {
  const { data: wallets, isLoading } = useWallets();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    toast.success('Endereço copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-2xl bg-[#241a13]" />
        <Skeleton className="h-20 w-full rounded-2xl bg-[#241a13]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#36261b] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#f6eee7] flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-[#e07328]" />
            Carteiras Vinculadas
          </h3>
          <p className="text-xs text-[#a49386] mt-0.5">
            Gerencie suas carteiras Web3 para assinatura de transações e custódia soberana.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setModalOpen(true)}
          className="gap-1.5 text-xs font-semibold rounded-xl bg-[#e07328] hover:bg-[#ea8238] text-white"
        >
          <Plus className="h-4 w-4" />
          Conectar Carteira
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets && wallets.length > 0 ? (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                wallet.type === 'PRIMARY'
                  ? 'border-[#e07328]/40 bg-[#1d1510] shadow-md shadow-black/40'
                  : 'border-[#36261b] bg-[#1d1510]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#f6eee7]">
                      {formatAddress(wallet.address, 6)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(wallet.address, wallet.id)}
                      className="text-[#8a796e] hover:text-[#f6eee7] transition-colors p-0.5"
                      aria-label="Copiar endereço da carteira"
                    >
                      {copiedId === wallet.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="text-xs text-[#8a796e]">
                    Rede {wallet.network}
                  </span>
                </div>

                <Badge
                  variant={wallet.type === 'PRIMARY' ? 'default' : 'secondary'}
                  className="uppercase text-[9px] font-bold"
                >
                  {wallet.type === 'PRIMARY' ? 'Principal' : 'Secundária'}
                </Badge>
              </div>

              <div className="mt-5 border-t border-[#36261b] pt-3 flex items-baseline justify-between font-mono">
                <span className="text-xs text-[#8a796e]">Saldo Disponível</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-black text-[#f6eee7]">
                    {formatEth(wallet.balance || '0.0000')}
                  </span>
                  <span className="text-xs font-semibold text-[#e07328]">ETH</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 rounded-2xl border border-dashed border-[#36261b] bg-[#1d1510] p-8 text-center text-[#a49386]">
            Nenhuma carteira conectada.
          </div>
        )}
      </div>

      <Web3ConnectModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

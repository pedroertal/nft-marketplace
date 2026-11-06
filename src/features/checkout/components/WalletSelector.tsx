import { useWallets } from '@/features/profile/api/useWallets';
import { Badge } from '@/components/ui/badge';
import { formatAddress, formatEth } from '@/lib/utils';
import { Decimal } from '@/lib/decimal';
import { Wallet as WalletIcon, Check, AlertCircle } from 'lucide-react';

interface WalletSelectorProps {
  selectedAddress: string;
  onSelectAddress: (address: string) => void;
  orderTotalEth: string;
}

export function WalletSelector({
  selectedAddress,
  onSelectAddress,
  orderTotalEth,
}: WalletSelectorProps) {
  const { data: wallets, isLoading } = useWallets();

  if (isLoading) {
    return <div className="h-24 animate-pulse rounded-2xl bg-slate-900/60" />;
  }

  const selectedWallet = wallets?.find((w) => w.address === selectedAddress) || wallets?.[0];
  const hasInsufficientFunds =
    selectedWallet?.balance &&
    Decimal.isLessThan(selectedWallet.balance, orderTotalEth);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <WalletIcon className="h-4 w-4 text-purple-400" />
          Carteira de Pagamento
        </label>
        <span className="text-[11px] text-muted-foreground">
          {wallets?.length || 0} vinculada(s)
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {wallets && wallets.length > 0 ? (
          wallets.map((wallet) => {
            const isSelected = wallet.address === selectedAddress;
            const isInsufficient =
              wallet.balance && Decimal.isLessThan(wallet.balance, orderTotalEth);

            return (
              <div
                key={wallet.id}
                onClick={() => onSelectAddress(wallet.address)}
                className={`relative flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/30 shadow-md shadow-purple-500/10'
                    : 'border-white/10 bg-slate-900/60 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                      isSelected
                        ? 'border-purple-500 bg-purple-600 text-white'
                        : 'border-white/10 bg-slate-950/80 text-muted-foreground'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <WalletIcon className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {formatAddress(wallet.address, 6)}
                      </span>
                      <Badge
                        variant={wallet.type === 'PRIMARY' ? 'default' : 'secondary'}
                        className="text-[9px] uppercase font-bold py-0 h-4"
                      >
                        {wallet.type === 'PRIMARY' ? 'Principal' : 'Secundária'}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Rede: {wallet.network}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-muted-foreground block">
                    Saldo disponível
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isInsufficient ? 'text-amber-400' : 'text-cyan-300'
                    }`}
                  >
                    {formatEth(wallet.balance || '0.0000')} ETH
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-4 text-center text-xs text-muted-foreground">
            Nenhuma carteira conectada. Por favor, vincule uma carteira no perfil antes do checkout.
          </div>
        )}
      </div>

      {hasInsufficientFunds && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-xs text-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            Atenção: O saldo da carteira selecionada é inferior ao valor total deste pedido.
          </span>
        </div>
      )}
    </div>
  );
}

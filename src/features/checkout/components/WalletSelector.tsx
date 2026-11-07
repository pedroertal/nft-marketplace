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
    return <div className="h-24 animate-pulse rounded-2xl bg-[#1d1510]" />;
  }

  const selectedWallet = wallets?.find((w) => w.address === selectedAddress) || wallets?.[0];
  const hasInsufficientFunds =
    selectedWallet?.balance &&
    Decimal.isLessThan(selectedWallet.balance, orderTotalEth);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#a49386] flex items-center gap-1.5">
          <WalletIcon className="h-4 w-4 text-[#e07328]" />
          Carteira de Pagamento
        </label>
        <span className="text-[11px] text-[#8a796e]">
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
                    ? 'border-[#e07328] bg-[#e07328]/10 shadow-md shadow-black/40'
                    : 'border-[#36261b] bg-[#1d1510] hover:bg-[#261c15]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                      isSelected
                        ? 'border-[#e07328] bg-[#e07328] text-white'
                        : 'border-[#36261b] bg-[#140e0b] text-[#a49386]'
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
                      <span className="font-mono text-xs font-bold text-[#f6eee7]">
                        {formatAddress(wallet.address, 6)}
                      </span>
                      <Badge
                        variant={wallet.type === 'PRIMARY' ? 'default' : 'secondary'}
                        className="text-[9px] uppercase font-bold py-0 h-4"
                      >
                        {wallet.type === 'PRIMARY' ? 'Principal' : 'Secundária'}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-[#8a796e]">
                      Rede: {wallet.network}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-[#8a796e] block">
                    Saldo disponível
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isInsufficient ? 'text-amber-400' : 'text-[#f6eee7]'
                    }`}
                  >
                    {formatEth(wallet.balance || '0.0000')} ETH
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-[#36261b] bg-[#1d1510] p-4 text-center text-xs text-[#a49386]">
            Nenhuma carteira Web3 conectada.
          </div>
        )}
      </div>

      {hasInsufficientFunds && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            A carteira selecionada possui saldo menor que o valor total do pedido.
          </span>
        </div>
      )}
    </div>
  );
}

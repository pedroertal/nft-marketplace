import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAddWallet } from '../api/useAddWallet';
import { WalletType } from '@/types/entities';
import { Wallet, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Web3ConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Web3ConnectModal({ open, onOpenChange }: Web3ConnectModalProps) {
  const addWalletMutation = useAddWallet();

  const [address, setAddress] = React.useState('');
  const [type, setType] = React.useState<WalletType>('SECONDARY');
  const [network, setNetwork] = React.useState('Ethereum');
  const [isSimulatingMetaMask, setIsSimulatingMetaMask] = React.useState(false);

  // Gera endereço hexadecimal simulado 0x...
  const generateRandomAddress = () => {
    const chars = '0123456789abcdefABCDEF';
    let rand = '0x';
    for (let i = 0; i < 40; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    return rand;
  };

  const handleSimulateMetaMask = () => {
    setIsSimulatingMetaMask(true);
    toast.loading('Invocando extensão MetaMask...', { duration: 1000 });

    setTimeout(() => {
      const generated = generateRandomAddress();
      setAddress(generated);
      setIsSimulatingMetaMask(false);
      toast.success('Carteira detectada via MetaMask!');
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    addWalletMutation.mutate(
      {
        address,
        type,
        network,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setAddress('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Wallet className="h-5 w-5 text-purple-400" />
            Conectar Carteira Web3
          </DialogTitle>
          <DialogDescription>
            Vincule uma carteira Ethereum, Polygon ou Arbitrum à sua conta no Nexus.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Botão de Auto-detecção MetaMask */}
          <Button
            type="button"
            variant="outline"
            onClick={handleSimulateMetaMask}
            disabled={isSimulatingMetaMask || addWalletMutation.isPending}
            className="w-full gap-3 py-5 border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200"
          >
            {isSimulatingMetaMask ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-cyan-400" />
            )}
            Simular Conexão com MetaMask
          </Button>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Endereço Público (0x...)
              </label>
              <Input
                type="text"
                placeholder="0x71C... ou gere acima"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="font-mono text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Tipo de Carteira
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as WalletType)}
                  className="h-10 w-full rounded-lg border border-white/10 bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="PRIMARY">Principal</option>
                  <option value="SECONDARY">Secundária</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Rede Blockchain
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="h-10 w-full rounded-lg border border-white/10 bg-slate-900 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="Ethereum">Ethereum</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Arbitrum">Arbitrum</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!address || addWalletMutation.isPending}
              className="w-full gap-2 py-5 font-semibold mt-2"
            >
              {addWalletMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Confirmar e Vincular Carteira
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

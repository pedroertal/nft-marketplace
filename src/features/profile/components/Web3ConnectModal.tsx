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
      <DialogContent className="max-w-md bg-[#1d1510] border-[#3e2c20]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#f6eee7]">
            <Wallet className="h-5 w-5 text-[#e07328]" />
            Conectar Nova Carteira
          </DialogTitle>
          <DialogDescription className="text-xs text-[#a49386]">
            Vincule uma nova chave pública Web3 à sua conta Kurio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Ação Rápida: Simular Conexão MetaMask */}
          <Button
            type="button"
            variant="outline"
            onClick={handleSimulateMetaMask}
            disabled={isSimulatingMetaMask}
            className="w-full gap-2 border-[#e07328]/40 bg-[#e07328]/10 hover:bg-[#e07328]/20 text-[#f5a267] text-xs font-semibold py-5 rounded-xl"
          >
            {isSimulatingMetaMask ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#e07328]" />
            ) : (
              <Sparkles className="h-4 w-4 text-[#e07328]" />
            )}
            Detectar Carteira MetaMask Automaticamente
          </Button>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#f6eee7]">
                Endereço Hexadecimal (0x...)
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x71C...872"
                required
                className="font-mono text-xs bg-[#140e0b] border-[#36261b] text-[#f6eee7] focus:border-[#e07328]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#f6eee7]">
                  Rede Blockchain
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[#36261b] bg-[#140e0b] px-3 text-xs text-[#f6eee7] focus:border-[#e07328]"
                >
                  <option value="Ethereum">Ethereum</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Arbitrum">Arbitrum</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#f6eee7]">
                  Tipo de Carteira
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as WalletType)}
                  className="w-full h-10 rounded-xl border border-[#36261b] bg-[#140e0b] px-3 text-xs text-[#f6eee7] focus:border-[#e07328]"
                >
                  <option value="SECONDARY">Secundária</option>
                  <option value="PRIMARY">Principal</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={addWalletMutation.isPending || !address}
              className="w-full gap-2 py-5 font-bold mt-2 bg-[#e07328] hover:bg-[#ea8238] text-white"
            >
              {addWalletMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Confirmar Vínculo da Carteira
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import * as React from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/app/providers/AuthProvider';
import { useCart } from '@/features/cart/api/useCart';
import { useQuote } from '@/features/cart/api/useQuote';
import { useWallets } from '@/features/profile/api/useWallets';
import { useCreateOrder } from '@/features/checkout/api/useCreateOrder';
import { getOrCreateIdempotencyKey } from '@/features/checkout/utils/idempotency';
import { WalletSelector } from '@/features/checkout/components/WalletSelector';
import { NetworkSelect } from '@/features/checkout/components/NetworkSelect';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatEth } from '@/lib/utils';
import { Decimal } from '@/lib/decimal';
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/checkout/')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: wallets, isLoading: walletsLoading } = useWallets();

  const items = cart?.items || [];
  // Mantém um snapshot estável dos itens adquiridos para evitar flicker durante a transição
  const itemsSnapshotRef = React.useRef(items);
  if (items.length > 0) {
    itemsSnapshotRef.current = items;
  }
  const displayItems = items.length > 0 ? items : itemsSnapshotRef.current;

  const { data: quote, isLoading: quoteLoading } = useQuote(displayItems);

  const createOrderMutation = useCreateOrder();

  const [idempotencyKey] = React.useState<string>(() => getOrCreateIdempotencyKey());
  const [selectedWalletAddress, setSelectedWalletAddress] = React.useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = React.useState<string>('Ethereum');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const isSubmitting = isProcessing || createOrderMutation.isPending || isSuccess;

  // Define a carteira padrão inicial (PRIMARY ou primeira disponível)
  React.useEffect(() => {
    if (wallets && wallets.length > 0 && !selectedWalletAddress) {
      const primary = wallets.find((w) => w.type === 'PRIMARY') || wallets[0];
      setSelectedWalletAddress(primary.address);
    }
  }, [wallets, selectedWalletAddress]);

  // Route Guard: Protege a rota contra acessos não autenticados
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({
        to: '/auth/login',
        search: { redirect: '/checkout' },
      });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Se o carrinho estiver vazio, retorna para /cart apenas se o checkout não estiver sendo finalizado
  React.useEffect(() => {
    if (!cartLoading && items.length === 0 && !isSubmitting) {
      navigate({ to: '/cart' });
    }
  }, [cartLoading, items, isSubmitting, navigate]);

  const subtotal = quote?.subtotal || '0.0000';
  const discount = quote?.discount || '0.0000';
  const networkFee = quote?.networkFee || '0.0120';
  const total = quote?.total || Decimal.add(subtotal, networkFee);

  const selectedWallet = wallets?.find((w) => w.address === selectedWalletAddress);
  const hasInsufficientFunds =
    selectedWallet?.balance && Decimal.isLessThan(selectedWallet.balance, total);

  const handleConfirmOrder = () => {
    // Previne cliques múltiplos concorrentes
    if (isSubmitting) return;

    if (!selectedWalletAddress) {
      toast.error('Selecione uma carteira para efetuar o pagamento.');
      return;
    }

    if (displayItems.some((i) => i.hasPriceChanged)) {
      toast.error('Existem alterações de preço concorrentes no seu carrinho.');
      return;
    }

    setIsProcessing(true);

    // Dispara a mutação enviando o header Idempotency-Key
    createOrderMutation.mutate(
      {
        quoteId: quote?.quoteId || `q-${Date.now()}`,
        walletAddress: selectedWalletAddress,
        network: selectedNetwork,
        idempotencyKey,
      },
      {
        onSuccess: (order) => {
          setIsSuccess(true);
          setIsProcessing(false);
          // Transição direta e fluida para o recibo, sem flicker de carrinho vazio
          navigate({
            to: '/checkout/success',
            search: { orderId: order.orderId },
          });
        },
        onError: () => {
          setIsProcessing(false);
        },
      }
    );
  };

  if (authLoading || cartLoading || walletsLoading || quoteLoading) {
    return (
      <div className="container py-12 max-w-5xl space-y-8">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Lock className="h-7 w-7 text-purple-400" />
            Checkout Seguro
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Transação atômica idempotente com liquidação instantânea na blockchain.
          </p>
        </div>

        <Link to="/cart">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Carrinho
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Coluna Esquerda: Configuração da Transação */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seletor de Carteira */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
            <WalletSelector
              selectedAddress={selectedWalletAddress}
              onSelectAddress={setSelectedWalletAddress}
              orderTotalEth={total}
            />
          </div>

          {/* Seletor de Rede */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
            <NetworkSelect
              selectedNetwork={selectedNetwork}
              onSelectNetwork={setSelectedNetwork}
            />
          </div>

          {/* Resumo dos Itens Sendo Adquiridos */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Colecionáveis Selecionados ({displayItems.length})
            </h3>

            <div className="divide-y divide-white/5">
              {displayItems.map((item) => (
                <div
                  key={item.nftId}
                  className="flex items-center justify-between py-3 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-12 w-12 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {item.title}
                      </p>
                      <span className="text-[11px] text-muted-foreground">
                        Qtd: {item.quantity} × {formatEth(item.unitPrice)} ETH
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-bold text-cyan-300 shrink-0">
                    {formatEth(Decimal.mul(item.unitPrice, item.quantity))} ETH
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Resumo Financeiro e Ação de Pagamento */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Detalhes do Pagamento
            </h3>

            {/* Linhas Financeiras */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono text-white font-semibold">
                  {formatEth(subtotal)} ETH
                </span>
              </div>

              {Decimal.isGreaterThan(discount, '0') && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Desconto de Cupom</span>
                  <span className="font-mono font-bold">
                    - {formatEth(discount)} ETH
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Taxa de Rede ({selectedNetwork})</span>
                <span className="font-mono text-white font-semibold">
                  {formatEth(networkFee)} ETH
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
                <span className="text-base font-bold text-white">Total Final</span>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-2xl font-black text-cyan-300">
                    {formatEth(total)}
                  </span>
                  <span className="text-xs font-bold text-cyan-400">ETH</span>
                </div>
              </div>
            </div>

            {/* Chave de Idempotência */}
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                <KeyRound className="h-3.5 w-3.5 text-purple-400" />
                <span>Idempotency-Key Ativa</span>
              </div>
              <p className="font-mono text-[11px] text-purple-200 truncate">
                {idempotencyKey}
              </p>
            </div>

            {hasInsufficientFunds && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Saldo insuficiente para esta transação.</span>
              </div>
            )}

            {/* Botão de Finalizar Pedido */}
            <Button
              size="lg"
              onClick={handleConfirmOrder}
              disabled={
                isSubmitting ||
                !selectedWalletAddress ||
                Boolean(hasInsufficientFunds)
              }
              className="w-full gap-2 py-6 font-extrabold text-sm shadow-xl shadow-purple-600/30 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  <span>Processando Transação...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Confirmar e Liquidar Pedido</span>
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Assinatura protegida por smart contract auditado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

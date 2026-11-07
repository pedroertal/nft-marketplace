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
  KeyRound,
  Loader2,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/checkout/')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: wallets } = useWallets();

  const items = cart?.items || [];
  // Mantém um snapshot estável dos itens adquiridos para evitar flicker durante a transição
  const itemsSnapshotRef = React.useRef(items);
  if (items.length > 0) {
    itemsSnapshotRef.current = items;
  }
  const displayItems = items.length > 0 ? items : itemsSnapshotRef.current;

  const { data: quote } = useQuote(displayItems);

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
  }, [cartLoading, items.length, isSubmitting, navigate]);

  const hasPriceConflict = displayItems.some((item) => item.hasPriceChanged);

  // Calcula valores com segurança decimal
  const calculatedSubtotal = React.useMemo(() => {
    return displayItems.reduce((acc, item) => {
      const line = Decimal.mul(item.unitPrice, item.quantity);
      return Decimal.add(acc, line);
    }, '0');
  }, [displayItems]);

  const discountAmount = quote?.discount || '0.0000';
  const networkFee = quote?.networkFee || '0.0120';
  const totalEth = quote?.total || Decimal.add(calculatedSubtotal, networkFee);

  const selectedWallet = wallets?.find((w) => w.address === selectedWalletAddress);
  const isBalanceInsufficient =
    selectedWallet?.balance && Decimal.isLessThan(selectedWallet.balance, totalEth);

  const handleConfirmOrder = () => {
    if (!selectedWalletAddress) {
      toast.error('Selecione uma carteira Web3 para continuar.');
      return;
    }

    if (hasPriceConflict) {
      toast.error('Existem conflitos de preço. Reconcilie seu carrinho antes de pagar.');
      return;
    }

    if (isBalanceInsufficient) {
      toast.error('Saldo insuficiente na carteira selecionada.');
      return;
    }

    setIsProcessing(true);

    // Executa mutação idempotente enviando Idempotency-Key
    createOrderMutation.mutate(
      {
        quoteId: quote?.quoteId || 'quote-preview',
        walletAddress: selectedWalletAddress,
        network: selectedNetwork,
        idempotencyKey,
      },
      {
        onSuccess: (order) => {
          setIsProcessing(false);
          setIsSuccess(true);
          toast.success('Pedido liquidado com sucesso na blockchain!');
          navigate({
            to: '/checkout/success',
            search: { orderId: order.orderId },
          });
        },
        onError: (err: any) => {
          setIsProcessing(false);
          toast.error(
            err?.response?.data?.message || 'Erro ao processar a liquidação do pedido.'
          );
        },
      }
    );
  };

  if (authLoading || (cartLoading && items.length === 0)) {
    return (
      <div className="container py-12 max-w-5xl space-y-8">
        <Skeleton className="h-8 w-64 rounded-lg bg-[#241a13]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Skeleton className="h-44 w-full rounded-2xl bg-[#241a13]" />
            <Skeleton className="h-36 w-full rounded-2xl bg-[#241a13]" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-80 w-full rounded-3xl bg-[#241a13]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 max-w-6xl space-y-8">
      {/* Header & Voltar */}
      <div className="flex items-center justify-between border-b border-[#36261b] pb-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#f6eee7] flex items-center gap-3">
            <Lock className="h-7 w-7 text-[#e07328]" />
            Pagamento e Liquidação
          </h1>
          <p className="text-xs text-[#a49386] mt-1">
            Transação com garantia de idempotência e liquidação direta em contrato auditado.
          </p>
        </div>

        <Link to="/cart">
          <Button variant="ghost" size="sm" className="gap-2 text-xs text-[#a49386] hover:text-[#f6eee7] hover:bg-[#281d16]">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Carrinho
          </Button>
        </Link>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Carteira, Rede e Idempotência */}
        <div className="lg:col-span-7 space-y-6">
          {/* Seletor de Carteira */}
          <div className="rounded-3xl border border-[#36261b] bg-[#1d1510] p-6 shadow-xl space-y-4">
            <WalletSelector
              selectedAddress={selectedWalletAddress}
              onSelectAddress={setSelectedWalletAddress}
              orderTotalEth={totalEth}
            />
          </div>

          {/* Seleção de Rede */}
          <div className="rounded-3xl border border-[#36261b] bg-[#1d1510] p-6 shadow-xl space-y-4">
            <NetworkSelect
              selectedNetwork={selectedNetwork}
              onSelectNetwork={setSelectedNetwork}
            />
          </div>

          {/* Idempotency Card */}
          <div className="rounded-2xl border border-[#36261b] bg-[#140e0b] p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-[#8a796e]">
              <span className="flex items-center gap-1.5 font-semibold text-[#f6eee7]">
                <KeyRound className="h-3.5 w-3.5 text-[#e07328]" />
                Idempotency-Key Ativa
              </span>
              <span className="font-mono text-[10px] text-emerald-400">Proteção contra Duplicações</span>
            </div>
            <p className="font-mono text-[11px] text-[#f5a267] break-all bg-[#1d1510] p-2 rounded-lg border border-[#36261b]">
              {idempotencyKey}
            </p>
            <p className="text-[11px] text-[#8a796e] leading-snug">
              Caso a conexão caia durante a assinatura, a chave impede cobranças repetidas na rede.
            </p>
          </div>
        </div>

        {/* Coluna Direita: Resumo do Pedido e Confirmação */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-[#3e2c20] bg-[#1d1510] p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-[#f6eee7] border-b border-[#36261b] pb-4 flex items-center justify-between">
              <span>Resumo da Compra</span>
              <span className="text-xs font-normal text-[#a49386]">
                {displayItems.length} {displayItems.length === 1 ? 'item' : 'itens'}
              </span>
            </h3>

            {/* Lista resumida de itens */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {displayItems.map((item) => (
                <div
                  key={item.nftId}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-10 w-10 rounded-lg object-cover border border-[#36261b] bg-[#261c15] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#f6eee7] truncate">{item.title}</p>
                      <p className="text-[11px] text-[#8a796e]">
                        Qtd: {item.quantity} × {formatEth(item.unitPrice)} ETH
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#f6eee7] shrink-0">
                    {formatEth(Decimal.mul(item.unitPrice, item.quantity))} ETH
                  </span>
                </div>
              ))}
            </div>

            {/* Linhas Financeiras */}
            <div className="space-y-2.5 border-t border-[#36261b] pt-4 text-xs">
              <div className="flex items-center justify-between text-[#a49386]">
                <span>Subtotal</span>
                <span className="font-mono text-[#f6eee7] font-semibold">
                  {formatEth(calculatedSubtotal)} ETH
                </span>
              </div>

              {Decimal.isGreaterThan(discountAmount, '0') && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Desconto Aplicado</span>
                  <span className="font-mono font-bold">
                    - {formatEth(discountAmount)} ETH
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-[#a49386]">
                <span>Taxa de Rede (Gas Estimada)</span>
                <span className="font-mono text-[#f6eee7]">{formatEth(networkFee)} ETH</span>
              </div>

              <div className="border-t border-[#36261b] pt-3 flex items-baseline justify-between">
                <span className="font-bold text-sm text-[#f6eee7]">Total a Pagar</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#f6eee7] font-mono">
                    {formatEth(totalEth)}
                  </span>
                  <span className="text-xs font-bold text-[#e07328] font-mono">
                    ETH
                  </span>
                </div>
              </div>
            </div>

            {/* Botão de Confirmação e Pagamento */}
            <Button
              size="lg"
              disabled={
                isSubmitting ||
                hasPriceConflict ||
                Boolean(isBalanceInsufficient) ||
                !selectedWalletAddress
              }
              onClick={handleConfirmOrder}
              className="w-full gap-2 py-6 text-sm font-bold bg-[#e07328] hover:bg-[#ea8238] text-white shadow-xl shadow-black/40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Processando Transação...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Confirmar e Liquidar Pedido</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { useSocket } from '@/app/providers/SocketProvider';
import { Button } from '@/components/ui/button';
import { Box, ShieldCheck, Wallet, Zap, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function Footer() {
  const { isConnected } = useSocket();
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Insira um e-mail válido para subscrever.');
      return;
    }
    setSubscribed(true);
    toast.success('Inscrição confirmada! Você receberá os próximos drops.');
    setNewsletterEmail('');
  };

  return (
    <footer className="w-full border-t border-[#36261b] bg-[#140e0b]">
      {/* 4 Feature Pillars Bar (Figma Design) */}
      <div className="border-b border-[#36261b]/80 bg-[#19120d]">
        <div className="container py-10 md:py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Segurança de Contratos */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#211812] border border-[#36261b]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e07328]/15 border border-[#e07328]/30 text-[#f5a267]">
                <ShieldCheck className="h-6 w-6 text-[#e07328]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#f6eee7]">
                  Segurança de contratos
                </h4>
                <p className="text-xs text-[#a49386] leading-relaxed">
                  Todos os smart contracts são auditados e verificados publicamente na blockchain.
                </p>
              </div>
            </div>

            {/* 2. Custódia em Carteira */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#211812] border border-[#36261b]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e07328]/15 border border-[#e07328]/30 text-[#f5a267]">
                <Wallet className="h-6 w-6 text-[#e07328]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#f6eee7]">
                  Custódia em carteira
                </h4>
                <p className="text-xs text-[#a49386] leading-relaxed">
                  Você é o único detentor das chaves privadas e da custódia real dos seus NFTs.
                </p>
              </div>
            </div>

            {/* 3. Rápido e Transparente */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#211812] border border-[#36261b]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e07328]/15 border border-[#e07328]/30 text-[#f5a267]">
                <Zap className="h-6 w-6 text-[#e07328]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#f6eee7]">
                  Rápido e transparente
                </h4>
                <p className="text-xs text-[#a49386] leading-relaxed">
                  Liquidação imediata de compras e vendas sem intermediários ou taxas ocultas.
                </p>
              </div>
            </div>

            {/* 4. Subscreva Novidades */}
            <div className="p-4 rounded-2xl bg-[#211812] border border-[#36261b] space-y-2">
              <h4 className="text-sm font-bold text-[#f6eee7]">
                Subscreva novidades
              </h4>
              <p className="text-xs text-[#a49386]">
                Receba alertas de novos lançamentos e drops exclusivos em primeira mão.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Inscrição realizada com sucesso!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Seu e-mail..."
                    className="flex-1 min-w-0 h-9 rounded-lg bg-[#140e0b] border border-[#36261b] px-3 text-xs text-[#f6eee7] placeholder:text-[#8a796e] focus:outline-none focus:border-[#e07328]"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 px-3 bg-[#e07328] hover:bg-[#ea8238] text-white shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#e07328] to-[#f59e0b] p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-[#140e0b]">
                  <Box className="h-4 w-4 text-[#f5a267] stroke-[2.2]" />
                </div>
              </div>
              <span className="font-sans text-xl font-black tracking-wider text-[#f6eee7]">
                KURIO
              </span>
            </div>
            <p className="max-w-sm text-sm text-[#a49386] leading-relaxed">
              O marketplace de arte digital e colecionáveis descentralizados de alta performance. Negocie avatares únicos com liquidação instantânea e garantia de custódia em carteira.
            </p>
            {/* Live Socket status indicator */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono ${
                isConnected
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-[#e07328]/30 bg-[#e07328]/10 text-[#f5a267]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {isConnected && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    isConnected ? 'bg-emerald-500' : 'bg-[#e07328]'
                  }`}
                ></span>
              </span>
              <span>
                {isConnected
                  ? 'Rede Sepolia • Sync em Tempo Real Ativo'
                  : 'WebSocket Conectando...'}
              </span>
            </div>
          </div>

          {/* Sobre */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f6eee7]">
              Sobre
            </h4>
            <ul className="space-y-2 text-sm text-[#a49386]">
              <li>
                <Link to="/" className="transition-colors hover:text-[#f6eee7]">
                  Sobre a Kurio
                </Link>
              </li>
              <li>
                <a href="#aprenda" className="transition-colors hover:text-[#f6eee7]">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="#aprenda" className="transition-colors hover:text-[#f6eee7]">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#aprenda" className="transition-colors hover:text-[#f6eee7]">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Mercado */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f6eee7]">
              Mercado
            </h4>
            <ul className="space-y-2 text-sm text-[#a49386]">
              <li>
                <Link to="/" className="transition-colors hover:text-[#f6eee7]">
                  Todos os NFTs
                </Link>
              </li>
              <li>
                <Link to="/" search={{ category: 'Avatares' }} className="transition-colors hover:text-[#f6eee7]">
                  Avatares & Personagens
                </Link>
              </li>
              <li>
                <Link to="/" search={{ category: 'Collectibles' }} className="transition-colors hover:text-[#f6eee7]">
                  Colecionáveis Raros
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition-colors hover:text-[#f6eee7]">
                  Meu Carrinho
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos & Comunidade */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f6eee7]">
              Comunidade
            </h4>
            <ul className="space-y-2 text-sm text-[#a49386]">
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#f6eee7]">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://discord.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#f6eee7]">
                  Discord Oficial
                </a>
              </li>
              <li>
                <a href="https://telegram.org" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#f6eee7]">
                  Telegram Community
                </a>
              </li>
              <li>
                <Link to="/profile" className="transition-colors hover:text-[#f6eee7]">
                  Minhas Carteiras
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#36261b] pt-8 text-xs text-[#8a796e] md:flex-row">
          <p>© 2026 Kurio Inc. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Auditado por OpenZeppelin & CertiK</span>
            <span>Ethereum Sepolia Testnet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

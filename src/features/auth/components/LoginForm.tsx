import * as React from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { loginSchema, LoginFormValues } from '../schemas/auth.schemas';
import { useLogin } from '../api/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Mail, Lock, ArrowRight, Hexagon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const [formData, setFormData] = React.useState<LoginFormValues>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof LoginFormValues, string>>>({});

  const validate = (): boolean => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormValues;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    loginMutation.mutate(formData, {
      onSuccess: () => {
        navigate({ to: redirectTo || '/profile' });
      },
    });
  };

  // Simulação de login rápido com Carteira Web3 (MetaMask/WalletConnect)
  const handleQuickWalletConnect = () => {
    toast.loading('Conectando à MetaMask...', { duration: 800 });
    setTimeout(() => {
      loginMutation.mutate(
        { email: 'pedro@nexus.io', password: 'password123' },
        {
          onSuccess: () => {
            navigate({ to: redirectTo || '/profile' });
          },
        }
      );
    }, 800);
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/25">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/70">
            <Hexagon className="h-6 w-6 text-cyan-300 stroke-[2.2] fill-cyan-400/10" />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Acessar Plataforma
        </h2>
        <p className="text-xs text-muted-foreground">
          Conecte sua carteira Web3 ou entre com credenciais
        </p>
      </div>

      {/* Botão de Conexão Rápida com Carteira */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleQuickWalletConnect}
          disabled={loginMutation.isPending}
          className="w-full gap-3 py-6 text-sm font-semibold border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 rounded-xl"
        >
          <Wallet className="h-5 w-5 text-cyan-400" />
          Conectar com MetaMask / WalletConnect
        </Button>

        <div className="relative flex items-center justify-center text-xs uppercase pt-2">
          <div className="w-full border-t border-white/10" />
          <span className="bg-slate-900 px-3 text-muted-foreground text-[10px] font-mono">
            ou com credenciais
          </span>
          <div className="w-full border-t border-white/10" />
        </div>
      </div>

      {/* Formulário com validação Zod */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-purple-400" />
            E-mail
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="pedro@nexus.io"
            autoComplete="email"
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.email && (
            <p className="text-[11px] font-medium text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-purple-400" />
              Senha
            </label>
            <span className="text-[11px] text-muted-foreground">Demo: password123</span>
          </div>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="••••••••••••"
            autoComplete="current-password"
            className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.password && (
            <p className="text-[11px] font-medium text-destructive">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full gap-2 py-6 font-semibold rounded-xl shadow-xl shadow-purple-600/20"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Autenticando...</span>
            </>
          ) : (
            <>
              <span>Entrar na Conta</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Link para Cadastro */}
      <div className="text-center text-xs text-muted-foreground border-t border-white/5 pt-4">
        Não tem uma conta ainda?{' '}
        <Link
          to="/auth/register"
          search={{ redirect: redirectTo }}
          className="font-semibold text-purple-400 hover:text-purple-300"
        >
          Criar conta de colecionador
        </Link>
      </div>
    </div>
  );
}

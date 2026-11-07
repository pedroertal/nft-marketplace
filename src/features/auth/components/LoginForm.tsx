import * as React from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { loginSchema, LoginFormValues } from '../schemas/auth.schemas';
import { useLogin } from '../api/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Mail, Lock, ArrowRight, Box, Loader2 } from 'lucide-react';
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
    <div className="w-full max-w-md space-y-8 rounded-3xl border border-[#3e2c20] bg-[#1d1510] p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e07328] to-[#f59e0b] p-0.5 shadow-lg shadow-black/50">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#140e0b]">
            <Box className="h-6 w-6 text-[#f5a267] stroke-[2.2]" />
          </div>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#f6eee7]">
          Acessar Plataforma
        </h2>
        <p className="text-xs text-[#a49386]">
          Conecte sua carteira Web3 ou entre com credenciais Kurio
        </p>
      </div>

      {/* Botão de Conexão Rápida com Carteira */}
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleQuickWalletConnect}
          disabled={loginMutation.isPending}
          className="w-full gap-3 py-6 text-sm font-bold border-[#e07328]/40 bg-[#e07328]/10 hover:bg-[#e07328]/20 text-[#f5a267] rounded-xl"
        >
          <Wallet className="h-5 w-5 text-[#e07328]" />
          Conectar com MetaMask / WalletConnect
        </Button>

        <div className="relative flex items-center justify-center text-xs uppercase pt-2">
          <div className="w-full border-t border-[#36261b]" />
          <span className="bg-[#1d1510] px-3 text-[#8a796e] text-[10px] font-mono">
            Ou use seu e-mail
          </span>
        </div>
      </div>

      {/* Formulário de E-mail e Senha */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#f6eee7] flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-[#e07328]" />
            E-mail
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="pedro@nexus.io"
            className="h-11 rounded-xl bg-[#140e0b] border-[#36261b] text-sm text-[#f6eee7] placeholder:text-[#8a796e] focus:border-[#e07328]"
          />
          {errors.email && (
            <p className="text-[11px] text-red-400 font-medium">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#f6eee7] flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#e07328]" />
              Senha
            </label>
            <span className="text-[10px] text-[#8a796e] cursor-pointer hover:underline">
              Esqueceu?
            </span>
          </div>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="••••••••••••"
            className="h-11 rounded-xl bg-[#140e0b] border-[#36261b] text-sm text-[#f6eee7] placeholder:text-[#8a796e] focus:border-[#e07328]"
          />
          {errors.password && (
            <p className="text-[11px] text-red-400 font-medium">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full gap-2 py-6 text-sm font-bold bg-[#e07328] hover:bg-[#ea8238] text-white shadow-xl shadow-black/40 rounded-xl mt-2"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
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

      {/* Footer */}
      <div className="text-center text-xs text-[#a49386]">
        <span>Não tem uma conta cadastrada? </span>
        <Link
          to="/auth/register"
          className="font-bold text-[#e07328] hover:underline hover:text-[#ea8238]"
        >
          Criar Nova Conta
        </Link>
      </div>
    </div>
  );
}

import * as React from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { registerSchema, RegisterFormValues } from '../schemas/auth.schemas';
import { useRegister } from '../api/useRegister';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Hexagon, ArrowRight, Loader2, Palette, Shield } from 'lucide-react';

interface RegisterFormProps {
  redirectTo?: string;
}

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [formData, setFormData] = React.useState<RegisterFormValues>({
    name: '',
    email: '',
    password: '',
    role: 'collector',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof RegisterFormValues, string>>>({});

  const validate = (): boolean => {
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RegisterFormValues;
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

    registerMutation.mutate(formData, {
      onSuccess: () => {
        navigate({ to: redirectTo || '/profile' });
      },
    });
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/25">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950/70">
            <Hexagon className="h-6 w-6 text-cyan-300 stroke-[2.2] fill-cyan-400/10" />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Criar Nova Conta
        </h2>
        <p className="text-xs text-muted-foreground">
          Junte-se ao marketplace Web3 descentralizado
        </p>
      </div>

      {/* Formulário com validação Zod */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-purple-400" />
            Nome Completo
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Seu nome ou pseudônimo"
            className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.name && (
            <p className="text-[11px] font-medium text-destructive">{errors.name}</p>
          )}
        </div>

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
            placeholder="voce@exemplo.com"
            autoComplete="email"
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.email && (
            <p className="text-[11px] font-medium text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-purple-400" />
            Senha
          </label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.password && (
            <p className="text-[11px] font-medium text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Escolha de Papel: Colecionador ou Criador */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Perfil na Plataforma
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'collector' }))}
              className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                formData.role === 'collector'
                  ? 'border-purple-500 bg-purple-950/40 text-white shadow-md'
                  : 'border-white/10 bg-slate-900/60 text-muted-foreground hover:bg-slate-800'
              }`}
            >
              <Shield className="h-5 w-5 mb-1 text-purple-400" />
              <span className="text-xs font-bold">Colecionador</span>
              <span className="text-[10px] text-muted-foreground">Comprar e guardar</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'creator' }))}
              className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                formData.role === 'creator'
                  ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-md'
                  : 'border-white/10 bg-slate-900/60 text-muted-foreground hover:bg-slate-800'
              }`}
            >
              <Palette className="h-5 w-5 mb-1 text-cyan-400" />
              <span className="text-xs font-bold">Criador</span>
              <span className="text-[10px] text-muted-foreground">Criar e vender</span>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full gap-2 py-6 font-semibold rounded-xl shadow-xl shadow-cyan-500/20 mt-2"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Criando sua conta...</span>
            </>
          ) : (
            <>
              <span>Cadastrar e Conectar</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Link para Login */}
      <div className="text-center text-xs text-muted-foreground border-t border-white/5 pt-4">
        Já possui uma conta cadastrada?{' '}
        <Link
          to="/auth/login"
          search={{ redirect: redirectTo }}
          className="font-semibold text-purple-400 hover:text-purple-300"
        >
          Acessar minha conta
        </Link>
      </div>
    </div>
  );
}

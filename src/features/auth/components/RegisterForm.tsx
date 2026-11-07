import * as React from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { registerSchema, RegisterFormValues } from '../schemas/auth.schemas';
import { useRegister } from '../api/useRegister';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Box, ArrowRight, Loader2, Palette, Shield } from 'lucide-react';

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
    <div className="w-full max-w-md space-y-8 rounded-3xl border border-[#3e2c20] bg-[#1d1510] p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e07328] to-[#f59e0b] p-0.5 shadow-lg shadow-black/50">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#140e0b]">
            <Box className="h-6 w-6 text-[#f5a267] stroke-[2.2]" />
          </div>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#f6eee7]">
          Criar Nova Conta
        </h2>
        <p className="text-xs text-[#a49386]">
          Junte-se à Kurio como colecionador soberano ou criador verificado
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#f6eee7] flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-[#e07328]" />
            Nome Completo
          </label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Ex: Beatriz Lima"
            className="h-11 rounded-xl bg-[#140e0b] border-[#36261b] text-sm text-[#f6eee7] placeholder:text-[#8a796e] focus:border-[#e07328]"
          />
          {errors.name && (
            <p className="text-[11px] text-red-400 font-medium">{errors.name}</p>
          )}
        </div>

        {/* E-mail */}
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
            placeholder="beatriz@exemplo.com"
            className="h-11 rounded-xl bg-[#140e0b] border-[#36261b] text-sm text-[#f6eee7] placeholder:text-[#8a796e] focus:border-[#e07328]"
          />
          {errors.email && (
            <p className="text-[11px] text-red-400 font-medium">{errors.email}</p>
          )}
        </div>

        {/* Senha */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#f6eee7] flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-[#e07328]" />
            Senha
          </label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Mínimo 6 caracteres"
            className="h-11 rounded-xl bg-[#140e0b] border-[#36261b] text-sm text-[#f6eee7] placeholder:text-[#8a796e] focus:border-[#e07328]"
          />
          {errors.password && (
            <p className="text-[11px] text-red-400 font-medium">{errors.password}</p>
          )}
        </div>

        {/* Perfil: Colecionador vs Criador */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-semibold text-[#f6eee7]">
            Tipo de Perfil
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setFormData((prev) => ({ ...prev, role: 'collector' }))}
              className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 cursor-pointer text-center transition-all ${
                formData.role === 'collector'
                  ? 'border-[#e07328] bg-[#e07328]/15 text-[#f5a267]'
                  : 'border-[#36261b] bg-[#140e0b] text-[#a49386] hover:bg-[#261c15]'
              }`}
            >
              <Shield className="h-5 w-5 mb-1 text-[#e07328]" />
              <span className="text-xs font-bold text-[#f6eee7]">Colecionador</span>
              <span className="text-[10px] text-[#8a796e] mt-0.5">Comprar e colecionar</span>
            </div>

            <div
              onClick={() => setFormData((prev) => ({ ...prev, role: 'creator' }))}
              className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 cursor-pointer text-center transition-all ${
                formData.role === 'creator'
                  ? 'border-[#e07328] bg-[#e07328]/15 text-[#f5a267]'
                  : 'border-[#36261b] bg-[#140e0b] text-[#a49386] hover:bg-[#261c15]'
              }`}
            >
              <Palette className="h-5 w-5 mb-1 text-[#e07328]" />
              <span className="text-xs font-bold text-[#f6eee7]">Criador / Artista</span>
              <span className="text-[10px] text-[#8a796e] mt-0.5">Listar e monetizar</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full gap-2 py-6 text-sm font-bold bg-[#e07328] hover:bg-[#ea8238] text-white shadow-xl shadow-black/40 rounded-xl mt-4"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Criando sua Conta...</span>
            </>
          ) : (
            <>
              <span>Cadastrar na Kurio</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-xs text-[#a49386]">
        <span>Já tem uma conta cadastrada? </span>
        <Link
          to="/auth/login"
          className="font-bold text-[#e07328] hover:underline hover:text-[#ea8238]"
        >
          Fazer Login
        </Link>
      </div>
    </div>
  );
}

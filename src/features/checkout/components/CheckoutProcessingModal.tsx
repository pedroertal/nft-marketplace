import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface CheckoutProcessingModalProps {
  open: boolean;
}

export function CheckoutProcessingModal({ open }: CheckoutProcessingModalProps) {
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    if (!open) {
      setStep(1);
      return;
    }

    const t1 = setTimeout(() => setStep(2), 700);
    const t2 = setTimeout(() => setStep(3), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md text-center py-8">
        <DialogHeader className="items-center">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-2xl shadow-purple-500/25">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
              <Sparkles className="h-8 w-8 text-cyan-300" />
            </div>
          </div>

          <DialogTitle className="text-xl font-extrabold text-white pt-3">
            Processando Transação Web3
          </DialogTitle>
          <DialogDescription className="text-xs">
            Por favor, mantenha esta janela aberta enquanto liquidamos seu pedido.
          </DialogDescription>
        </DialogHeader>

        {/* Steps */}
        <div className="space-y-4 pt-4 text-left max-w-xs mx-auto">
          {/* Passo 1 */}
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <Loader2 className="h-5 w-5 text-purple-400 animate-spin shrink-0" />
            )}
            <span
              className={`text-xs font-medium ${
                step >= 1 ? 'text-white' : 'text-muted-foreground'
              }`}
            >
              Assinando transação com a carteira
            </span>
          </div>

          {/* Passo 2 */}
          <div className="flex items-center gap-3">
            {step > 2 ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : step === 2 ? (
              <Loader2 className="h-5 w-5 text-cyan-400 animate-spin shrink-0" />
            ) : (
              <div className="h-5 w-5 rounded-full border border-white/20 shrink-0" />
            )}
            <span
              className={`text-xs font-medium ${
                step >= 2 ? 'text-white' : 'text-muted-foreground'
              }`}
            >
              Validando chave de idempotência e cotação
            </span>
          </div>

          {/* Passo 3 */}
          <div className="flex items-center gap-3">
            {step === 3 ? (
              <Loader2 className="h-5 w-5 text-emerald-400 animate-spin shrink-0" />
            ) : (
              <div className="h-5 w-5 rounded-full border border-white/20 shrink-0" />
            )}
            <span
              className={`text-xs font-medium ${
                step === 3 ? 'text-white' : 'text-muted-foreground'
              }`}
            >
              Registrando contrato e gerando recibo
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-4 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Garantia de liquidação atômica e proteção contra front-running</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

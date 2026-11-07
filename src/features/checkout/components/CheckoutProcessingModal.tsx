import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface CheckoutProcessingModalProps {
  open: boolean;
  step: 'SIGNING' | 'BROADCASTING' | 'CONFIRMING' | 'SUCCESS' | 'ERROR';
  errorMessage?: string;
}

export function CheckoutProcessingModal({
  open,
  step,
  errorMessage,
}: CheckoutProcessingModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md p-6 text-center space-y-6 sm:rounded-3xl bg-[#1d1510] border-[#3e2c20]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold text-[#f6eee7] flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#e07328]" />
            Processando Transação Blockchain
          </DialogTitle>
          <DialogDescription className="text-xs text-[#a49386]">
            Garantia de idempotência ativa. Não recarregue a página enquanto o bloco é minerado.
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="py-4 space-y-5">
          {step !== 'ERROR' && step !== 'SUCCESS' && (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e07328]/15 border border-[#e07328]/30">
              <Loader2 className="h-8 w-8 text-[#e07328] animate-spin" />
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          )}

          {step === 'ERROR' && (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertCircle className="h-8 w-8" />
            </div>
          )}

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#f6eee7]">
              {step === 'SIGNING' && 'Assinando Requisição Criptográfica...'}
              {step === 'BROADCASTING' && 'Propagando Transação para o Mempool...'}
              {step === 'CONFIRMING' && 'Aguardando Confirmações de Bloco...'}
              {step === 'SUCCESS' && 'Liquidação Concluída com Sucesso!'}
              {step === 'ERROR' && 'Falha na Transação'}
            </h4>
            <p className="text-xs text-[#a49386]">
              {step === 'SIGNING' && 'Validando chaves de segurança e chave de idempotência.'}
              {step === 'BROADCASTING' && 'Submetendo hash para mineradores na rede Ethereum.'}
              {step === 'CONFIRMING' && 'A transação foi incluída no bloco mais recente.'}
              {step === 'SUCCESS' && 'Redirecionando para o recibo do seu pedido...'}
              {step === 'ERROR' && (errorMessage || 'Ocorreu um erro ao processar a liquidação.')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

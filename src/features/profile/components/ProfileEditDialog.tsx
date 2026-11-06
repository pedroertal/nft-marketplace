import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUpdateProfile } from '../api/useUpdateProfile';
import { User } from '@/types/entities';
import { User as UserIcon, Loader2, Sparkles } from 'lucide-react';

interface ProfileEditDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({
  user,
  open,
  onOpenChange,
}: ProfileEditDialogProps) {
  const updateProfileMutation = useUpdateProfile();

  const [name, setName] = React.useState(user.name);
  const [bio, setBio] = React.useState(user.bio || '');
  const [avatar, setAvatar] = React.useState(user.avatar || '');

  React.useEffect(() => {
    setName(user.name);
    setBio(user.bio || '');
    setAvatar(user.avatar || '');
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(
      {
        name,
        bio,
        avatar,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <UserIcon className="h-5 w-5 text-purple-400" />
            Editar Perfil
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Nome de Exibição
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pedro Ramos"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Biografia
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Fale um pouco sobre suas coleções..."
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              URL do Avatar
            </label>
            <Input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full gap-2 py-5 font-semibold mt-2"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Salvar Alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

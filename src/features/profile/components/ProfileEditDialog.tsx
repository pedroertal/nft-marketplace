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
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({
  user,
  open,
  onOpenChange,
}: ProfileEditDialogProps) {
  const updateProfileMutation = useUpdateProfile();

  const [name, setName] = React.useState(user?.name || '');
  const [bio, setBio] = React.useState(user?.bio || '');
  const [avatar, setAvatar] = React.useState(user?.avatar || '');

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
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
      <DialogContent className="max-w-md bg-[#1d1510] border-[#3e2c20]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-[#f6eee7]">
            <UserIcon className="h-5 w-5 text-[#e07328]" />
            Editar Perfil
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#a49386]">
              Nome de Exibição
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Pedro Ramos"
              required
              className="bg-[#140e0b] border-[#36261b] text-[#f6eee7] focus:border-[#e07328]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#a49386]">
              Biografia
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Fale um pouco sobre suas coleções..."
              className="w-full rounded-xl border border-[#36261b] bg-[#140e0b] p-3 text-sm text-[#f6eee7] placeholder:text-[#8a796e] focus:outline-none focus:border-[#e07328]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#a49386]">
              URL do Avatar
            </label>
            <Input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="bg-[#140e0b] border-[#36261b] text-[#f6eee7] focus:border-[#e07328]"
            />
          </div>

          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full gap-2 py-5 font-bold mt-2 bg-[#e07328] hover:bg-[#ea8238] text-white"
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

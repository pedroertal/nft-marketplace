import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#e07328]/15 text-[#f5a267] border-[#e07328]/30',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 border-[#3d2a1e]',
        destructive:
          'border-transparent bg-destructive/20 text-red-300 border-red-500/30',
        outline:
          'text-foreground border-[#3a291e]',
        neon:
          'border-[#e07328]/40 bg-[#e07328]/15 text-[#f6ae78] shadow-sm shadow-orange-950/20',
        success:
          'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-primary hover:bg-[#ea8238] text-white shadow-md shadow-black/40 border border-[#e07328]/30 font-semibold',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline:
          'border border-[#38261b] bg-[#1a130f]/80 hover:bg-[#281d16] hover:border-[#e07328]/40 text-foreground backdrop-blur-sm',
        secondary:
          'bg-[#281d16] text-[#f6eee7] hover:bg-[#35251c] border border-[#3e2c20]',
        ghost:
          'hover:bg-[#281d16]/70 hover:text-foreground text-muted-foreground',
        link:
          'text-[#e07328] underline-offset-4 hover:underline hover:text-[#ea8238]',
        neon:
          'bg-[#e07328] text-white font-semibold shadow-md shadow-orange-950/40 hover:bg-[#ea8238]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6 text-base font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

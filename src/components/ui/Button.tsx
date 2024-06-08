'use client';

import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { Slot } from "@radix-ui/react-slot";
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'rounded-md inline-flex items-center justify-center text-sm font-medium transition-colors dark:hover:bg-gray-700 dark:hover:text-gray-100 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-700',
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        subtle: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
        link: 'bg-transparent underline-offset-4 hover:underline text-primary dark:text-gray-100 hover:bg-transparent hover:underline dark:hover:bg-transparent',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
      asChild?: boolean;
    }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & { customId?: string }>(
  ({ className, variant, size, asChild = false, customId, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        id={customId ?? props?.id ?? 'shadcn-button'}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

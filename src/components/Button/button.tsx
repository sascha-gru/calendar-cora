'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../app/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger' | 'destructive' | 'ghost' | 'link' | 'outline' | 'warning' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    fullWidth = false,
    disabled,
    children,
    type = 'button',
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed';
    
    const variants = {
      default: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white border border-primary-600 hover:border-primary-700 focus:ring-primary-500/50 disabled:bg-secondary-300 disabled:text-content-secondary disabled:border-border',
      primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white border border-primary-600 hover:border-primary-700 focus:ring-primary-500/50 disabled:bg-secondary-300 disabled:text-content-secondary disabled:border-border',
      secondary: 'bg-surface hover:bg-secondary-50 text-content-secondary border border-border hover:border-secondary-400 focus:ring-primary-500/50 disabled:bg-secondary-100 disabled:text-content-tertiary',
      accent: 'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white focus:ring-primary-500/50 disabled:bg-secondary-300 disabled:text-content-secondary',
      danger: 'bg-error-600 hover:bg-error-700 active:bg-error-800 text-white focus:ring-error-500/50 disabled:bg-secondary-300 disabled:text-content-secondary',
      destructive: 'bg-error-600 hover:bg-error-700 active:bg-error-800 text-white focus:ring-error-500/50 disabled:bg-secondary-300 disabled:text-content-secondary',
      error: 'bg-error-600 hover:bg-error-700 active:bg-error-800 text-white focus:ring-error-500/50 disabled:bg-secondary-300 disabled:text-content-secondary',
      ghost: 'hover:bg-secondary-100 text-content-secondary hover:text-content focus:ring-primary-500/50 disabled:text-content-tertiary',
      link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500/50 disabled:text-content-tertiary',
      outline: 'border border-border bg-surface hover:bg-secondary-50 text-content-secondary focus:ring-primary-500/50 disabled:bg-secondary-100 disabled:text-content-tertiary',
      warning: 'bg-warning-500 hover:bg-warning-600 active:bg-warning-700 text-white focus:ring-warning-500/50 disabled:bg-secondary-300 disabled:text-content-secondary',
      success: 'bg-success-600 hover:bg-success-700 active:bg-success-800 text-white focus:ring-success-500/50 disabled:bg-secondary-300 disabled:text-content-secondary'
    };
    
    const sizes = {
      sm: 'text-sm px-3 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-lg',
      lg: 'text-base px-6 py-3 rounded-lg',
      icon: 'p-2 rounded-lg'
    };
    
    return (
      <button
        ref={ref}
        type={type} 
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
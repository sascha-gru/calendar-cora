'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../app/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    error, 
    success, 
    helperText, 
    label, 
    required, 
    id, 
    type,
    showPasswordToggle = true,
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const isPasswordType = type === 'password';
    const shouldShowToggle = isPasswordType && showPasswordToggle && !disabled;
    const inputType = isPasswordType && showPassword ? 'text' : type;
    
    const inputStyles = cn(
      'w-full px-3 py-2 border rounded-lg transition-all duration-200',
      'placeholder-secondary-400 text-content',
      'focus:outline-none focus:ring-1 focus:ring-offset-0',
      'disabled:bg-secondary-50 disabled:text-content-secondary disabled:cursor-not-allowed',
      {
        'border-border focus:border-primary-500 focus:ring-primary-500/30': !error && !success,
        'border-error-300 focus:border-error-500 focus:ring-error-500/30': error,
        'border-success-300 focus:border-success-500 focus:ring-success-500/30': success,
        'pr-10': shouldShowToggle,
      },
      className
    );
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-content-secondary mb-1"
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputStyles}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            disabled={disabled}
            {...props}
          />
          {shouldShowToggle && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-secondary transition-colors focus:outline-none focus:text-content-secondary"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        {helperText && (
          <p 
            id={`${inputId}-helper`}
            className={cn(
              'mt-1 text-sm',
              {
                'text-error-600': error,
                'text-success-600': success,
                'text-content-secondary': !error && !success,
              }
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
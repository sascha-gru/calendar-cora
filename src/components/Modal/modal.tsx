'use client';

import { Fragment, ReactNode, useEffect } from 'react';
import { cn } from '../../app/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          className={cn(
            'relative transform overflow-hidden rounded-xl bg-surface text-left shadow-xl transition-all',
            'w-full',
            sizeClasses[size]
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-content">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-content-secondary">
                    {description}
                  </p>
                )}
              </div>
              {/* {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-4 rounded-lg p-1 text-content-tertiary hover:bg-secondary-100 hover:text-content-secondary transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              )} */}
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ModalFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('flex items-center justify-end gap-3 pt-4 mt-6 border-t border-border', className)}>
      {children}
    </div>
  );
}
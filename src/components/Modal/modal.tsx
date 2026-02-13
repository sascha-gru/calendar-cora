'use client';

import { Fragment, ReactNode, useEffect } from 'react';
import { Transition, TransitionChild } from '@headlessui/react';
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

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          {/* Overlay mit Fade-Animation */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={closeOnOverlayClick ? onClose : undefined}
              aria-hidden="true"
            />
          </TransitionChild>

          {/* Modal mit Scale- und Fade-Animation */}
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={cn(
                'relative transform overflow-hidden rounded-xl bg-surface text-left shadow-xl',
                'w-full transition-[max-width] duration-100 ease-out',
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
                </div>
              )}

              {/* Content */}
              <div className="px-6 pb-6">{children}</div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Transition>
  );
}

export function ModalFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('flex items-center justify-end gap-3 pt-4 mt-6 border-t border-border', className)}>
      {children}
    </div>
  );
}

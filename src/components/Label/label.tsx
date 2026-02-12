import * as React from 'react';
import { cn } from '../../app/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  error?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, error, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block text-sm font-medium leading-6',
          error ? 'text-error-600' : 'text-secondary-700',
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-error-600" aria-label="required">
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };
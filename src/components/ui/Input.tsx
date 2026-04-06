import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-label uppercase tracking-widest text-on-surface-variant ml-1 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-base">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-transparent border-0 border-b border-outline-variant/30',
              'py-3 px-1 text-on-surface font-body text-sm',
              'placeholder:text-outline-variant',
              'focus:ring-0 focus:outline-none focus:border-primary focus:bg-surface-container-low',
              'transition-all duration-200',
              icon && 'pl-10',
              error && 'border-error',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-error mt-1 ml-1 font-label">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

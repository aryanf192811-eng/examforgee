import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  trailing?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, trailing, fullWidth = true, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-label-lg text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">
              {icon}
            </span>
          )}
          <motion.input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-surface-container text-on-surface font-body text-body-md',
              'rounded-xl px-4 py-3 outline-none',
              'transition-all duration-200 spring-transition',
              'placeholder:text-outline',
              'focus:bg-surface-container-high focus:ring-2 focus:ring-primary/30',
              icon ? 'pl-10' : '',
              trailing ? 'pr-10' : '',
              error ? 'ring-2 ring-error/40' : '',
              className
            )}
            {...props}
          />
          {trailing && (
            <div className="absolute right-3 flex items-center">
              {trailing}
            </div>
          )}
        </div>
        {error && (
          <span className="text-label-md text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

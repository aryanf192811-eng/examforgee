import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon = 'inbox', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">
        {icon}
      </span>
      <h3 className="font-headline text-lg font-semibold text-on-surface mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-on-surface-variant max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

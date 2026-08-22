import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are currently no items to display.',
  action,
  icon,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 text-center rounded-2xl my-4"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <div
        className="p-3 rounded-2xl mb-3"
        style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}
      >
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h4>
      <p className="text-xs max-w-sm mt-1 mb-4" style={{ color: 'var(--text-muted)' }}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

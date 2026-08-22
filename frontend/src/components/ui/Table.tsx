import React from 'react';

export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div
    className="w-full overflow-x-auto rounded-2xl overflow-hidden"
    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
  >
    <table className={`w-full text-left border-collapse ${className}`}>{children}</table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead
    className="text-xs font-semibold uppercase tracking-wider"
    style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}
  >
    {children}
  </thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="text-sm" style={{ color: 'var(--text-primary)' }}>{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = '',
  onClick,
}) => (
  <tr
    onClick={onClick}
    className={`nx-table-row transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    style={{ borderBottom: '1px solid var(--border-muted)' }}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th className={`px-4 py-3.5 font-semibold ${className}`} style={{ color: 'var(--text-muted)', fontSize: 11 }}>{children}</th>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`px-4 py-3.5 ${className}`}>{children}</td>
);

import React from 'react';

export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className="w-full overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/60">
    <table className={`w-full text-left border-collapse ${className}`}>{children}</table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
    {children}
  </thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = '',
  onClick,
}) => (
  <tr
    onClick={onClick}
    className={`transition-colors hover:bg-slate-800/40 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th className={`px-4 py-3.5 font-semibold text-slate-300 ${className}`}>{children}</th>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th className={`px-4 py-3.5 font-normal text-slate-300 ${className}`}>{children}</th>
);

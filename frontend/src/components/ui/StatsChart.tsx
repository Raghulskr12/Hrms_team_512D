'use client';

import React from 'react';

/* ============================================================
   DONUT CHART
   ============================================================ */
interface DonutSlice { value: number; color: string; label: string; }
interface DonutChartProps {
  slices: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  slices, size = 160, strokeWidth = 18,
  centerLabel, centerValue, className = '',
}) => {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  let offset = 0;

  const arcs = slices.map((sl) => {
    const pct = total > 0 ? sl.value / total : 0;
    const dash = pct * circ;
    const rotation = (offset / (total || 1)) * 360 - 90;
    offset += sl.value;
    return { ...sl, dash, gap: circ - dash, rotation };
  });

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="drop-shadow-md">
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="var(--bg-elevated)" strokeWidth={strokeWidth}/>
        {total === 0
          ? <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={strokeWidth}/>
          : arcs.map((arc, i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                stroke={arc.color} strokeWidth={strokeWidth}
                strokeDasharray={`${arc.dash} ${arc.gap}`}
                strokeLinecap="round"
                transform={`rotate(${arc.rotation} ${cx} ${cy})`}
                style={{ transition: 'stroke-dasharray 0.6s ease', filter: `drop-shadow(0 0 4px ${arc.color}55)` }}
              />
            ))}
      </svg>
      {(centerValue !== undefined || centerLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue !== undefined && (
            <span className="text-2xl font-bold font-mono leading-none"
              style={{ color: 'var(--text-primary)' }}>{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-[10px] font-medium mt-0.5 text-center leading-tight"
              style={{ color: 'var(--text-muted)' }}>{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export const DonutLegend: React.FC<{ slices: DonutSlice[]; total: number }> = ({ slices, total }) => (
  <div className="space-y-2">
    {slices.map((sl, i) => {
      const pct = total > 0 ? Math.round((sl.value / total) * 100) : 0;
      return (
        <div key={i} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: sl.color, boxShadow: `0 0 6px ${sl.color}60` }}/>
            <span className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{sl.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{sl.value}</span>
            <span className="text-[10px] w-8 text-right" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
          </div>
        </div>
      );
    })}
  </div>
);

/* ============================================================
   IMPROVED BAR CHART — vertical bars with labels and grid
   ============================================================ */
interface BarData { label: string; value: number; color?: string; }
interface BarChartProps {
  data: BarData[];
  height?: number;
  className?: string;
  unit?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data, height = 160, className = '', unit = '',
}) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const gridLines = 4;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-3 items-end" style={{ height }}>
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-full pb-6 flex-shrink-0">
          {Array.from({ length: gridLines + 1 }, (_, i) => (
            <span key={i} className="text-[9px] font-mono text-right w-8"
              style={{ color: 'var(--text-muted)' }}>
              {Math.round((maxVal * (gridLines - i)) / gridLines)}{unit}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative flex flex-col">
          {/* Grid lines */}
          <div className="flex-1 relative">
            {Array.from({ length: gridLines }, (_, i) => (
              <div key={i}
                className="absolute w-full border-dashed"
                style={{
                  top: `${(i / gridLines) * 100}%`,
                  borderTop: '1px dashed var(--border)',
                  opacity: 0.5,
                }}
              />
            ))}

            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-1.5 px-1">
              {data.map((d, i) => {
                const barH = maxVal > 0 ? (d.value / maxVal) * 100 : 0;
                const color = d.color || 'var(--accent)';
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group">
                    {/* Value label on hover */}
                    <div className="text-[10px] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color }}>
                      {d.value}{unit}
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full rounded-t-lg transition-all duration-500 relative overflow-hidden"
                      style={{
                        height: `${barH}%`,
                        minHeight: d.value > 0 ? 4 : 0,
                        background: `linear-gradient(180deg, ${color}, ${color}99)`,
                        boxShadow: `0 -2px 12px ${color}40`,
                      }}
                    >
                      {/* Shimmer on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity"
                        style={{ background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)', backgroundSize: '200% 100%' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis baseline */}
          <div className="h-px w-full" style={{ background: 'var(--border)' }}/>

          {/* X-axis labels */}
          <div className="flex gap-1.5 px-1 mt-2">
            {data.map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[9px] font-medium" style={{ color: 'var(--text-muted)' }}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   SPARKLINE
   ============================================================ */
interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data, width = 80, height = 32, color = 'var(--accent)', className = '',
}) => {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const areaPoints = [`0,${height}`, ...pts, `${width},${height}`].join(' ');

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <linearGradient id={`sg-${Math.random().toString(36).slice(2)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#sg-0)`}/>
      <polyline points={pts.join(' ')} fill="none" stroke={color}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color})` }}/>
      <circle cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="2" fill={color}/>
    </svg>
  );
};

/* ============================================================
   PROGRESS BAR
   ============================================================ */
interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value, max, color = 'var(--accent)', height = 6, className = '',
}) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full rounded-full overflow-hidden" style={{ height, background: 'var(--bg-elevated)' }}>
        <div className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, boxShadow: `0 0 8px ${color}60` }}/>
      </div>
    </div>
  );
};

/* ============================================================
   METRIC CARD
   ============================================================ */
interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon?: React.ReactNode;
  color?: string;
  sparkData?: number[];
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label, value, change, changePositive, icon, color = 'var(--accent)', sparkData, className = '',
}) => (
  <div
    className={`rounded-2xl p-4 hover-lift transition-all duration-200 ${className}`}
    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
  >
    <div className="flex items-start justify-between mb-3">
      {icon && (
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}>
          {icon}
        </div>
      )}
      {sparkData && <Sparkline data={sparkData} width={60} height={28} color={color}/>}
    </div>
    <p className="text-[10px] font-bold tracking-wider uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
    <p className="text-2xl font-extrabold font-mono leading-none" style={{ color: 'var(--text-primary)' }}>{value}</p>
    {change && (
      <p className="text-[10px] font-medium mt-1.5"
        style={{ color: changePositive ? 'var(--success)' : 'var(--danger)' }}>
        {changePositive ? '▲' : '▼'} {change}
      </p>
    )}
  </div>
);

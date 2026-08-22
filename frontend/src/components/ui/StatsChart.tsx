'use client';

import React from 'react';

/* ============================================================
   DONUT CHART
   ============================================================ */
interface DonutSlice {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string | number;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  slices,
  size = 160,
  strokeWidth = 18,
  centerLabel,
  centerValue,
  className = '',
}) => {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;
  const arcs = slices.map((slice) => {
    const pct = total > 0 ? slice.value / total : 0;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const rotation = (offset / (total || 1)) * 360 - 90;
    offset += slice.value;
    return { ...slice, dash, gap, rotation, pct };
  });

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="drop-shadow-md">
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(30, 45, 74, 0.8)"
          strokeWidth={strokeWidth}
        />
        {/* Slices */}
        {total === 0 ? (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(99, 102, 241, 0.15)"
            strokeWidth={strokeWidth}
          />
        ) : (
          arcs.map((arc, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform={`rotate(${arc.rotation} ${cx} ${cy})`}
              style={{
                transition: 'stroke-dasharray 0.6s ease',
                filter: `drop-shadow(0 0 4px ${arc.color}55)`,
              }}
            />
          ))
        )}
      </svg>
      {/* Center text */}
      {(centerValue !== undefined || centerLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue !== undefined && (
            <span className="text-2xl font-bold text-[#E8EDFF] font-mono leading-none">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-[10px] text-[#64748B] font-medium mt-0.5 text-center leading-tight">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   DONUT LEGEND
   ============================================================ */
interface DonutLegendProps {
  slices: DonutSlice[];
  total: number;
}

export const DonutLegend: React.FC<DonutLegendProps> = ({ slices, total }) => (
  <div className="space-y-2">
    {slices.map((slice, i) => {
      const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;
      return (
        <div key={i} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: slice.color, boxShadow: `0 0 6px ${slice.color}60` }}
            />
            <span className="text-[11px] text-[#94A3B8] truncate">{slice.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#E8EDFF] font-mono">{slice.value}</span>
            <span className="text-[10px] text-[#64748B] w-8 text-right">{pct}%</span>
          </div>
        </div>
      );
    })}
  </div>
);

/* ============================================================
   BAR CHART
   ============================================================ */
interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  height?: number;
  showValues?: boolean;
  className?: string;
  barColor?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 120,
  showValues = true,
  className = '',
  barColor = '#6366F1',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 100 / (data.length * 2 - 1);

  return (
    <div className={`w-full ${className}`}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((frac, i) => (
          <line
            key={i}
            x1="0"
            y1={height - frac * height}
            x2="100"
            y2={height - frac * height}
            stroke="rgba(30, 45, 74, 0.6)"
            strokeWidth="0.5"
          />
        ))}
        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.value / maxValue) * (height - 20);
          const x = i * (barWidth * 2);
          const color = d.color || barColor;
          return (
            <g key={i}>
              <rect
                x={`${x}%`}
                y={height - barH - 4}
                width={`${barWidth}%`}
                height={barH}
                rx="2"
                fill={color}
                opacity="0.85"
                style={{ filter: `drop-shadow(0 0 4px ${color}55)` }}
              />
              {showValues && d.value > 0 && (
                <text
                  x={`${x + barWidth / 2}%`}
                  y={height - barH - 7}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {d.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {/* X-axis labels */}
      <div className="flex w-full mt-1">
        {data.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] text-[#64748B]"
            style={{ width: `${100 / data.length}%` }}
          >
            {d.label}
          </div>
        ))}
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
  data,
  width = 80,
  height = 32,
  color = '#6366F1',
  className = '',
}) => {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');

  // Build filled area
  const areaPoints = [
    `0,${height}`,
    ...points,
    `${width},${height}`,
  ].join(' ');

  return (
    <svg width={width} height={height} className={className}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#sg-${color.replace('#', '')})`}
      />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}88)` }}
      />
      {/* Last point dot */}
      <circle
        cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="2"
        fill={color}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
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
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  color = '#6366F1',
  height = 6,
  showLabel = false,
  className = '',
}) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`w-full ${className}`}>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, background: 'rgba(30, 45, 74, 0.8)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#64748B]">{value} used</span>
          <span className="text-[10px] text-[#64748B]">{max} total</span>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   METRIC CARD (inline widget)
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
  label,
  value,
  change,
  changePositive,
  icon,
  color = '#6366F1',
  sparkData,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#0F1629] border border-[#1E2D4A] rounded-2xl p-4 hover:border-indigo-500/30 transition-all duration-200 hover-lift ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && (
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
              <span style={{ color }}>{icon}</span>
            </div>
          )}
        </div>
        {sparkData && (
          <Sparkline data={sparkData} width={60} height={28} color={color} />
        )}
      </div>

      <div className="mt-1">
        <p className="text-[10px] font-bold tracking-wider text-[#64748B] uppercase mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-[#E8EDFF] font-mono leading-none">{value}</p>
        {change && (
          <p className={`text-[10px] font-medium mt-1.5 ${changePositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {changePositive ? '▲' : '▼'} {change}
          </p>
        )}
      </div>
    </div>
  );
};

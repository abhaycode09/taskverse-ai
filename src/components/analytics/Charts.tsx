import React from 'react';
import { ProductivityMetric } from '../../types';

// 1. Line Chart: Velocity & Productivity Score over 7 Days
export const VelocityLineChart: React.FC<{ metrics: ProductivityMetric[] }> = ({ metrics }) => {
  const points = metrics.map((m, idx) => {
    const x = 30 + idx * 60;
    const y = 140 - (m.score / 100) * 110;
    return { x, y, score: m.score, date: m.date.split('-')[2] };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 420 160" className="w-full h-44 overflow-visible">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[30, 65, 100, 135].map((y) => (
          <line
            key={y}
            x1="20"
            y1={y}
            x2="400"
            y2={y}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeDasharray="4 4"
          />
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#areaGrad)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#060813"
              stroke="#06b6d4"
              strokeWidth="2.5"
              className="group-hover:r-6 transition-all shadow-[0_0_8px_#06b6d4]"
            />
            <text
              x={p.x}
              y="158"
              textAnchor="middle"
              className="fill-slate-500 text-[9px] font-mono"
            >
              Day {p.date}
            </text>
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              className="fill-cyan-300 text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {p.score}%
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// 2. Bar Chart: Focus Hours per Domain Category
export const CategoryBarChart: React.FC = () => {
  const data = [
    { label: 'Coding', hours: 42.5, color: 'from-cyan-500 to-blue-600' },
    { label: 'Study', hours: 28.0, color: 'from-purple-500 to-indigo-600' },
    { label: 'College', hours: 22.5, color: 'from-blue-500 to-sky-600' },
    { label: 'Gym', hours: 14.0, color: 'from-rose-500 to-red-600' },
    { label: 'Finance', hours: 9.5, color: 'from-emerald-500 to-teal-600' },
    { label: 'Health', hours: 12.0, color: 'from-amber-500 to-orange-600' },
  ];

  const maxHours = Math.max(...data.map((d) => d.hours));

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percent = Math.round((item.hours / maxHours) * 100);

        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">{item.label}</span>
              <span className="font-mono text-slate-400">{item.hours} hrs</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${item.color} shadow-sm transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 3. 6-Axis Productivity Mastery Radar Chart
export const ProductivityRadarChart: React.FC = () => {
  // 6 dimensions: Focus, Consistency, Velocity, Balance, Resilience, Energy
  const axes = [
    { label: 'Focus', value: 92, angle: 0 },
    { label: 'Consistency', value: 95, angle: 60 },
    { label: 'Velocity', value: 88, angle: 120 },
    { label: 'Balance', value: 80, angle: 180 },
    { label: 'Resilience', value: 85, angle: 240 },
    { label: 'Energy', value: 90, angle: 300 },
  ];

  const cx = 100;
  const cy = 100;
  const maxRadius = 75;

  const getCoordinates = (angle: number, value: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    const r = (value / 100) * maxRadius;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const points = axes.map((a) => getCoordinates(a.angle, a.value));
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-52 h-52 overflow-visible">
        <defs>
          <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Outer polygons */}
        {[0.33, 0.66, 1].map((scale, i) => {
          const ringPoints = axes
            .map((a) => getCoordinates(a.angle, scale * 100))
            .map((p) => `${p.x},${p.y}`)
            .join(' ');
          return (
            <polygon
              key={i}
              points={ringPoints}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines */}
        {axes.map((a, i) => {
          const end = getCoordinates(a.angle, 100);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255, 255, 255, 0.1)"
            />
          );
        })}

        {/* Filled polygon */}
        <polygon
          points={polygonPoints}
          fill="url(#radarGrad)"
          stroke="#06b6d4"
          strokeWidth="2"
        />

        {/* Points & Labels */}
        {axes.map((a, i) => {
          const p = points[i];
          const labelCoord = getCoordinates(a.angle, 118);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1" />
              <text
                x={labelCoord.x}
                y={labelCoord.y + 3}
                textAnchor="middle"
                className="fill-slate-400 text-[8px] font-mono uppercase font-bold"
              >
                {a.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 4. Donut Priority Distribution Chart
export const PriorityDonutChart: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className="relative flex items-center justify-center w-28 h-28">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {/* Critical (30%) */}
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="3.5"
            strokeDasharray="30 70"
            strokeDashoffset="0"
          />
          {/* High (35%) */}
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeDasharray="35 65"
            strokeDashoffset="-30"
          />
          {/* Medium (25%) */}
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3.5"
            strokeDasharray="25 75"
            strokeDashoffset="-65"
          />
          {/* Low (10%) */}
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="#64748b"
            strokeWidth="3.5"
            strokeDasharray="10 90"
            strokeDashoffset="-90"
          />
        </svg>

        <div className="absolute text-center">
          <span className="block text-sm font-extrabold text-white font-mono">100%</span>
          <span className="text-[8px] text-slate-400 uppercase font-mono">Load</span>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-300">Critical (30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-300">High (35%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span className="text-slate-300">Medium (25%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span className="text-slate-400">Low (10%)</span>
        </div>
      </div>
    </div>
  );
};

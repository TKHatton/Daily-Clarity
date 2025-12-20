/**
 * Pattern Visualization Components
 *
 * Simple, elegant charts to visualize user patterns
 * Built with pure CSS and HTML (no external chart library needed)
 */

import React from 'react';
import { motion } from 'framer-motion';

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  maxValue?: number;
  showPercentage?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  showPercentage = false
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="space-y-1"
        >
          <div className="flex justify-between text-sm">
            <span className="font-medium text-[#2D2D2D]">{item.label}</span>
            <span className="text-[#6B6B6B]">
              {showPercentage ? `${item.value}%` : item.value}
            </span>
          </div>
          <div className="h-8 bg-[#FAF8F5] rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / max) * 100}%` }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={`h-full ${item.color || 'bg-[#E8956B]'} rounded-lg flex items-center justify-end px-2`}
            >
              {(item.value / max) > 0.2 && (
                <span className="text-xs font-bold text-white">
                  {showPercentage ? `${item.value}%` : item.value}
                </span>
              )}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

interface DayOfWeekChartProps {
  data: Record<string, number>;
}

export const DayOfWeekChart: React.FC<DayOfWeekChartProps> = ({ data }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const max = Math.max(...Object.values(data), 1);

  return (
    <div className="flex items-end justify-between gap-2 h-48 px-4">
      {days.map((day, idx) => {
        const value = data[day] || 0;
        const height = (value / max) * 100;

        return (
          <div key={day} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="w-full bg-[#7AB8B8] rounded-t-lg min-h-[4px] relative group"
            >
              {value > 0 && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-[#2D2D2D] bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap">
                    {value} sessions
                  </span>
                </div>
              )}
            </motion.div>
            <span className="text-xs text-[#6B6B6B] font-medium">
              {day.slice(0, 3)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

interface TimeOfDayChartProps {
  data: Record<number, number>;
}

export const TimeOfDayChart: React.FC<TimeOfDayChartProps> = ({ data }) => {
  // Group hours into 4-hour blocks
  const timeBlocks = [
    { label: 'Night\n12am-4am', hours: [0, 1, 2, 3], icon: '🌙' },
    { label: 'Morning\n4am-8am', hours: [4, 5, 6, 7], icon: '🌅' },
    { label: 'Morning\n8am-12pm', hours: [8, 9, 10, 11], icon: '☀️' },
    { label: 'Afternoon\n12pm-4pm', hours: [12, 13, 14, 15], icon: '☀️' },
    { label: 'Evening\n4pm-8pm', hours: [16, 17, 18, 19], icon: '🌆' },
    { label: 'Night\n8pm-12am', hours: [20, 21, 22, 23], icon: '🌙' }
  ];

  const blockCounts = timeBlocks.map(block => ({
    ...block,
    count: block.hours.reduce((sum, hour) => sum + (data[hour] || 0), 0)
  }));

  const max = Math.max(...blockCounts.map(b => b.count), 1);

  return (
    <div className="flex items-end justify-between gap-3 h-48">
      {blockCounts.map((block, idx) => {
        const height = (block.count / max) * 100;

        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 4)}%` }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="w-full bg-[#E8956B] rounded-t-lg relative group"
            >
              {block.count > 0 && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-2xl">{block.icon}</span>
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-[#2D2D2D] bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap">
                      {block.count} sessions
                    </span>
                  </div>
                </>
              )}
            </motion.div>
            <span className="text-xs text-[#6B6B6B] text-center font-medium whitespace-pre-line leading-tight">
              {block.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  color = 'bg-[#E8956B]'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 border border-[#E5E5E5] shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${color} bg-opacity-10 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-[#6B6B6B] font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-[#2D2D2D]">{value}</p>
          {subtitle && (
            <p className="text-xs text-[#6B6B6B] mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface TrendBadgeProps {
  trend: 'increasing' | 'decreasing' | 'stable';
}

export const TrendBadge: React.FC<TrendBadgeProps> = ({ trend }) => {
  const config = {
    increasing: { icon: '📈', text: 'Increasing', color: 'bg-green-100 text-green-700' },
    decreasing: { icon: '📉', text: 'Decreasing', color: 'bg-orange-100 text-orange-700' },
    stable: { icon: '📊', text: 'Stable', color: 'bg-blue-100 text-blue-700' }
  };

  const { icon, text, color } = config[trend];

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${color}`}>
      <span>{icon}</span>
      <span>{text}</span>
    </span>
  );
};

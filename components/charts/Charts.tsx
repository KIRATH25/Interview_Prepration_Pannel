import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { useStore } from '../../lib/store';
import { cn } from '../../lib/utils';

interface ChartProps {
    className?: string;
}

export const SkillRadar = ({ className }: ChartProps) => {
  const { skills } = useStore();

  return (
    <div className={cn("h-[300px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skills}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Radar
            name="Alex"
            dataKey="A"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="#06b6d4"
            fillOpacity={0.3}
          />
          <Radar
            name="Average"
            dataKey="B"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="#8b5cf6"
            fillOpacity={0.1}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ScoreTrend = ({ className }: ChartProps) => {
  const { stats } = useStore();
  const data = stats.map(s => ({
    name: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Score: s.score,
    uv: 100
  }));

  return (
    <div className={cn("h-[250px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="name" stroke="#52525b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis stroke="#52525b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip 
             contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
             cursor={{ stroke: '#52525b', strokeWidth: 1 }}
          />
          <Area type="monotone" dataKey="Score" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TypeDistribution = ({ className }: ChartProps) => {
    const { stats } = useStore();
    // Group by type for bar chart
    const data = [
        { name: 'Coding', Score: 85 },
        { name: 'Sys Design', Score: 72 },
        { name: 'HR', Score: 90 },
    ];

    return (
        <div className={cn("h-[250px] w-full", className)}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#52525b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#52525b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                    <Bar dataKey="Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, change, trend, icon }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change} from last month
          </p>
        </div>
        <div className="text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

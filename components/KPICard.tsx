4
'use client';

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export default function KPICard({ title, value, icon, trend }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && (
          <div className="w-8 h-8 flex items-center justify-center text-red-600">
            <i className={icon}></i>
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend.positive ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className="w-4 h-4 flex items-center justify-center">
              <i className={trend.positive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}></i>
            </div>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}

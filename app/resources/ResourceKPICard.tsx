'use client';

interface ResourceKPICardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export default function ResourceKPICard({ title, value, icon, color }: ResourceKPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${color}`}>
          <i className={icon}></i>
        </div>
      </div>
      
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';

interface Resource {
  id: number;
  name: string;
  category: string;
  total: number;
  available: number;
  inUse: number;
  status: string;
  location: string;
  condition: string;
}

interface ResourceChartsProps {
  resources: Resource[];
}

const COLORS = ['#dc2626', '#16a34a', '#2563eb', '#ca8a04', '#9333ea'];

export default function ResourceCharts({ resources }: ResourceChartsProps) {
  const categoryData = resources.reduce((acc: any[], resource) => {
    const existing = acc.find(item => item.category === resource.category);
    if (existing) {
      existing.total += resource.total;
      existing.available += resource.available;
      existing.inUse += resource.inUse;
    } else {
      acc.push({
        category: resource.category,
        total: resource.total,
        available: resource.available,
        inUse: resource.inUse
      });
    }
    return acc;
  }, []);

  const statusData = resources.reduce((acc: any[], resource) => {
    const existing = acc.find(item => item.status === resource.status);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({
        status: resource.status.charAt(0).toUpperCase() + resource.status.slice(1).replace('-', ' '),
        count: 1
      });
    }
    return acc;
  }, []);

  const utilizationData = resources.map(resource => ({
    name: resource.name.split(' ').slice(0, 2).join(' '),
    utilization: Math.round((resource.inUse / resource.total) * 100),
    available: resource.available,
    inUse: resource.inUse
  }));

  const trendData = [
    { month: 'Jan', chairs: 340, fans: 45 },
    { month: 'Feb', chairs: 365, fans: 48 },
    { month: 'Mar', chairs: 365, fans: 48 },
    { month: 'Apr', chairs: 365, fans: 48 },
    { month: 'May', chairs: 365, fans: 48 },
    { month: 'Jun', chairs: 365, fans: 48 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Categories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="category" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="available" fill="#16a34a" name="Available" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inUse" fill="#dc2626" name="In Use" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="count"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-sm text-gray-600">{item.status}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilization Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={utilizationData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
            <YAxis dataKey="name" type="category" width={100} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`${value}%`, 'Utilization']}
            />
            <Bar dataKey="utilization" fill="#2563eb" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line type="monotone" dataKey="chairs" stroke="#dc2626" strokeWidth={3} dot={{ fill: '#dc2626' }} />
            <Line type="monotone" dataKey="fans" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

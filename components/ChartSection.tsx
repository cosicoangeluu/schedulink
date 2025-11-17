
'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

interface Event {
  id: number;
  name: string;
  start_date: string;
  status: string;
  created_at: string;
}

export default function ChartSection() {
  const [areaData, setAreaData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([
    { name: 'Approved', value: 0, color: '#22c55e' },
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'Declined', value: 0, color: '#ef4444' },
  ]);
  const [barData, setBarData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      // Get auth token for admin
      const token = localStorage.getItem('adminToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fetch events
      const eventsRes = await fetch(API_ENDPOINTS.events, { headers });

      const eventsData = await eventsRes.json();

      const events = Array.isArray(eventsData) ? eventsData : [];

      // Process Event Status (Pie Chart)
      const statusCounts = {
        approved: events.filter(e => e.status === 'approved').length,
        pending: events.filter(e => e.status === 'pending').length,
        declined: events.filter(e => e.status === 'declined').length,
      };

      const total = statusCounts.approved + statusCounts.pending + statusCounts.declined;
      
      if (total > 0) {
        setPieData([
          {
            name: 'Approved',
            value: Math.round((statusCounts.approved / total) * 100),
            count: statusCounts.approved,
            color: '#22c55e'
          },
          {
            name: 'Pending',
            value: Math.round((statusCounts.pending / total) * 100),
            count: statusCounts.pending,
            color: '#f59e0b'
          },
          {
            name: 'Declined',
            value: Math.round((statusCounts.declined / total) * 100),
            count: statusCounts.declined,
            color: '#ef4444'
          },
        ]);
      }

      // Process Event Trends (Area Chart) - Last 6 months
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      const trendData = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthEvents = events.filter(e => {
          const eventDate = new Date(e.start_date);
          return eventDate >= monthStart && eventDate <= monthEnd && e.status === 'approved';
        }).length;

        trendData.push({
          name: monthNames[date.getMonth()],
          events: monthEvents
        });
      }

      setAreaData(trendData);

      // Process Events by Month (Bar Chart) - Current year
      const currentYear = now.getFullYear();
      const monthlyData = monthNames.map((month, index) => {
        const monthStart = new Date(currentYear, index, 1);
        const monthEnd = new Date(currentYear, index + 1, 0);

        const count = events.filter(e => {
          const eventDate = new Date(e.start_date);
          return eventDate >= monthStart && eventDate <= monthEnd && e.status === 'approved';
        }).length;

        return {
          name: month,
          value: count
        };
      }).filter(item => item.value > 0); // Only show months with events

      setBarData(monthlyData.length > 0 ? monthlyData : [{ name: 'No Data', value: 0 }]);

    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Trends (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area type="monotone" dataKey="events" stackId="1" stroke="#b91c1c" fill="#b91c1c" fillOpacity={0.2} name="Events" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any, props: any) => [`${props.payload.count} events (${value}%)`, name]}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                <span className="text-xs text-gray-500 ml-2">({item.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Approved Events by Month (Current Year)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any) => [`${value} events`, 'Approved Events']}
            />
            <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function FinancialForecastChart({ cost, revenue }) {
  const data = [
    {
      name: 'Financial Outlook',
      Cost: cost,
      Revenue: revenue,
    }
  ];

  return (
    <div className="rounded-3xl border border-gray-200 bg-[#FFFFFF] p-6 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] w-full mt-4">
      <h3 className="text-lg font-bold text-[#1F2937] mb-6 text-left">Est. Financial Forecast</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 5,
            }}
            barGap={15}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis tick={{fill: '#6B7280', fontSize: 10}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontWeight: 600 }}
              formatter={(value) => [`₹ ${Number(value).toLocaleString('en-IN')}`, undefined]}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="Cost" fill="#FECACA" radius={[6, 6, 0, 0]} barSize={45} />
            <Bar dataKey="Revenue" fill="#A7F3D0" radius={[6, 6, 0, 0]} barSize={45} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FinancialForecastChart;

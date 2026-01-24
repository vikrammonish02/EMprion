
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { COLORS } from '../constants';

const ReportsDashboard: React.FC = () => {
  // Placeholder data for initial state - will populate as cycles are completed
  const trendData: any[] = [];
  const dispositionData: any[] = [];
  const gradeDistribution: any[] = [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clinical Performance Reports</h2>
          <p className="text-gray-500 font-medium">Analytics for Subhag Bengaluru • Last 6 Months</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button className="px-5 py-2.5 bg-[#1B7B6A] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Generate PDF
          </button>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Cumulative Success Rate', value: '0.0%', trend: '--', color: 'text-gray-400' },
          { label: 'Avg Embryos / Cycle', value: '0.0', trend: '--', color: 'text-gray-400' },
          { label: 'AI Agreement Index', value: '0.0%', trend: '--', color: 'text-gray-400' },
          { label: 'Avg Blastocyst Rate', value: '0.0%', trend: '--', color: 'text-gray-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-400`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cycle Volume Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800">Cycle & Embryo Volume Trend</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#1B7B6A]"></span> Cycles
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#7ECCC3]"></span> Embryos
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCycles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B7B6A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1B7B6A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="embryos" stroke="#7ECCC3" fillOpacity={0} strokeWidth={2} />
                <Area type="monotone" dataKey="cycles" stroke="#1B7B6A" fillOpacity={1} fill="url(#colorCycles)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disposition Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-8">Disposition Allocation</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dispositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dispositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {dispositionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-500">{item.name}</span>
                </div>
                <span className="text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Embryo Quality by Stage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontWeight: 600 }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="GradeA" stackId="a" fill="#1B7B6A" radius={[0, 0, 0, 0]} />
                <Bar dataKey="GradeB" stackId="a" fill="#7ECCC3" />
                <Bar dataKey="GradeC" stackId="a" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">Developmental arrest detected in 12% of Grade C samples on Day 5</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4">Finalized Cycles</h3>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase text-gray-400 sticky top-0">
                <tr>
                  <th className="py-3 px-4">Cycle</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr>
                  <td colSpan={3} className="py-10 text-center text-xs font-bold text-gray-300 uppercase tracking-widest">No Archived Records</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="mt-4 text-[#1B7B6A] font-bold text-xs hover:underline text-center">Download Full Archive</button>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cycle } from '../types';

interface DashboardHomeProps {
  cycles: Cycle[];
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ cycles }) => {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Active Cycles', value: cycles.length, trend: '+2 this week', icon: '⚡' },
    { label: 'Pending Assessment', value: 3, trend: 'Priority', icon: '⏳' },
    { label: 'Top Viability Average', value: '72%', trend: '+4%', icon: '📈' },
    { label: 'Embryos Scanned', value: 142, trend: 'Lifetime', icon: '🧬' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laboratory Overview</h2>
          <p className="text-gray-500 font-medium">Monitoring {cycles.length} active fertility cycles</p>
        </div>
        <button 
          onClick={() => navigate('/new-cycle')}
          className="px-6 py-3 bg-[#1B7B6A] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Register New Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl group-hover:scale-110 transition-transform">{m.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.trend.includes('+') || m.trend === 'Priority' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                {m.trend}
              </span>
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-3xl font-bold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-lg">Active Cycles</h3>
          <button className="text-[#1B7B6A] font-bold text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Cycle ID</th>
                <th className="px-6 py-4">Patient ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Embryos</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cycles.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800 mono">{c.displayId}</td>
                  <td className="px-6 py-4 font-medium text-gray-500 mono">{c.patientId}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-teal-50 text-[#1B7B6A] rounded-full text-xs font-bold">
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-bold text-gray-800">{c.embryoCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">2 hours ago</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => navigate(`/cycle/${c.id}`)}
                      className="px-4 py-2 border border-[#1B7B6A] text-[#1B7B6A] rounded-lg text-sm font-bold hover:bg-[#1B7B6A] hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      Open Analysis
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

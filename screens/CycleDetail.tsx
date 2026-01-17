
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CYCLES, MOCK_EMBRYOS, COLORS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const CycleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cycle = useMemo(() => MOCK_CYCLES.find(c => c.id === id), [id]);
  const embryos = useMemo(() => MOCK_EMBRYOS.filter(e => e.cycleId === id), [id]);

  if (!cycle) return <div>Cycle not found</div>;

  const stats = {
    gradeA: embryos.filter(e => e.gardner.icm === 'A' && e.gardner.te === 'A').length,
    gradeB: embryos.filter(e => (e.gardner.icm === 'B' || e.gardner.te === 'B') && !(e.gardner.icm === 'C' || e.gardner.te === 'C')).length,
    gradeC: embryos.filter(e => e.gardner.icm === 'C' || e.gardner.te === 'C').length,
    avgViability: Math.round(embryos.reduce((acc, curr) => acc + curr.viabilityIndex, 0) / embryos.length)
  };

  const chartData = [
    { name: 'A', count: stats.gradeA, fill: COLORS.success },
    { name: 'B', count: stats.gradeB, fill: COLORS.warning },
    { name: 'C', count: stats.gradeC, fill: COLORS.neutral },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
            <button onClick={() => navigate('/')} className="hover:text-[#1B7B6A]">Dashboard</button>
            <span>/</span>
            <span className="text-gray-600">Cycle {cycle.displayId}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Embryo Cohort Analysis</h2>
          <p className="text-gray-500 font-medium">Cycle started: {cycle.eggRetrievalDate}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Export PDF
          </button>
          <button className="px-6 py-2.5 bg-[#1B7B6A] text-white rounded-xl font-bold hover:shadow-lg transition-all">
            Approve All Top Picks
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Cohort Viability Index</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-extrabold text-gray-900">{stats.avgViability}%</p>
            <span className="text-emerald-500 text-sm font-bold pb-1">↑ +2.4%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Trending: <span className="text-[#1B7B6A] font-bold">Strong Cohort</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Grade A Distribution</p>
          <p className="text-3xl font-extrabold text-gray-900">{stats.gradeA} <span className="text-lg text-gray-400 font-medium">/ {embryos.length}</span></p>
          <p className="text-xs text-gray-500 mt-2">Optimal expansion candidates</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Anomalies Detected</p>
          <p className="text-3xl font-extrabold text-gray-900">2</p>
          <p className="text-xs text-orange-500 font-bold mt-2">Requires manual review</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Aneuploidy Risk</p>
          <p className="text-3xl font-extrabold text-gray-900">Low</p>
          <p className="text-xs text-emerald-500 font-bold mt-2">Predictive analysis stable</p>
        </div>
      </div>

      {/* Charts & Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Grade Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1B7B6A] p-6 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-lg mb-4">Clinical Interpretation</h3>
            <p className="text-sm opacity-90 leading-relaxed mb-4">
              This is a robust cohort with {stats.gradeA} embryos showing optimal kinetics. Time-lapse markers t8 and s3 indicate high developmental synchrony in the top 3 picks. 
            </p>
            <p className="text-sm opacity-90 leading-relaxed">
              Recommend proceeding with single embryo transfer (EMB-01) and vitrification of the remaining Grade A candidates.
            </p>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Embryo Ranking (By Viability Index)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Gardner</th>
                    <th className="px-6 py-4">Morphokinetic</th>
                    <th className="px-6 py-4 text-center">Viability</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {embryos.map((e, idx) => (
                    <tr key={e.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-gray-800">{idx + 1}</td>
                      <td className="px-6 py-4 font-bold text-gray-500 mono text-sm">{e.displayId}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          e.gardner.icm === 'A' ? 'bg-emerald-100 text-emerald-700' : 
                          e.gardner.icm === 'B' ? 'bg-amber-100 text-amber-700' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {e.gardner.expansion}{e.gardner.icm}{e.gardner.te}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-gray-500">Grade {idx < 5 ? 1 : idx < 10 ? 2 : 3}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-gray-800">{e.viabilityIndex}%</span>
                          <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-[#1B7B6A]" style={{ width: `${e.viabilityIndex}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          idx < 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {idx < 2 ? 'Top Pick' : 'Stable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate(`/embryo/${e.id}`)}
                          className="p-2 text-gray-400 hover:text-[#1B7B6A] transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleDetail;

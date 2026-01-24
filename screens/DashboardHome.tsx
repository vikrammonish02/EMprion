
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cycle, Patient } from '../types';

interface DashboardHomeProps {
  cycles: Cycle[];
  patients: Patient[];
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ cycles, patients }) => {
  const navigate = useNavigate();

  const stages = [
    { title: 'Ingestion & Setup', statuses: ['NEW', 'EGG_RETRIEVAL'], color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'In Processing', statuses: ['FERTILIZATION', 'ASSESSMENT'], color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Ready for Review', statuses: ['DISPOSITION'], color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Finalized', statuses: ['TRANSFER_FREEZE', 'COMPLETED'], color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const metrics = [
    { label: 'Active Projects', value: cycles.length, trend: '--', icon: '⚡' },
    { label: 'Review Required', value: cycles.filter(c => c.status === 'ASSESSMENT').length, trend: '--', icon: '⏳' },
    { label: 'Avg Viability', value: cycles.length > 0 ? '0%' : '0%', trend: '--', icon: '📈' },
    { label: 'Total Embryos', value: cycles.reduce((acc, c) => acc + (c.embryoCount || 0), 0), trend: '--', icon: '🧬' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Clinical Worklist</h2>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {cycles.length} Projects in Pipeline • Subhag Laboratory
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Patient ID..."
              className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#1B7B6A] transition-all text-sm w-64"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button
            onClick={() => navigate('/new-cycle')}
            className="px-6 py-3 bg-[#1B7B6A] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl group-hover:scale-110 transition-transform">{m.icon}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${m.trend.includes('+') || m.trend === 'Priority' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
                {m.trend}
              </span>
            </div>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{m.label}</p>
            <p className="text-2xl font-black text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        {cycles.length === 0 ? (
          <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">No Projects in Pipeline</h3>
              <p className="text-gray-400 max-w-sm mx-auto mt-2 font-medium">Start a new clinical project to begin AI-assisted embryo assessment and cohort analysis.</p>
            </div>
            <button
              onClick={() => navigate('/new-cycle')}
              className="px-8 py-3 bg-[#1B7B6A] text-white rounded-xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create First Project
            </button>
          </div>
        ) : (
          stages.map(stage => {
            const stageCycles = cycles.filter(c => stage.statuses.includes(c.status));
            if (stageCycles.length === 0) return null;

            return (
              <div key={stage.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${stage.bg} ${stage.color} rounded-lg flex items-center justify-center font-black text-sm`}>
                    {stageCycles.length}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{stage.title}</h3>
                  <div className="flex-1 h-px bg-gray-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stageCycles.map(c => (
                    <div
                      key={c.id}
                      onClick={() => navigate(`/cycle/${c.id}`)}
                      className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{c.displayId}</p>
                          {(() => {
                            const patient = patients.find(p => p.id === c.patientId);
                            return (
                              <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-[#1B7B6A] transition-colors">{patient?.partner1.name || 'Unknown Patient'}</h4>
                                <p className="text-xs text-gray-500 font-medium">{patient?.displayId}</p>
                              </div>
                            );
                          })()}
                        </div>
                        <span className={`px-3 py-1 ${stage.bg} ${stage.color} rounded-full text-[10px] font-black uppercase tracking-wider`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Embryos</p>
                          <p className="text-lg font-black text-gray-800">{c.embryoCount}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Viability</p>
                          <p className="text-lg font-black text-emerald-600">74%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-gray-400">Analysis Progress</span>
                          <span className="text-gray-900">{stage.title === 'Finalized' ? '100%' : '65%'}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${stage.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: stage.title === 'Finalized' ? '100%' : '65%' }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DashboardHome;

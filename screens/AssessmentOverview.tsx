
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_EMBRYOS, MOCK_CYCLES } from '../constants';

const AssessmentOverview: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('PENDING');

  // Filter embryos based on status
  const assessments = MOCK_EMBRYOS.filter(e => filter === 'ALL' || e.status === filter);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Embryologist Worklist</h2>
          <p className="text-gray-500 font-medium">Focusing on {assessments.length} embryos requiring verification</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          {(['ALL', 'PENDING', 'COMPLETED'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                filter === opt ? 'bg-[#1B7B6A] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assessments.map((e) => {
          const cycle = MOCK_CYCLES.find(c => c.id === e.cycleId);
          return (
            <div 
              key={e.id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden group"
              onClick={() => navigate(`/embryo/${e.id}`)}
            >
              <div className="aspect-video relative overflow-hidden bg-gray-900">
                <img 
                  src={`https://picsum.photos/seed/${e.id}/400/225`} 
                  alt="Embryo Preview" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white font-bold uppercase mono border border-white/30">
                  {cycle?.displayId}
                </div>
                {e.status === 'PENDING' && (
                  <div className="absolute inset-0 bg-emerald-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-4 py-2 bg-[#1B7B6A] text-white font-bold rounded-xl shadow-2xl">Start Analysis</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mono">{e.displayId}</h4>
                    <p className="text-xs text-gray-400">Last scanned 12m ago</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Viability Index</p>
                    <p className={`text-lg font-black ${e.viabilityIndex > 70 ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {e.viabilityIndex}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                   <div className="flex-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">AI Confidence</p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${e.confidence}%` }}></div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Grade</span>
                      <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#1B7B6A] border border-emerald-100">
                        {e.gardner.icm}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default AssessmentOverview;

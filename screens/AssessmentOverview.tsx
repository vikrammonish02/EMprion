
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_EMBRYOS, MOCK_CYCLES } from '../constants';
import { Embryo, Cycle } from '../types';

interface AssessmentOverviewProps {
  embryos: Embryo[];
  cycles: Cycle[];
}

const AssessmentOverview: React.FC<AssessmentOverviewProps> = ({ embryos, cycles }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('PENDING');

  // Filter embryos based on status
  const assessments = (embryos || MOCK_EMBRYOS).filter(e => filter === 'ALL' || e.status === filter);

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
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === opt ? 'bg-[#1B7B6A] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assessments.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto transition-transform hover:scale-110">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Worklist Empty</p>
            <p className="text-gray-900 font-bold max-w-xs mx-auto text-lg leading-tight">No embryos currently require verification</p>
          </div>
        ) : (

          assessments.map((e) => (
            <EmbryoCard key={e.id} embryo={e} cycles={cycles || MOCK_CYCLES} navigate={navigate} />
          ))
        )}
      </div>
    </div>
  );
};

// Sub-component to handle Blob URL lifecycle correctly
const EmbryoCard: React.FC<{ embryo: Embryo, cycles: Cycle[], navigate: (path: string) => void }> = ({ embryo, cycles, navigate }) => {
  const cycle = cycles.find(c => c.id === embryo.cycleId);

  const mediaUrl = React.useMemo(() => {
    if (embryo.file) {
      return URL.createObjectURL(embryo.file);
    }
    // Fallback only if no file exists (shouldn't happen for new uploads)
    return 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?q=80&w=400&auto=format&fit=crop';
  }, [embryo.file]);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden group"
      onClick={() => navigate(`/embryo/${embryo.id}`)}
    >
      <div className="aspect-video relative overflow-hidden bg-gray-900">
        {embryo.assetType === 'VIDEO' ? (
          <video
            src={mediaUrl}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            muted
            loop
            playsInline
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => e.currentTarget.pause()}
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Embryo Preview"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          />
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] text-white font-bold uppercase mono border border-white/30">
            {cycle?.displayId}
          </div>
          <div className={`px-2 py-1 rounded-lg text-[10px] text-white font-bold uppercase border border-white/30 backdrop-blur-md ${embryo.assetType === 'VIDEO' ? 'bg-blue-500/40' : 'bg-emerald-500/40'}`}>
            {embryo.assetType}
          </div>
        </div>
        {embryo.assetType === 'VIDEO' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-2xl pointer-events-none">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5v13L16.5 10 4.5 3.5z" /></svg>
          </div>
        )}
        {embryo.status === 'PENDING' && (
          <div className="absolute inset-0 bg-emerald-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-4 py-2 bg-[#1B7B6A] text-white font-bold rounded-xl shadow-2xl">Start {embryo.analysisModel} Analysis</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-gray-900 mono">{embryo.displayId}</h4>
            <p className="text-xs text-gray-400">Last scanned 12m ago</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase">Viability Index</p>
            <p className={`text-lg font-black ${embryo.viabilityIndex > 70 ? 'text-emerald-600' : 'text-amber-500'}`}>
              {embryo.viabilityIndex}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">AI Confidence</p>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${embryo.confidence}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Grade</span>
            <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-[#1B7B6A] border border-emerald-100">
              {embryo.gardner?.icm || '-'}
            </span>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AssessmentOverview;

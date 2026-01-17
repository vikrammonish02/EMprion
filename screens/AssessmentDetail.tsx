
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_EMBRYOS, COLORS } from '../constants';
// Import Disposition from types.ts where it is defined
import { Disposition } from '../types';

const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [disposition, setDisposition] = useState<Disposition | undefined>();
  const embryo = useMemo(() => MOCK_EMBRYOS.find(e => e.id === id), [id]);

  if (!embryo) return <div>Embryo not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#1B7B6A] font-bold hover:underline">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Cycle View
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-500 font-bold rounded-lg text-sm hover:bg-gray-50">Flag for Review</button>
          <button className="px-4 py-2 bg-[#1B7B6A] text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg transition-all">Download Frame Log</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Analysis Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                AI Visual Segmentation
              </h3>
              <span className="text-xs font-bold text-gray-400 mono">FRAME 1042 / DAY 5</span>
            </div>
            <div className="relative aspect-square bg-black">
              <img 
                src={`https://picsum.photos/seed/${embryo.id}/800/800`} 
                alt="Embryo analysis" 
                className="w-full h-full object-cover opacity-80"
              />
              {/* Mock Heatmap Overlays */}
              <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2 border-[#1B7B6A] rounded-full bg-[#1B7B6A]/20 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white bg-[#1B7B6A] px-1 rounded">ICM A</span>
              </div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-24 border-2 border-emerald-400 rounded-full bg-emerald-400/20 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white bg-emerald-500 px-1 rounded">TE A</span>
              </div>
            </div>
            <div className="p-4 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Estimated Cell Count</p>
                <p className="text-xl font-bold text-gray-800">142</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Cavity Symmetry</p>
                <p className="text-xl font-bold text-emerald-600">98%</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Fragmentation</p>
                <p className="text-xl font-bold text-emerald-600">&lt;2%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Morphokinetic Parameter Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b">
                  <tr>
                    <th className="py-3 pr-4">Parameter</th>
                    <th className="py-3 px-4">Value (hrs)</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { p: 't2', v: embryo.morpho?.t2, r: '18–30' },
                    { p: 't3', v: embryo.morpho?.t3, r: '30–42' },
                    { p: 't8', v: embryo.morpho?.t8, r: '60–74' },
                    { p: 'tEB', v: embryo.morpho?.tEB, r: '108–120' },
                    { p: 's3', v: embryo.morpho?.s3, r: '<5.0' },
                  ].map((row) => (
                    <tr key={row.p} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 font-bold text-gray-600 mono uppercase">{row.p}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{row.v?.toFixed(1)}</td>
                      <td className="py-3 px-4 text-gray-400">{row.r}</td>
                      <td className="py-3 pl-4 text-right">
                        <span className="text-emerald-500 font-bold">✓ Optimal</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Assessment Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1B7B6A] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-2">AI Assessment Results</p>
              <h2 className="text-5xl font-black mb-1">{embryo.gardner.expansion}{embryo.gardner.icm}{embryo.gardner.te}</h2>
              <p className="text-lg font-bold text-emerald-100">Grade A (Excellent)</p>
              
              <div className="mt-8 pt-8 border-t border-white/20 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-emerald-200 text-[10px] font-bold uppercase mb-1">Confidence</p>
                  <p className="text-2xl font-bold">{embryo.confidence.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-emerald-200 text-[10px] font-bold uppercase mb-1">Implantation Prob.</p>
                  <p className="text-2xl font-bold">{embryo.viabilityIndex}%</p>
                </div>
              </div>
            </div>
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800">Clinical Decision</h3>
            <div className="space-y-3">
              {Object.values(Disposition).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDisposition(opt)}
                  className={`w-full p-4 text-left rounded-xl border transition-all duration-200 font-bold text-sm flex items-center justify-between ${
                    disposition === opt 
                    ? 'border-[#1B7B6A] bg-[#1B7B6A]/5 text-[#1B7B6A] shadow-inner' 
                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                  }`}
                >
                  {opt}
                  {disposition === opt && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                </button>
              ))}
            </div>
            <button 
              disabled={!disposition}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${
                disposition ? 'bg-[#1B7B6A] text-white hover:bg-[#0F5449]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              Finalize Disposition & Log
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">AI Decision Reasoning</h3>
            <p className="text-sm text-gray-600 leading-relaxed italic mb-4">
              "Expansion score (5) detected via zona thinned analysis. ICM (A) features tightly packed cells with synchronous division. No aneuploidy markers detected in the time-lapse sequence (t2-t8 period)."
            </p>
            <button className="text-[#1B7B6A] text-sm font-bold flex items-center gap-1 hover:underline">
              View Detailed Neural Path
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetail;

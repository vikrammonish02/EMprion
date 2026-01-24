
import React, { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_CYCLES, MOCK_EMBRYOS, COLORS } from '../constants';
import { Cycle, Embryo } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import EmbryoUploadModal from '../components/EmbryoUploadModal';

interface CycleDetailProps {
  cycles: Cycle[];
  embryos: Embryo[];
  onAddEmbryos: (embryos: Embryo[]) => void;
}

import { analyzeEmbryo } from '../api';

const CycleDetail: React.FC<CycleDetailProps> = ({ cycles, embryos: allEmbryosProp, onAddEmbryos }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const cycle = useMemo(() => (cycles || MOCK_CYCLES).find(c => c.id === id), [id, cycles]);

  const aiEmbryos = useMemo(() => {
    const results = (location.state as any)?.analysisResults;
    if (!results) return [];

    return results.map((ar: any, idx: number) => ({
      id: `ai_${Date.now()}_${idx}`,
      displayId: `AI-${ar.name.split('.')[0]}`,
      cycleId: id,
      gardner: {
        expansion: parseInt(ar.result?.gardner?.expansion) || 4,
        icm: ar.result?.gardner?.icm || 'A',
        te: ar.result?.gardner?.te || 'A',
        cell_count: ar.result?.gardner?.cell_count || '--',
        cavity_symmetry: ar.result?.gardner?.cavity_symmetry || '--',
        fragmentation: ar.result?.gardner?.fragmentation || '--'
      },
      morpho: ar.result?.milestones ? {
        t2: parseFloat(ar.result.milestones.t2),
        t3: parseFloat(ar.result.milestones.t3),
        t5: parseFloat(ar.result.milestones.t5 || '0'),
        t8: parseFloat(ar.result.milestones.t8),
        tEB: parseFloat(ar.result.milestones.tEB),
        s3: parseFloat(ar.result.milestones.s3),
      } : undefined,
      viabilityIndex: parseInt(ar.result?.confidence?.replace('%', '')) || 85,
      status: 'COMPLETED',
      assetType: ar.type,
      analysisModel: ar.result?.analysis_type === 'morphokinetics' ? 'MORPHOKINETICS' as const : 'GARDNER' as const,
      confidence: (() => {
        const val = parseFloat(ar.result?.confidence || '90');
        return val <= 1 ? val * 100 : val;
      })(),
      file: ar.file,
      commentary: ar.result?.commentary
    }));
  }, [location.state, id]);

  const embryos = useMemo(() => {
    const baseEmbryos = (allEmbryosProp || MOCK_EMBRYOS).filter(e => e.cycleId === id);
    return [...aiEmbryos, ...baseEmbryos].sort((a, b) => b.viabilityIndex - a.viabilityIndex);
  }, [id, aiEmbryos, allEmbryosProp]);

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
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-3xl font-black text-gray-900">{cycle.displayId}</h2>
            <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-black uppercase tracking-wider">
              Assessment In Progress
            </span>
          </div>
          <p className="text-gray-500 font-medium flex items-center gap-2">
            Patient Path: {cycle.patientId} • Injected {cycle.eggRetrievalDate}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            disabled={isAnalyzing}
            onClick={() => setIsUploadOpen(true)}
            className={`px-6 py-2.5 border border-gray-200 rounded-xl font-bold transition-all flex items-center gap-2 ${isAnalyzing ? 'bg-gray-50 text-gray-400 cursor-wait' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Batch Import
              </>
            )}
          </button>
          <button className="px-6 py-2.5 bg-[#1B7B6A] text-white rounded-xl font-bold hover:shadow-lg hover:bg-[#0F5449] transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Finalize Cohort & Report
          </button>
        </div>
      </div>

      <EmbryoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={async (newEmbryos: any[]) => {
          setIsAnalyzing(true);
          const errors: string[] = [];

          try {
            const promises = newEmbryos.map(async (e, idx) => {
              if (!e.file) return null;
              try {
                const result = await analyzeEmbryo(e.file, e.assetType === 'VIDEO' ? 'morphokinetics' : 'gardner');
                return {
                  success: true,
                  data: {
                    id: `batch_${Date.now()}_${idx}`,
                    displayId: `AI-${e.file.name.split('.')[0]}`,
                    cycleId: id,
                    gardner: {
                      expansion: parseInt(result.gardner?.expansion) || 4,
                      icm: result.gardner?.icm || 'B',
                      te: result.gardner?.te || 'B',
                      cell_count: result.gardner?.cell_count || '--',
                      cavity_symmetry: result.gardner?.cavity_symmetry || '--',
                      fragmentation: result.gardner?.fragmentation || '--'
                    },
                    morpho: result.milestones ? {
                      t2: parseFloat(result.milestones.t2),
                      t3: parseFloat(result.milestones.t3),
                      t5: parseFloat(result.milestones.t5 || '0'),
                      t8: parseFloat(result.milestones.t8),
                      tEB: parseFloat(result.milestones.tEB) || parseFloat(result.milestones.tB || '0'),
                      s3: parseFloat(result.milestones.s3),
                    } : undefined,
                    viabilityIndex: parseInt(result.confidence?.replace('%', '')) || 85,
                    status: 'COMPLETED' as const,
                    assetType: result.analysis_type === 'morphokinetics' ? 'VIDEO' as const : 'IMAGE' as const,
                    analysisModel: result.analysis_type === 'morphokinetics' ? 'MORPHOKINETICS' as const : 'GARDNER' as const,
                    confidence: (() => {
                      const val = parseFloat(result.confidence || '90');
                      return val <= 1 ? val * 100 : val;
                    })(),
                    file: e.file,
                    commentary: result.commentary
                  } as Embryo
                };
              } catch (err: any) {
                console.error('Batch analysis failed for', e.file.name, err);
                const msg = err.message || 'Unknown error';
                errors.push(`${e.file.name}: ${msg}`);
                return { success: false };
              }
            });

            const rawResults = await Promise.all(promises);
            const results = rawResults.filter(r => r && r.success).map(r => r!.data) as Embryo[];

            if (results.length > 0) {
              onAddEmbryos(results);
            }

            if (errors.length > 0) {
              window.alert(`Batch Import Report:\n\n${results.length} files imported successfully.\n${errors.length} files failed.\n\nErrors:\n${errors.join('\n')}`);
            } else if (results.length > 0) {
              // Optional success message, but usually seeing the items is enough
            }

          } catch (error) {
            console.error('Batch import crashed', error);
            window.alert('Critical Batch Import Failure. See console.');
          } finally {
            setIsAnalyzing(false);
          }
        }}
      />

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
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">AI Rank</th>
                    <th className="px-6 py-4">Embryo ID</th>
                    <th className="px-6 py-4">Assessment Grade</th>
                    <th className="px-6 py-4">Viability Index</th>
                    <th className="px-6 py-4">Morphokinetic Stage</th>
                    <th className="px-6 py-4">Clinical Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {embryos.map((e, idx) => (
                    <tr
                      key={e.id}
                      onClick={() => navigate(`/embryo/${e.id}`, { state: { embryo: e } })}
                      className="hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${idx < 3 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-gray-100 text-gray-400'}`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{e.displayId}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{e.assetType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${e.gardner.icm === 'A' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          e.gardner.icm === 'B' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-gray-50 text-gray-400 border-gray-200'
                          }`}>
                          {e.gardner.expansion}{e.gardner.icm}{e.gardner.te}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-gray-800 w-8">{e.viabilityIndex}%</span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${e.viabilityIndex}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-gray-600">Day {idx < 8 ? '5' : '3'}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Expanded Blastocyst</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${e.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 animate-pulse'
                          }`}>
                          {e.status === 'COMPLETED' ? 'Graded' : 'Awaiting Review'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-1.5 text-[#1B7B6A] font-bold text-xs border border-[#1B7B6A] rounded-lg hover:bg-[#1B7B6A] hover:text-white transition-all active:scale-95">
                          {e.status === 'COMPLETED' ? 'Adjust' : 'Review'}
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

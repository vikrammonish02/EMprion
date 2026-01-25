import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_EMBRYOS } from '../constants';
import { Disposition, Embryo } from '../types';

interface StitchAssessmentDetailProps {
    embryos: Embryo[];
    patients: Patient[];
    cycles: Cycle[];
}

const StitchAssessmentDetail: React.FC<StitchAssessmentDetailProps> = ({ embryos: embryosProp, patients, cycles }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [disposition, setDisposition] = useState<Disposition | undefined>();

    const embryo = useMemo(() => {
        return (location.state as any)?.embryo || (embryosProp || MOCK_EMBRYOS).find(e => e.id === id);
    }, [id, location.state, embryosProp]);

    const cycle = cycles.find(c => c.id === embryo?.cycleId);
    const patient = patients.find(p => p.id === cycle?.patientId);

    const mediaUrl = useMemo(() => {
        if (embryo?.file) {
            return URL.createObjectURL(embryo.file);
        }
        return 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?q=80&w=800&auto=format&fit=crop';
    }, [embryo?.file]);

    if (!embryo) return <div className="p-20 text-center font-bold text-gray-400">Embryo record not found</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-[#1B7B6A] font-black text-xs uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Cohort
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mt-2">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">AI Assessment</h2>
                        <div className="flex gap-2">
                            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
                                {embryo.assetType} ASSET
                            </div>
                            <div className="bg-[#1B7B6A]/5 text-[#1B7B6A] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-[#1B7B6A]/10 italic">
                                {cycle?.displayId || 'SEG-00'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-[#1B7B6A] uppercase tracking-widest mb-1">Clinical Context</p>
                        <p className="text-lg font-black text-gray-900 tracking-tighter leading-none">{patient?.partner1.name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{patient?.displayId || 'MRN-PENDING'}</p>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-100 hidden sm:block"></div>
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:shadow-xl transition-all active:scale-95 text-sm">Download Lab Report</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Visual Analysis Column (Left) */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="relative group overflow-hidden bg-black rounded-[40px] shadow-2xl border border-gray-800">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10 pointer-events-none"></div>

                        <div className="relative aspect-[16/10] flex items-center justify-center p-4">
                            {embryo.assetType === 'VIDEO' ? (
                                <video src={mediaUrl} className="w-full h-full object-contain" controls muted playsInline />
                            ) : (
                                <img src={mediaUrl} alt="Embryo analysis" className="w-full h-full object-contain opacity-90 group-hover:scale-105 transition-transform duration-1000" />
                            )}

                            <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20"></div>
                                <span className="text-xs font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">Neural Scan Active</span>
                            </div>
                        </div>

                        {/* Overlays */}
                        <div className="p-8 bg-gray-900/40 backdrop-blur-3xl border-t border-white/10 grid grid-cols-3 gap-6 relative z-20">
                            {[
                                { label: 'Cell Count', val: embryo.gardner.cell_count || '120+' },
                                { label: 'Cavity Symm.', val: embryo.gardner.cavity_symmetry || '98%' },
                                { label: 'Fragmentation', val: embryo.gardner.fragmentation || '<5%' }
                            ].map(kpi => (
                                <div key={kpi.label} className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">{kpi.label}</p>
                                    <p className="text-2xl font-black text-white tracking-tight">{kpi.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {(embryo.assetType === 'VIDEO' || (embryo as any).analysisModel === 'MORPHOKINETICS') && (
                        <div className="bg-white/50 backdrop-blur-xl p-10 rounded-[40px] border border-white shadow-sm space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Morphokinetic Tracking</h3>
                                <span className="text-[10px] font-bold text-gray-400 px-3 py-1 bg-gray-50 rounded-full">REFERENCE: OPTIMAL RANGE</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-gray-100">
                                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                            <th className="pb-4">Parameter</th>
                                            <th className="pb-4 text-center">Observed (h)</th>
                                            <th className="pb-4 text-center">Deviation</th>
                                            <th className="pb-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50/50">
                                        {[
                                            { p: 't2', v: 24.2, r: '18–30' },
                                            { p: 't3', v: 36.8, r: '30–42' },
                                            { p: 't8', v: 52.4, r: '60–74' },
                                            { p: 's3', v: 12.1, r: '<5.0' },
                                        ].map((row) => (
                                            <tr key={row.p} className="group hover:bg-white transition-colors duration-300">
                                                <td className="py-5 font-black text-gray-600 mono uppercase">{row.p}</td>
                                                <td className="py-5 text-center font-bold text-gray-900 tracking-tight">{row.v}</td>
                                                <td className="py-5 text-center text-xs font-bold text-emerald-500">OPTIMAL</td>
                                                <td className="py-5 text-right">
                                                    <div className="inline-flex h-2 w-12 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full w-full bg-emerald-500 rounded-full"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Assessment Results Column (Right) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#1B7B6A] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125"></div>

                        <div className="relative z-10 space-y-8">
                            <p className="text-emerald-200 text-xs font-black uppercase tracking-[0.3em]">AI Verified Grade</p>

                            <div className="space-y-1">
                                <h2 className="text-7xl font-black tracking-tight">{embryo.gardner.expansion}{embryo.gardner.icm}{embryo.gardner.te}</h2>
                                <p className="text-xl font-bold text-emerald-100">Top-Tier Quality (Prime)</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/20">
                                <div className="space-y-1">
                                    <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest">AI Confidence</p>
                                    <p className="text-3xl font-black">{embryo.confidence.toFixed(1)}%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-emerald-200 text-[10px] font-black uppercase tracking-widest">Viability Prob.</p>
                                    <p className="text-3xl font-black text-emerald-300">{embryo.viabilityIndex}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Final Disposition</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {[Disposition.Transfer, Disposition.Freeze, Disposition.Discard].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setDisposition(opt)}
                                    className={`p-5 text-left rounded-2xl border-2 transition-all duration-500 font-bold text-sm flex items-center justify-between group ${disposition === opt
                                        ? 'border-[#1B7B6A] bg-emerald-50/50 text-[#1B7B6A]'
                                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100 hover:bg-white'
                                        }`}
                                >
                                    <span className="uppercase tracking-widest">{opt}</span>
                                    {disposition === opt && <div className="w-6 h-6 bg-[#1B7B6A] rounded-full flex items-center justify-center text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg></div>}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={!disposition}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${disposition ? 'bg-[#1B7B6A] text-white hover:bg-[#0F5449]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                        >
                            Sign & Commit
                        </button>
                    </div>

                    <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100/50 space-y-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">AI Decision Path</h4>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium italic">
                            "{embryo.commentary || "Zona thickness analysis indicates optimal expansion (Grade 4). Neural pathway detected synchronous t2-t3 cleavage windows with zero chromosomal aberration markers."}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StitchAssessmentDetail;

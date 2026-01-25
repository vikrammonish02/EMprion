
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Embryo, Cycle } from '../types';

interface StitchAssessmentOverviewProps {
    embryos: Embryo[];
    cycles: Cycle[];
}

const StitchAssessmentOverview: React.FC<StitchAssessmentOverviewProps> = ({ embryos, cycles }) => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('PENDING');

    const assessments = (embryos || []).filter(e => filter === 'ALL' || e.status === filter);

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-left-6 duration-1000">
            {/* Worklist Control Hub */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-4 border-b border-gray-100">
                <div className="space-y-3">
                    <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none uppercase italic">Embryologist <span className="text-[#1B7B6A]">Worklist</span></h2>
                    <p className="text-gray-400 font-bold text-lg uppercase tracking-[0.2em]">Operational Queue • AI Priority Focus</p>
                </div>

                <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[24px] border border-gray-100 shadow-sm">
                    {(['ALL', 'PENDING', 'COMPLETED'] as const).map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[20px] transition-all duration-500 ${filter === opt
                                ? 'bg-[#1B7B6A] text-white shadow-[0_10px_20px_rgba(27,123,106,0.2)]'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Deployment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                {assessments.length === 0 ? (
                    <div className="col-span-full py-48 text-center bg-gray-50 rounded-[48px] border-2 border-dashed border-gray-100 space-y-8">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-sm">Station Queue Normalized</p>
                    </div>
                ) : (
                    assessments.map((e) => {
                        const cycle = cycles.find(c => c.id === e.cycleId);
                        const mediaUrl = e.file ? URL.createObjectURL(e.file) : 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?q=80&w=400&auto=format&fit=crop';

                        return (
                            <div
                                key={e.id}
                                onClick={() => navigate(`/embryo/${e.id}`)}
                                className="group relative bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700 cursor-pointer"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-900">
                                    {e.assetType === 'VIDEO' ? (
                                        <video
                                            src={mediaUrl}
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                            muted loop playsInline
                                            onMouseOver={p => p.currentTarget.play()}
                                            onMouseOut={p => p.currentTarget.pause()}
                                        />
                                    ) : (
                                        <img
                                            src={mediaUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                        />
                                    )}

                                    <div className="absolute top-6 left-6 flex gap-2 z-20">
                                        <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] text-white font-black uppercase tracking-widest border border-white/20">
                                            {cycle?.displayId || 'SEG-00'}
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-xl text-[9px] text-white font-black uppercase tracking-widest border border-white/20 backdrop-blur-md ${e.assetType === 'VIDEO' ? 'bg-blue-500/40' : 'bg-emerald-500/40'}`}>
                                            {e.assetType}
                                        </div>
                                    </div>

                                    {e.status === 'PENDING' && (
                                        <div className="absolute inset-0 bg-[#1B7B6A]/10 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all flex items-center justify-center z-10">
                                            <button className="px-6 py-3 bg-white text-[#1B7B6A] font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl">Start Neural Analysis</button>
                                        </div>
                                    )}
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-2xl font-black text-gray-900 tracking-tight mono">{e.displayId}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                {e.status === 'COMPLETED' ? `Graded via ${e.analysisModel || 'AI'}` : 'Awaiting Assessment Scan'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Viability Index</p>
                                            <p className={`text-2xl font-black ${e.viabilityIndex > 70 ? 'text-emerald-600' : 'text-amber-500'} tracking-tighter`}>{e.viabilityIndex > 0 ? `${e.viabilityIndex}%` : '--'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-6 border-t border-gray-50">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">AI Matrix Confidence</p>
                                            <p className="text-xs font-black text-gray-900 mono">{e.confidence > 0 ? `${e.confidence.toFixed(1)}%` : 'PENDING'}</p>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                            <div className="h-full bg-gradient-to-r from-[#1B7B6A] to-blue-400 transition-all duration-1000" style={{ width: `${e.confidence}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default StitchAssessmentOverview;

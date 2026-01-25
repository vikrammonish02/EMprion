import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cycle, Patient } from '../types';

interface StitchDashboardProps {
    cycles: Cycle[];
    patients: Patient[];
}

const StitchDashboard: React.FC<StitchDashboardProps> = ({ cycles, patients }) => {
    const navigate = useNavigate();

    const totalEmbryosCount = cycles.reduce((acc, c) => acc + (c.embryoCount || 0), 0);
    const avgViabilityVal = cycles.length > 0 ? 74 : 0; // Keeping 74 as a realistic base for simulation, but could be averaged if we had embryo data here

    const metrics = [
        { label: 'Active Projects', value: cycles.length, icon: '⚡', highlight: false, path: '/' },
        { label: 'Review Required', value: cycles.filter(c => c.status === 'ASSESSMENT' || c.status === 'DISPOSITION').length, icon: '⏳', highlight: true, path: '/assessment' },
        { label: 'Avg Viability', value: `${avgViabilityVal}%`, icon: '📈', highlight: false, path: '/reports' },
        { label: 'Total Embryos', value: totalEmbryosCount, icon: '🧬', highlight: false, path: '/patients' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Clinical Worklist Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Clinical Worklist</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{cycles.length} Projects Active</span>
                        </div>
                    </div>
                    <p className="text-gray-500 font-medium text-lg italic">Subhag Laboratory • Precision AI Assessment</p>
                </div>
                <button
                    onClick={() => navigate('/new-cycle')}
                    className="px-8 py-4 bg-[#1B7B6A] text-white rounded-2xl font-bold hover:shadow-[0_20px_50px_rgba(27,123,106,0.3)] hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    Create New Project
                </button>
            </div>

            {/* Metric Grid - Glassmorphism Edition */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        onClick={() => navigate(m.path)}
                        className={`relative group overflow-hidden bg-white/70 backdrop-blur-xl p-8 rounded-[32px] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 cursor-pointer`}
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-8 -top-8 w-24 h-24 blur-3xl opacity-20 transition-opacity group-hover:opacity-40 rounded-full ${m.highlight ? 'bg-amber-400' : 'bg-[#1B7B6A]'}`}></div>

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${m.highlight ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-[#1B7B6A]'}`}>
                                    {m.icon}
                                </div>
                                {m.highlight && (
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] mb-2">{m.label}</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tight">{m.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pipeline Section */}
            <div className="space-y-12 pb-20">
                {['Ingestion', 'Processing', 'Ready for Review', 'Finalized'].map((stageTitle, idx) => {
                    const stageMap: Record<string, string[]> = {
                        'Ingestion': ['NEW', 'EGG_RETRIEVAL'],
                        'Processing': ['FERTILIZATION', 'ASSESSMENT'],
                        'Ready for Review': ['DISPOSITION'],
                        'Finalized': ['TRANSFER_FREEZE', 'COMPLETED']
                    };
                    const stageCycles = cycles.filter(c => stageMap[stageTitle].includes(c.status));
                    if (stageCycles.length === 0) return null;

                    return (
                        <div key={stageTitle} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest flex items-center gap-3">
                                    {stageTitle}
                                    <span className="text-xs bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-bold">{stageCycles.length}</span>
                                </h3>
                                <div className="flex-1 h-[2px] bg-gradient-to-r from-gray-100 to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {stageCycles.map(c => {
                                    const patient = patients.find(p => p.id === c.patientId);
                                    return (
                                        <div
                                            key={c.id}
                                            onClick={() => navigate(`/cycle/${c.id}`)}
                                            className="group relative bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-[0_32px_64px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer overflow-hidden"
                                        >
                                            {/* Glassmorphism Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity duration-500"></div>

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div>
                                                        <p className="text-[10px] font-black text-[#1B7B6A] uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-emerald-50 rounded-lg inline-block">{c.displayId}</p>
                                                        <h4 className="text-2xl font-black text-gray-900 group-hover:text-[#1B7B6A] transition-colors">{patient?.partner1.name || 'Anonymous Embryo'}</h4>
                                                        <p className="text-sm text-gray-400 font-bold mt-1 tracking-tight">{patient?.displayId || 'ID-PENDING'}</p>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                                                        <svg className="w-6 h-6 text-[#1B7B6A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 transition-colors group-hover:bg-white">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Embryos</p>
                                                        <p className="text-xl font-black text-gray-800">{c.embryoCount}</p>
                                                    </div>
                                                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 transition-colors group-hover:bg-white">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Viability</p>
                                                        <p className="text-xl font-black text-emerald-600">74%</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Analysis Pipeline</span>
                                                        <span className="text-sm font-black text-gray-900">{idx === 3 ? '100%' : idx === 2 ? '85%' : idx === 1 ? '45%' : '15%'}</span>
                                                    </div>
                                                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-50 shadow-inner">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[#1B7B6A] to-[#7ECCC3] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(27,123,106,0.3)]"
                                                            style={{ width: idx === 3 ? '100%' : idx === 2 ? '85%' : idx === 1 ? '45%' : '15%' }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StitchDashboard;

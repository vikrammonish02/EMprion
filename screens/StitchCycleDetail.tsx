import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Cycle, Embryo, Patient } from '../types';
import EmbryoUploadModal from '../components/EmbryoUploadModal';

interface StitchCycleDetailProps {
    cycles: Cycle[];
    embryos: Embryo[];
    onAddEmbryos: (embryos: Embryo[]) => void;
}

const StitchCycleDetail: React.FC<StitchCycleDetailProps> = ({ cycles, embryos: allEmbryos, onAddEmbryos }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const cycle = cycles.find(c => c.id === id);
    const cycleEmbryos = allEmbryos.filter(e => e.cycleId === id);

    if (!cycle) return <div className="p-20 text-center font-bold text-gray-400 uppercase tracking-[0.3em]">Lifecycle Data Unavailable</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Patient Info Ribbon - Cinematic Glassmorphism */}
            <div className="relative overflow-hidden bg-[#1B7B6A] p-10 rounded-[48px] shadow-2xl group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-125"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-emerald-200 font-black text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            Return to Worklist
                        </button>
                        <div>
                            <p className="text-emerald-200 text-xs font-black uppercase tracking-[0.3em] mb-1">Active Case Context</p>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-none">Rakesh Patel <span className="text-emerald-300/50 font-medium">/ MRN-2024-001</span></h2>
                        </div>
                    </div>

                    <div className="flex bg-white/10 backdrop-blur-md rounded-[32px] p-6 border border-white/10 gap-10">
                        <div>
                            <p className="text-emerald-200 text-[9px] font-black uppercase tracking-widest mb-1">Cycle Strategy</p>
                            <p className="text-lg font-black text-white tracking-tighter uppercase italic">IVF - ICSI</p>
                        </div>
                        <div className="w-[1px] bg-white/20"></div>
                        <div>
                            <p className="text-emerald-200 text-[9px] font-black uppercase tracking-widest mb-1">Retrieval Volume</p>
                            <p className="text-lg font-black text-white tracking-tighter uppercase">{cycle.embryoCount} Embryos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cycle Status Timeline */}
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-[40px] border border-white/50 shadow-sm overflow-x-auto no-scrollbar">
                <div className="flex justify-between min-w-[800px] items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -translate-y-1/2 z-0"></div>

                    {['Ovarian Stimulation', 'Egg Retrieval', 'Fertilization', 'AI Assessment', 'Final Disposition'].map((step, idx) => {
                        const isActive = idx <= 3; // Mock active state
                        return (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-3 px-4">
                                <div className={`w-8 h-8 rounded-full border-4 transition-all duration-700 ${isActive ? 'bg-[#1B7B6A] border-emerald-50 shadow-lg scale-110' : 'bg-white border-gray-100'}`}></div>
                                <p className={`text-[10px] font-black uppercase tracking-widest text-center ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Cohort Grid Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Cohort Registry <span className="text-xs bg-gray-100 text-gray-400 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">{cycleEmbryos.length} Items</span>
                    </h3>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-[#1B7B6A] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 border border-[#1B7B6A]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                            Register New Embryo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
                    {cycleEmbryos.map(embryo => {
                        const grade = `${embryo.gardner.expansion}${embryo.gardner.icm}${embryo.gardner.te}`;
                        const isHighQuality = embryo.gardner.icm === 'A' && embryo.gardner.te === 'A';

                        return (
                            <div
                                key={embryo.id}
                                onClick={() => navigate(`/embryo/${embryo.id}`, { state: { embryo } })}
                                className="group relative bg-white border border-gray-100 rounded-[36px] overflow-hidden shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] transition-all duration-700 cursor-pointer hover:-translate-y-3"
                            >
                                {/* Thumb Container */}
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                    <div className="absolute inset-0 bg-[#1B7B6A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                                    <img
                                        src={embryo.file ? URL.createObjectURL(embryo.file) : 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?q=80&w=800&auto=format&fit=crop'}
                                        alt="Embryo thumbnail"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    {/* Visual Pulse Overlay */}
                                    <div className="absolute top-6 left-6 z-20">
                                        <span className="flex h-4 w-4 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B7B6A] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#1B7B6A] border-2 border-white"></span>
                                        </span>
                                    </div>

                                    <div className="absolute bottom-6 right-6 z-20">
                                        <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20">
                                            {embryo.assetType}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[9px] font-black text-[#1B7B6A] uppercase tracking-[0.2em] mb-1">Assessed Grade</p>
                                            <h4 className="text-3xl font-black text-gray-900 tracking-tight italic">{grade}</h4>
                                        </div>
                                        <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${isHighQuality ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                                            {isHighQuality ? 'Optimal' : 'Standard'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Viability</p>
                                            <p className="text-xl font-black text-gray-900 mono">{embryo.viabilityIndex}%</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Confidence</p>
                                            <p className="text-xl font-black text-gray-900 mono">{embryo.confidence.toFixed(1)}%</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-50 group-hover:border-[#1B7B6A]/10 transition-colors">
                                        <div className="flex items-center gap-2 text-[#1B7B6A] font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                                            Execute Deep Analysis
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <EmbryoUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cycleId={id!}
                onUpload={(newEmbryos) => {
                    onAddEmbryos(newEmbryos);
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

export default StitchCycleDetail;

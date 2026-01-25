
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient, Cycle, Embryo } from '../types';

interface StitchPatientDetailProps {
    patients: Patient[];
    cycles: Cycle[];
    embryos: Embryo[];
}

const StitchPatientDetail: React.FC<StitchPatientDetailProps> = ({ patients, cycles, embryos }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const patient = useMemo(() => patients.find(p => p.id === id), [id, patients]);
    const patientCycles = useMemo(() => cycles.filter(c => c.patientId === id), [id, cycles]);
    const patientEmbryos = useMemo(() => embryos.filter(e => patientCycles.some(c => c.id === e.cycleId)), [patientCycles, embryos]);

    if (!patient) return <div className="p-32 text-center text-gray-400 font-black uppercase tracking-[0.3em] italic">Identity Segment Missing</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {/* Header Ribbon */}
            <div className="relative overflow-hidden bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-10">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/patients')}
                            className="flex items-center gap-2 text-[#1B7B6A] font-black text-[10px] uppercase tracking-[0.2em] hover:translate-x-[-4px] transition-transform"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                            Back to Index
                        </button>
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-2">
                                <h2 className="text-5xl font-black text-gray-900 tracking-tight leading-none">{patient.partner1.name}</h2>
                                <span className="px-4 py-1.5 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 italic">
                                    {patient.partner1.idType}: {patient.partner1.idLast4}
                                </span>
                            </div>
                            <p className="text-gray-400 font-medium text-lg italic uppercase tracking-wider">DOB: {patient.partner1.dob} • Clinical Age: {patient.partner1.age}Y • {patient.partner1.sex}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full lg:w-auto">
                        <button className="flex-1 lg:flex-none px-8 py-4 bg-gray-50 text-gray-600 rounded-[20px] font-bold hover:bg-white hover:shadow-md transition-all border border-gray-100 active:scale-95">Edit Record</button>
                        <button className="flex-1 lg:flex-none px-8 py-4 bg-[#1B7B6A] text-white rounded-[20px] font-bold shadow-xl hover:-translate-y-1 transition-all active:scale-95">Transfer History</button>
                    </div>
                </div>
            </div>

            {/* Metrics Pad */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Clinical Indication', val: patient.clinicalSummary.primaryIndication, icon: '📋' },
                    { label: 'Cycle Count', val: patientCycles.length, icon: '🔄' },
                    { label: 'Embryo Bank', val: patientEmbryos.length, icon: '🧬' },
                    { label: 'Clinic ID', val: patient.clinicId.toUpperCase(), icon: '🏥' }
                ].map(m => (
                    <div key={m.label} className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-sm space-y-4 hover:shadow-lg transition-shadow duration-500">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl border border-gray-100/50">{m.icon}</div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{m.label}</p>
                            <p className="text-2xl font-black text-gray-900 tracking-tight">{m.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Clinical Lifecycle */}
            <div className="space-y-6">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                    Active Lifecycle Segments <div className="h-px flex-1 bg-gray-100"></div>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {patientCycles.map(c => (
                        <div
                            key={c.id}
                            onClick={() => navigate(`/cycle/${c.id}`)}
                            className="group bg-white border border-gray-100 rounded-[40px] p-10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 cursor-pointer hover:-translate-y-2 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <div className="w-32 h-32 bg-emerald-500 rounded-full"></div>
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.25em] mb-1">Retrieval Group</p>
                                        <h4 className="text-2xl font-black text-gray-900">{c.eggRetrievalDate}</h4>
                                    </div>
                                    <span className="px-4 py-1.5 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">{c.status}</span>
                                </div>

                                <div className="flex bg-gray-50/50 p-6 rounded-[24px] border border-gray-100/30 gap-8">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume</p>
                                        <p className="text-xl font-black text-gray-900 mono">{c.embryoCount}</p>
                                    </div>
                                    <div className="w-px bg-gray-200"></div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Confidence</p>
                                        <p className="text-xl font-black text-emerald-600 mono">88%</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-[#1B7B6A] font-black text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                                    Enter Lifecycle View
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                    {patientCycles.length === 0 && (
                        <div className="col-span-full p-24 text-center bg-gray-50 rounded-[48px] border-2 border-dashed border-gray-100 font-bold text-gray-300 uppercase tracking-widest">
                            No Active Lifecycle Cycles Logged
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StitchPatientDetail;

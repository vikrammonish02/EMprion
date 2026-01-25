import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types';

interface StitchPatientsListProps {
    patients: Patient[];
    onDeletePatient: (id: string) => void;
}

const StitchPatientsList: React.FC<StitchPatientsListProps> = ({ patients, onDeletePatient }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patients.filter(p =>
        p.partner1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.displayId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-10 duration-1000">
            {/* Registry Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-gray-100">
                <div className="space-y-2">
                    <h2 className="text-5xl font-black text-gray-900 tracking-tight">Clinical Registry</h2>
                    <p className="text-gray-500 font-medium text-lg italic uppercase tracking-widest text-[#1B7B6A]/60">Laboratory Enrollment • Archive Index</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative group flex-1 sm:w-80">
                        <input
                            type="text"
                            placeholder="Search Registry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-0 rounded-[20px] outline-none focus:ring-4 focus:ring-[#1B7B6A]/10 transition-all font-bold text-gray-700 placeholder:text-gray-300"
                        />
                        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-[#1B7B6A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <button
                        onClick={() => navigate('/new-patient')}
                        className="px-8 py-4 bg-[#1B7B6A] text-white rounded-[20px] font-bold shadow-lg hover:shadow-[#1B7B6A]/30 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        New Intake
                    </button>
                </div>
            </div>

            {/* Patient Data Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredPatients.length === 0 ? (
                    <div className="p-32 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 italic text-gray-300 tracking-[0.2em] font-black uppercase">
                        Empty Registry Segment
                    </div>
                ) : (
                    filteredPatients.map(p => (
                        <div
                            key={p.id}
                            onClick={() => navigate(`/patient/${p.id}`)}
                            className="group relative bg-white border border-gray-100 rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:shadow-[0_32px_64px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-700 cursor-pointer"
                        >
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-[#1B7B6A]/5 rounded-[24px] flex items-center justify-center text-4xl border border-[#1B7B6A]/10 group-hover:scale-110 transition-transform duration-700">
                                    🧬
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-[#1B7B6A] transition-colors">{p.partner1.name}</h4>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">Active</span>
                                    </div>
                                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">{p.displayId} • ENROLLED 2024</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-12 lg:gap-24">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Protocol Type</p>
                                    <p className="text-sm font-black text-gray-700 italic uppercase">IVF-ICSI</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Demographics</p>
                                    <p className="text-sm font-black text-gray-700 mono">{p.partner1.age}Y • {p.partner1.sex.toUpperCase()}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Confirm records deletion?')) onDeletePatient(p.id);
                                        }}
                                        className="w-12 h-12 rounded-[18px] bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-500"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                    <button className="w-12 h-12 rounded-[18px] bg-[#1B7B6A] text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StitchPatientsList;

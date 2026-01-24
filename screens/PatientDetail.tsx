import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Patient, Cycle, Embryo } from '../types';
import { MOCK_PATIENTS, MOCK_CYCLES, MOCK_EMBRYOS } from '../constants';

interface PatientDetailProps {
    patients: Patient[];
    cycles: Cycle[];
    embryos: Embryo[];
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patients, cycles, embryos }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const patient = useMemo(() => patients.find(p => p.id === id), [id, patients]);
    const patientCycles = useMemo(() => cycles.filter(c => c.patientId === id), [id, cycles]);
    const patientEmbryos = useMemo(() => embryos.filter(e => patientCycles.some(c => c.id === e.cycleId)), [patientCycles, embryos]);

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Patient Not Found</h2>
                <button onClick={() => navigate('/patients')} className="text-[#1B7B6A] font-bold hover:underline">
                    Return to Directory
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-gray-900">{patient.partner1.name}</h1>
                            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                                {patient.partner1.idType}: {patient.partner1.idLast4}
                            </span>
                        </div>
                        <p className="text-gray-500 font-medium">DOB: {patient.partner1.dob} • {patient.partner1.age} Years Old</p>

                        {patient.partner2Present && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Partner Details</p>
                                <p className="font-bold text-gray-700">{patient.partner2?.name}</p>
                                <p className="text-xs text-gray-500">DOB: {patient.partner2?.dob}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/patients')}
                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                        >
                            Back to Directory
                        </button>
                        <button className="px-6 py-2.5 bg-[#1B7B6A] text-white rounded-xl font-bold hover:shadow-lg transition-all">
                            Edit Record
                        </button>
                    </div>
                </div>
            </div>

            {/* Clinical Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Primary Indication</p>
                    <p className="text-lg font-bold text-gray-900">{patient.clinicalSummary.primaryIndication}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Previous Cycles</p>
                    <p className="text-lg font-bold text-gray-900">{patient.clinicalSummary.previousCycles}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Embryo Bank</p>
                    <p className="text-3xl font-black text-gray-900">{patientEmbryos.length}</p>
                    <p className="text-xs text-emerald-500 font-bold mt-1">Across {patientCycles.length} Cycles</p>
                </div>
            </div>

            {/* Linked Cycles */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Clinical Cycles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patientCycles.map(c => (
                        <div
                            key={c.id}
                            onClick={() => navigate(`/cycle/${c.id}`)}
                            className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{c.displayId}</span>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                    {c.status}
                                </span>
                            </div>
                            <p className="font-bold text-gray-900 mb-1">{c.eggRetrievalDate}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                {c.embryoCount} Embryos
                            </div>
                        </div>
                    ))}
                    {patientCycles.length === 0 && (
                        <div className="col-span-full p-8 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            No cycles recorded for this patient.
                        </div>
                    )}
                </div>
            </div>

            {/* Embryo List (Simple View) */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Embryo Repository</h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {patientEmbryos.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">No embryos found in repository.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Embryo ID</th>
                                    <th className="px-6 py-4">Cycle</th>
                                    <th className="px-6 py-4">Grade</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {patientEmbryos.map(e => (
                                    <tr key={e.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/embryo/${e.id}`, { state: { embryo: e } })}>
                                        <td className="px-6 py-4 font-bold text-gray-900">{e.displayId}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {patientCycles.find(c => c.id === e.cycleId)?.displayId || e.cycleId}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded font-bold text-xs">{e.gardner.expansion}{e.gardner.icm}{e.gardner.te}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${e.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {e.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-[#1B7B6A] font-bold text-xs hover:underline">View</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDetail;

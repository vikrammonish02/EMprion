
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types';

interface PatientsListProps {
  patients: Patient[];
  onDeletePatient?: (id: string) => void;
}

const PatientsList: React.FC<PatientsListProps> = ({ patients, onDeletePatient }) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500" onClick={() => setOpenMenuId(null)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Directory</h2>
          <p className="text-slate-500 font-medium">Manage patient pairs and clinical records</p>
        </div>
        <button
          onClick={() => navigate('/new-patient')}
          className="px-6 py-2.5 bg-[#1B7B6A] text-white rounded-lg font-bold hover:bg-[#146152] transition-colors flex items-center gap-2 shadow-sm text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add New Patient
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {patients.length === 0 ? (
          <div className="p-20 text-center space-y-6">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">No Patients Registered</h3>
              <p className="text-slate-400 max-w-xs mx-auto mt-1 text-sm">Enroll new patient pairs to start tracking IVF clinical cycles.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Partner 1 (Name/DOB/MRN)</th>
                <th className="px-6 py-4">Partner 2 (Name/DOB/MRN)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50 transition-colors text-sm cursor-pointer group"
                  onClick={() => navigate(`/patient/${p.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1B7B6A] group-hover:text-[#146152] transition-colors">{p.partner1.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">DOB: {p.partner1.dob}</span>
                      <span className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {p.partner1.idType} • {p.partner1.idLast4}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p.partner2Present ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700">{p.partner2?.name}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">DOB: {p.partner2?.dob}</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {p.partner2?.idType} • {p.partner2?.idLast4}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Single Patient</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {p.donorEligibility?.status === 'Completed' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-lg uppercase tracking-tighter border border-emerald-200">FDA Verified</span>}
                      {p.consents?.treatmentSigned && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black rounded-lg uppercase tracking-tighter border border-blue-200">Consent Signed</span>}
                      {p.donorFlags?.sperm || p.donorFlags?.oocytes ? <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded-lg uppercase tracking-tighter border border-amber-200">Donor Case</span> : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === p.id ? null : p.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === p.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="py-1">
                          <button
                            onClick={() => navigate(`/patient/${p.id}`)}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View Record
                          </button>
                          <button
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Edit Details
                          </button>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this patient?')) {
                                onDeletePatient?.(p.id);
                                setOpenMenuId(null);
                              }
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Delete Patient
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientsList;

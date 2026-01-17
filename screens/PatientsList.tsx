
import React from 'react';
import { Patient } from '../types';

interface PatientsListProps {
  patients: Patient[];
}

const PatientsList: React.FC<PatientsListProps> = ({ patients }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Directory</h2>
          <p className="text-gray-500 font-medium">Manage patient pairs and clinical records</p>
        </div>
        <button className="px-6 py-3 bg-[#1B7B6A] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add New Patient Pair
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">Patient ID</th>
              <th className="px-6 py-4">Wife Name</th>
              <th className="px-6 py-4">Husband Name</th>
              <th className="px-6 py-4">Age (W/H)</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-800 mono text-sm">{p.displayId}</td>
                <td className="px-6 py-4 font-bold text-[#1B7B6A]">{p.wifeName}</td>
                <td className="px-6 py-4 font-medium text-gray-600">{p.husbandName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.wifeAge} / {p.husbandAge}</td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-[#1B7B6A]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsList;

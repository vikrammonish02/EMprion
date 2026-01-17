
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PATIENTS } from '../constants';

const NewCycleForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientId: '',
    protocol: 'Standard Antagonist',
    eggCount: '',
    incubatorId: 'INC-B-04',
    startDate: new Date().toISOString().split('T')[0]
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = ['Patient Selection', 'Lab Configuration', 'Review & Start'];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-3xl font-bold text-gray-900">New Cycle Registration</h2>
      </div>

      {/* Stepper UI */}
      <div className="flex items-center justify-between px-4">
        {steps.map((label, idx) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                step > idx + 1 ? 'bg-emerald-500 border-emerald-500 text-white' : 
                step === idx + 1 ? 'border-[#1B7B6A] text-[#1B7B6A] shadow-[0_0_15px_rgba(27,123,106,0.3)]' : 
                'border-gray-200 text-gray-300'
              }`}>
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${step === idx + 1 ? 'text-[#1B7B6A]' : 'text-gray-300'}`}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${step > idx + 1 ? 'bg-emerald-500' : 'bg-gray-100'}`}></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
        {step === 1 && (
          <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Select Primary Patient</h3>
              <p className="text-gray-500">Search for existing patient records or create a new pair profile.</p>
            </div>
            <div className="relative">
               <input 
                type="text" 
                placeholder="Search by Patient ID or Name..." 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#1B7B6A] rounded-2xl outline-none transition-all text-lg font-medium"
               />
               <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div className="space-y-3">
              {MOCK_PATIENTS.map(p => (
                <div 
                  key={p.id}
                  onClick={() => setFormData({...formData, patientId: p.id})}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    formData.patientId === p.id ? 'border-[#1B7B6A] bg-emerald-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1B7B6A] font-bold shadow-sm">
                      {p.wifeName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{p.wifeName} & {p.husbandName}</p>
                      <p className="text-xs text-gray-400 mono">{p.displayId}</p>
                    </div>
                  </div>
                  {formData.patientId === p.id && <div className="w-6 h-6 bg-[#1B7B6A] text-white rounded-full flex items-center justify-center text-xs">✓</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
             <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Laboratory Setup</h3>
              <p className="text-gray-500">Enter cycle initialization parameters and link equipment.</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Egg Retrieval Date</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Expected Embryos</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 15"
                    value={formData.eggCount}
                    onChange={(e) => setFormData({...formData, eggCount: e.target.value})}
                    className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20" 
                  />
               </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Assign Time-Lapse Incubator</label>
                <select 
                  value={formData.incubatorId}
                  onChange={(e) => setFormData({...formData, incubatorId: e.target.value})}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20"
                >
                  <option value="INC-B-04">Incubator B-04 (Online)</option>
                  <option value="INC-A-12">Incubator A-12 (Available)</option>
                  <option value="INC-C-01">Incubator C-01 (Maintenance)</option>
                </select>
            </div>
          </div>
        )}

        {step === 3 && (
           <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                 <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                   🚀
                 </div>
                 <h3 className="text-2xl font-black text-gray-900">Ready to Synchronize</h3>
                 <p className="text-gray-500">AI will begin morphokinetic tracking immediately upon cycle start.</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                 <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-400">Patient</span>
                    <span className="text-sm font-bold">Jane Doe</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-sm text-gray-400">Cohort Size</span>
                    <span className="text-sm font-bold">{formData.eggCount} Embryos</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Lab Unit</span>
                    <span className="text-sm font-bold">{formData.incubatorId}</span>
                 </div>
              </div>
           </div>
        )}

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between gap-4">
          <button 
            onClick={step === 1 ? () => navigate(-1) : prevStep}
            className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button 
            onClick={step === 3 ? () => navigate('/') : nextStep}
            disabled={step === 1 && !formData.patientId}
            className={`px-12 py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 ${
              step === 1 && !formData.patientId ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-[#1B7B6A] hover:bg-[#0F5449]'
            }`}
          >
            {step === 3 ? 'Initialize Cycle' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCycleForm;

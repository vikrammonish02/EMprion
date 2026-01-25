import React, { useState } from 'react';
import { Patient } from '../types';

interface PatientRegistrationWizardProps {
    onComplete: (patient: Patient) => void;
    onCancel: () => void;
    initialData?: Partial<Patient>;
}

const PatientRegistrationWizard: React.FC<PatientRegistrationWizardProps> = ({ onComplete, onCancel, initialData }) => {
    const [modalStep, setModalStep] = useState(1);
    const [newPatientFields, setNewPatientFields] = useState<Omit<Patient, 'id' | 'displayId' | 'clinicId'>>({
        partner1: {
            name: '', dob: '', age: 0, sex: 'Female', relationshipStatus: 'Married',
            nationality: 'Indian', idType: 'Aadhaar', idLast4: '', mrn: '', mobile: '', email: '',
            address: { line1: '', city: '', state: '', pinCode: '', country: 'India' }
        },
        partner2Present: false,
        partner2: {
            name: '', dob: '', age: 0, sex: 'Male', relationshipStatus: 'Married',
            nationality: 'Indian', idType: 'Aadhaar', idLast4: '', mrn: '', mobile: '', email: '',
            address: { line1: '', city: '', state: '', pinCode: '', country: 'India' }
        },
        clinicalSummary: {
            primaryIndication: 'Female Factor',
            previousCycles: 'None',
            medicalConditions: [],
            indicationDetails: '',
            obstetricHistory: ''
        },
        donorFlags: { sperm: false, oocytes: false, embryos: false, surrogate: false },
        privacy: { registryReportAgreement: false, noticeReceived: false, channels: [] },
        consents: {
            treatmentSigned: false, storageSigned: false, donorSigned: false,
            grievanceSigned: false, qualityImprovementConsent: false
        },
        staffSignatureInitials: '',
        ...initialData // Override defaults if initialData is provided
    });

    // Calculate age helper
    const calculateAge = (dob: string) => {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="flex flex-col min-h-[700px] font-sans bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100">
            {/* Wizard Navigation Info */}
            <div className="px-8 py-3 bg-white border-b border-gray-100 flex gap-4 overflow-x-auto no-scrollbar">
                {['Demographics', 'Clinical Indicators', 'Donor & Staff', 'Consent & Privacy', 'Final Review'].map((label, idx) => (
                    <div key={label} className="flex items-center gap-2 flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${modalStep === idx + 1 ? 'bg-[#1B7B6A] text-white' :
                            modalStep > idx + 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {modalStep > idx + 1 ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${modalStep === idx + 1 ? 'text-[#1B7B6A]' : 'text-gray-400'}`}>{label}</span>
                        {idx < 4 && <div className="w-8 h-px bg-gray-100 mx-1"></div>}
                    </div>
                ))}
            </div>

            {/* Wizard Content */}
            <div className="flex-1 p-10 space-y-8 bg-white">
                {modalStep === 1 && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                        {/* Partner 1 */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-[#1B7B6A] rounded-full"></div>
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Partner 1 (Primary)</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Legal Full Name (as per ID)</label>
                                    <input
                                        type="text"
                                        value={newPatientFields.partner1.name}
                                        onChange={e => setNewPatientFields({ ...newPatientFields, partner1: { ...newPatientFields.partner1, name: e.target.value } })}
                                        className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 transition-all font-bold text-gray-700"
                                        placeholder="e.g. Sreya Sharma"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">DOB</label>
                                    <input
                                        type="date"
                                        value={newPatientFields.partner1.dob}
                                        onChange={e => {
                                            const age = calculateAge(e.target.value);
                                            setNewPatientFields({ ...newPatientFields, partner1: { ...newPatientFields.partner1, dob: e.target.value, age } });
                                        }}
                                        className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Sex</label>
                                    <select
                                        value={newPatientFields.partner1.sex}
                                        onChange={e => setNewPatientFields({ ...newPatientFields, partner1: { ...newPatientFields.partner1, sex: e.target.value as any } })}
                                        className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700 appearance-none"
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nationality</label>
                                    <input
                                        type="text"
                                        value={newPatientFields.partner1.nationality}
                                        onChange={e => setNewPatientFields({ ...newPatientFields, partner1: { ...newPatientFields.partner1, nationality: e.target.value } })}
                                        className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">ID Type</label>
                                    <select
                                        value={newPatientFields.partner1.idType}
                                        onChange={e => setNewPatientFields({ ...newPatientFields, partner1: { ...newPatientFields.partner1, idType: e.target.value as any } })}
                                        className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700 appearance-none"
                                    >
                                        <option value="Aadhaar">Aadhaar</option>
                                        <option value="Passport">Passport</option>
                                        <option value="PAN">PAN</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">ID Last 4</label>
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={newPatientFields.partner1.idLast4}
                                        onChange={e => setNewPatientFields({ ...newPatientFields, partner1: { ...newPatientFields.partner1, idLast4: e.target.value } })}
                                        className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-4 border-t border-gray-50">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newPatientFields.partner2Present}
                                    onChange={e => setNewPatientFields({ ...newPatientFields, partner2Present: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-200 text-[#1B7B6A] focus:ring-[#1B7B6A]"
                                />
                                Add Partner / Spouse Details?
                            </label>
                        </div>

                        {newPatientFields.partner2Present && (
                            <div className="space-y-6 pt-4 animate-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-gray-300 rounded-full"></div>
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Partner 2</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Legal Full Name</label>
                                        <input
                                            type="text"
                                            value={newPatientFields.partner2?.name}
                                            onChange={e => setNewPatientFields({ ...newPatientFields, partner2: { ...newPatientFields.partner2!, name: e.target.value } })}
                                            className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">DOB</label>
                                        <input
                                            type="date"
                                            value={newPatientFields.partner2?.dob}
                                            onChange={e => {
                                                const age = calculateAge(e.target.value);
                                                setNewPatientFields({ ...newPatientFields, partner2: { ...newPatientFields.partner2!, dob: e.target.value, age } });
                                            }}
                                            className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {modalStep === 2 && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Primary Indication for IVF</label>
                                <select
                                    value={newPatientFields.clinicalSummary.primaryIndication}
                                    onChange={e => setNewPatientFields({ ...newPatientFields, clinicalSummary: { ...newPatientFields.clinicalSummary, primaryIndication: e.target.value } })}
                                    className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700 appearance-none"
                                >
                                    <option value="Female Factor">Female Factor (PCOS/Tubal)</option>
                                    <option value="Male Factor">Male Factor</option>
                                    <option value="Unexplained">Unexplained</option>
                                    <option value="Genetic">Genetic Screening (PGT-M)</option>
                                    <option value="Fertility Preservation">Fertility Preservation</option>
                                    <option value="Other">Other</option>
                                </select>
                                <textarea
                                    placeholder="Clinical details..."
                                    value={newPatientFields.clinicalSummary.indicationDetails}
                                    onChange={e => setNewPatientFields({ ...newPatientFields, clinicalSummary: { ...newPatientFields.clinicalSummary, indicationDetails: e.target.value } })}
                                    className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 min-h-[100px] text-sm font-medium"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">Reproductive History</label>
                                <div className="flex gap-4">
                                    {['None', '1', '2-3', '>3'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setNewPatientFields({ ...newPatientFields, clinicalSummary: { ...newPatientFields.clinicalSummary, previousCycles: opt as any } })}
                                            className={`flex-1 py-3 px-2 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${newPatientFields.clinicalSummary.previousCycles === opt ? 'border-[#1B7B6A] bg-[#1B7B6A]/5 text-[#1B7B6A]' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                                        >
                                            {opt} Cycles
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    placeholder="Obstetric history summary (gravida/para)..."
                                    value={newPatientFields.clinicalSummary.obstetricHistory}
                                    onChange={e => setNewPatientFields({ ...newPatientFields, clinicalSummary: { ...newPatientFields.clinicalSummary, obstetricHistory: e.target.value } })}
                                    className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 min-h-[100px] text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {modalStep === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100/50 space-y-6">
                            <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Donor & Third-Party Reproduction Ingestion
                            </h4>
                            <p className="text-xs text-emerald-700/70 font-bold leading-relaxed">
                                Detailed donor/surrogacy consent and eligibility documentation will be completed in separate forms as per ART Act 2021 and 21 CFR Part 1271 where applicable.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {['sperm', 'oocytes', 'embryos', 'surrogate'].map(flag => (
                                    <label key={flag} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-emerald-100/50 cursor-pointer hover:shadow-md transition-all">
                                        <input
                                            type="checkbox"
                                            checked={(newPatientFields.donorFlags as any)[flag]}
                                            onChange={e => setNewPatientFields({ ...newPatientFields, donorFlags: { ...newPatientFields.donorFlags, [flag]: e.target.checked } })}
                                            className="w-5 h-5 rounded border-gray-200 text-[#1B7B6A] focus:ring-[#1B7B6A]"
                                        />
                                        <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Donor {flag}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-6">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Infectious Disease Screening (Staff Only)</h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Determination Status</label>
                                    <select
                                        className="w-full p-4 bg-white border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700 appearance-none"
                                    >
                                        <option>Completed</option>
                                        <option>Planned</option>
                                        <option>Ineligible</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Final Donor Eligibility</label>
                                    <select
                                        className="w-full p-4 bg-white border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20 font-bold text-gray-700 appearance-none"
                                    >
                                        <option>Eligible</option>
                                        <option>Deferred</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {modalStep === 4 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Consent Agreements</h4>
                            <div className="space-y-3">
                                {[
                                    { key: 'treatmentSigned', label: 'Patient signed comprehensive IVF/ART treatment consent form.' },
                                    { key: 'storageSigned', label: 'Patient signed consent for storage/disposal of gametes/embryos.' },
                                    { key: 'grievanceSigned', label: 'Patient informed about clinic grievance redressal mechanism.' },
                                    { key: 'qualityImprovementConsent', label: 'Patient consents to de-identified use of clinical data for QI.' }
                                ].map(item => (
                                    <label key={item.key} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#1B7B6A]/20 cursor-pointer transition-all group">
                                        <input
                                            type="checkbox"
                                            checked={(newPatientFields.consents as any)[item.key]}
                                            onChange={e => setNewPatientFields({ ...newPatientFields, consents: { ...newPatientFields.consents, [item.key]: e.target.checked } })}
                                            className="mt-1 w-6 h-6 rounded-lg border-gray-200 text-[#1B7B6A] focus:ring-[#1B7B6A]"
                                        />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-700 group-hover:text-gray-900 transition-colors uppercase tracking-tight">{item.label}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">Verified by Staff • ART Act Schedule VII Compliance</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Privacy Controls</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newPatientFields.privacy.registryReportAgreement}
                                        onChange={e => setNewPatientFields({ ...newPatientFields, privacy: { ...newPatientFields.privacy, registryReportAgreement: e.target.checked } })}
                                        className="w-5 h-5 rounded border-gray-200 text-[#1B7B6A] focus:ring-[#1B7B6A]"
                                    />
                                    <span className="text-[10px] font-black text-[#1B7B6A] uppercase tracking-widest">Report to National Registry</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newPatientFields.privacy.noticeReceived}
                                        onChange={e => setNewPatientFields({ ...newPatientFields, privacy: { ...newPatientFields.privacy, noticeReceived: e.target.checked } })}
                                        className="w-5 h-5 rounded border-gray-200 text-[#1B7B6A] focus:ring-[#1B7B6A]"
                                    />
                                    <span className="text-[10px] font-black text-[#1B7B6A] uppercase tracking-widest">Data Privacy Notice Received</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {modalStep === 5 && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-gray-50 rounded-[32px] p-10 border border-gray-100 flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl shadow-emerald-500/20">
                                📄
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-gray-900">Affirm Information Accuracy</h4>
                                <p className="text-sm text-gray-500 font-medium max-w-md mx-auto mt-2">
                                    By registering, you confirm that all documented demographic, clinical, and consent data for {newPatientFields.partner1.name} has been verified against valid identifiers.
                                </p>
                            </div>

                            <div className="w-full max-w-md pt-8 space-y-4">
                                <div className="border-b-2 border-dashed border-gray-200 pb-2">
                                    <p className="text-[10px] font-black text-[#1B7B6A] uppercase tracking-widest mb-1">Authenticating Staff Initials</p>
                                    <input
                                        type="text"
                                        placeholder="e.g. BS"
                                        maxLength={3}
                                        value={newPatientFields.staffSignatureInitials}
                                        onChange={e => setNewPatientFields({ ...newPatientFields, staffSignatureInitials: e.target.value })}
                                        className="w-full bg-transparent text-center text-2xl font-bold text-gray-800 outline-none placeholder:text-gray-200"
                                    />
                                </div>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Electronic Signature Token: {Date.now().toString(36).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center px-10">
                <button
                    onClick={modalStep === 1 ? onCancel : () => setModalStep(s => s - 1)}
                    className="px-8 py-3 bg-white border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-all hover:shadow-sm active:scale-95"
                    type="button"
                >
                    {modalStep === 1 ? 'Discard Intake' : 'Previous Section'}
                </button>
                <button
                    onClick={() => {
                        if (modalStep < 5) {
                            setModalStep(s => s + 1);
                        } else {
                            const id = `p_new_${Date.now()}`;
                            const createdPatient: Patient = {
                                ...newPatientFields as Patient,
                                id,
                                displayId: newPatientFields.partner1.mrn || `MRN-${Date.now().toString().slice(-4)}`,
                                clinicId: 'c1'
                            };
                            onComplete(createdPatient);
                        }
                    }}
                    disabled={modalStep === 1 && !newPatientFields.partner1.name}
                    className={`px-12 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 ${modalStep === 1 && !newPatientFields.partner1.name ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-[#1B7B6A] hover:bg-[#0F5449] shadow-emerald-900/10'}`}
                    type="button"
                >
                    {modalStep === 5 ? 'Finalize & Create Profile' :
                        modalStep === 1 ? 'Next: Indicators' :
                            modalStep === 2 ? 'Next: Donor & Staff' :
                                modalStep === 3 ? 'Next: Consent & Privacy' :
                                    modalStep === 4 ? 'Next: Signatures' : 'Continue'}
                </button>
            </div>
        </div>
    );
};

export default PatientRegistrationWizard;

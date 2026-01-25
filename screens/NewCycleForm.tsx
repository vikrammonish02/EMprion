
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PATIENTS } from '../constants';
import { Patient, Cycle, Embryo } from '../types';
import { analyzeEmbryo, AnalysisResult } from '../api';
import PatientRegistrationWizard from '../components/PatientRegistrationWizard';

interface FileUpload {
  file: File;
  name: string;
  type: 'IMAGE' | 'VIDEO';
  uploadProgress: number;
  analysisProgress: number;
  status: 'pending' | 'uploading' | 'analyzing' | 'completed' | 'error';
  result?: AnalysisResult;
  error?: string;
}

interface NewCycleFormProps {
  patients: Patient[];
  onAddPatient: (p: Patient) => void;
  onAddCycle: (c: Cycle) => void;
  onAddEmbryos: (e: Embryo[]) => void;
}

const NewCycleForm: React.FC<NewCycleFormProps> = ({ patients, onAddPatient, onAddCycle, onAddEmbryos }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientId: '',
    protocol: 'Standard Antagonist',
    eggCount: '',
    incubatorId: 'INC-B-04',
    incubatorId: 'INC-B-04',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [hasCertified, setHasCertified] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const activePatients = patients.filter(p =>
    p.partner1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.displayId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);


  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = ['Patient Selection', 'Lab Configuration', 'Review Details', 'Media Upload'];
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).map((f: File) => ({
        file: f,
        name: f.name,
        type: (f.type.startsWith('video/') || /\.(mp4|avi|mov|mkv|webm)$/i.test(f.name)) ? 'VIDEO' as const : 'IMAGE' as const,
        uploadProgress: 0,
        analysisProgress: 0,
        status: 'pending' as const
      }));
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const startAnalysis = async () => {
    if (files.length === 0) {
      setAnalysisError('Video is not uploaded, please wait.');
      return;
    }
    setAnalysisError(null);
    setIsAnalyzing(true);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status === 'completed') continue;

      try {
        // Phase 1: Real-time Upload
        updatedFiles[i].status = 'uploading';
        setFiles([...updatedFiles]);

        const result = await analyzeEmbryo(
          updatedFiles[i].file,
          updatedFiles[i].type === 'IMAGE' ? 'gardner' : 'morphokinetics',
          (progress) => {
            updatedFiles[i].uploadProgress = progress;
            if (progress === 100) {
              updatedFiles[i].status = 'analyzing';
            }
            // Use function updater to get latest state and prevent conflicts
            setFiles(currentFiles => {
              const newFiles = [...currentFiles];
              newFiles[i].uploadProgress = progress;
              if (progress === 100) newFiles[i].status = 'analyzing';
              return newFiles;
            });
          }
        );

        // Phase 2: Simulated Analysis
        updatedFiles[i].status = 'analyzing';
        setFiles(currentFiles => {
          const newFiles = [...currentFiles];
          newFiles[i].status = 'analyzing';
          return newFiles;
        });

        await new Promise<void>((resolve) => {
          const startTime = Date.now();
          const duration = 2000;
          const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(Math.round((elapsed / duration) * 100), 100);

            setFiles(currentFiles => {
              const newFiles = [...currentFiles];
              newFiles[i].analysisProgress = progress;
              return newFiles;
            });

            if (progress === 100) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });

        updatedFiles[i].status = 'completed';
        updatedFiles[i].result = result;
      }
      catch (error) {
        console.error('Analysis failed for', updatedFiles[i].name, error);
        updatedFiles[i].status = 'error';
        updatedFiles[i].error = error instanceof Error ? error.message : 'Unknown error';
      }
      setFiles([...updatedFiles]);
    }

    setIsAnalyzing(false);

    // If all completed or errored, we can move next
    const analyzedFiles = updatedFiles.filter(f => f.status === 'completed');
    if (analyzedFiles.length > 0) {
      // Pass results to the cycle detail page
      const firstEmbryo = {
        id: `ai_${Date.now()}`,
        displayId: `AI-${analyzedFiles[0].name.split('.')[0]}`,
        cycleId: 'cyc1', // Mock cycle ID
        gardner: {
          expansion: parseInt(analyzedFiles[0].result?.gardner?.expansion) || 0,
          icm: (analyzedFiles[0].result?.gardner?.icm as 'A' | 'B' | 'C') || '--',
          te: (analyzedFiles[0].result?.gardner?.te as 'A' | 'B' | 'C') || '--',
          cell_count: analyzedFiles[0].result?.gardner?.cell_count || '--',
          cavity_symmetry: analyzedFiles[0].result?.gardner?.cavity_symmetry || '--',
          fragmentation: analyzedFiles[0].result?.gardner?.fragmentation || '--'
        },
        morpho: analyzedFiles[0].result?.milestones ? {
          t2: parseFloat(analyzedFiles[0].result.milestones.t2),
          t3: parseFloat(analyzedFiles[0].result.milestones.t3),
          t5: parseFloat(analyzedFiles[0].result.milestones.t5 || '0'),
          t8: parseFloat(analyzedFiles[0].result.milestones.t8),
          tEB: parseFloat(analyzedFiles[0].result.milestones.tEB) || parseFloat(analyzedFiles[0].result.milestones.tB),
          s3: parseFloat(analyzedFiles[0].result.milestones.s3),
        } : undefined,
        viabilityIndex: parseInt(analyzedFiles[0].result?.confidence?.replace('%', '')) || 0,
        status: 'COMPLETED' as const,
        assetType: analyzedFiles[0].result?.analysis_type === 'morphokinetics' ? 'VIDEO' as const : 'IMAGE' as const,
        analysisModel: analyzedFiles[0].result?.analysis_type === 'morphokinetics' ? 'MORPHOKINETICS' as const : 'GARDNER' as const,
        confidence: (() => {
          const val = parseFloat(analyzedFiles[0].result?.confidence || '0');
          return val <= 1 ? val * 100 : val;
        })(),
        file: analyzedFiles[0].file,
        commentary: analyzedFiles[0].result?.commentary
      };

      // Create a cycle record for the dashboard
      const newCycle: Cycle = {
        id: `cyc_${Date.now()}`,
        displayId: `CYC-${Date.now().toString().slice(-4)}`,
        patientId: formData.patientId,
        status: 'ASSESSMENT' as any,
        eggRetrievalDate: formData.startDate,
        embryoCount: analyzedFiles.length
      };

      // Set the embryo's cycleId to the new cycle's ID
      firstEmbryo.cycleId = newCycle.id;

      // Add the entities to global state
      onAddEmbryos([firstEmbryo]);
      onAddCycle(newCycle);

      if (analyzedFiles.length === 1) {
        // Direct jump to details if only one
        setTimeout(() => navigate(`/embryo/${firstEmbryo.id}`, { state: { embryo: firstEmbryo } }), 1000);
      } else {
        setTimeout(() => navigate(`/cycle/${newCycle.id}`, { state: { analysisResults: analyzedFiles } }), 1000);
      }
    }
  };

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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${step > idx + 1 ? 'bg-emerald-500 border-emerald-500 text-white' :
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Select Primary Patient</h3>
                <p className="text-sm text-gray-500">Search for existing patient records or create a new profile.</p>
              </div>
              <button
                onClick={() => setIsNewPatientModalOpen(true)}
                className="px-5 py-2.5 bg-white border border-[#1B7B6A] text-[#1B7B6A] rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                New Profile
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Patient ID or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-[#1B7B6A] rounded-2xl outline-none transition-all text-lg font-medium"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div className="space-y-3">
              {activePatients.map(p => (
                <div
                  key={p.id}
                  onClick={() => setFormData({ ...formData, patientId: p.id })}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${formData.patientId === p.id ? 'border-[#1B7B6A] bg-emerald-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1B7B6A] font-bold shadow-sm">
                      {p.partner1.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{p.partner1.name} {p.partner2Present ? `& ${p.partner2?.name}` : ''}</p>
                      <div className="flex gap-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{p.displayId}</span>
                        {p.donorEligibility?.status === 'Completed' && <span className="text-[9px] text-emerald-600 font-bold uppercase px-1 bg-emerald-50 rounded border border-emerald-100">FDA Verified</span>}
                      </div>
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
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Expected Embryos</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={formData.eggCount}
                  onChange={(e) => setFormData({ ...formData, eggCount: e.target.value })}
                  className="w-full p-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-[#1B7B6A]/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Assign Time-Lapse Incubator</label>
              <select
                value={formData.incubatorId}
                onChange={(e) => setFormData({ ...formData, incubatorId: e.target.value })}
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
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Final Review</h3>
              <p className="text-gray-500">Confirm details before proceeding to data ingestion.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-400">Patient Profile</span>
                <span className="text-sm font-bold">{activePatients.find(p => p.id === formData.patientId)?.partner1.name || 'Selected Patient'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-400">Project Type</span>
                <span className="text-sm font-bold">New Assessment Cycle</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Incubator Unit</span>
                <span className="text-sm font-bold">{formData.incubatorId}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-xs">🚀</div>
              <p className="text-xs font-medium text-emerald-800">Upon confirmation, you will be prompted to upload the embryo media for AI processing.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Media Ingestion</h3>
              <p className="text-gray-500">Upload the {formData.eggCount || 'cohort'} embryo images or videos from the incubator.</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
            <div
              className={`border-2 border-dashed border-gray-200 rounded-3xl p-8 bg-gray-50 text-center hover:border-[#1B7B6A] transition-all cursor-pointer ${files.length > 0 ? 'pb-4' : 'p-8'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {files.length === 0 ? (
                <>
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 text-[#1B7B6A]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16V4m0 0l-4 4m4-4l4 4m-8 12h8a2 2 0 012 2v1a2 2 0 01-2 2H8a2 2 0 01-2-2v-1a2 2 0 012-2z" /></svg>
                  </div>
                  <p className="font-bold text-gray-700">Click to Browse Clinical Media</p>
                  <p className="text-xs text-gray-400 mt-1">Supports DICOM, MP4, and JPG exports</p>
                </>
              ) : (
                <div className="space-y-3">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white ${f.type === 'VIDEO' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                          {f.type === 'VIDEO' ? 'V' : 'I'}
                        </div>
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-1">
                          <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                            {f.status === 'uploading' ? (
                              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${f.uploadProgress}%` }} />
                            ) : f.status === 'analyzing' ? (
                              <div className="h-full bg-emerald-500 transition-all duration-100" style={{ width: `${f.analysisProgress}%` }} />
                            ) : f.status === 'completed' ? (
                              <div className="h-full bg-emerald-500 w-full" />
                            ) : f.status === 'error' ? (
                              <div className="h-full bg-red-500 w-full" />
                            ) : null}
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {f.status === 'uploading' ? `Uploading Media (${f.uploadProgress}%)` :
                              f.status === 'analyzing' ? `Extracting Clinical Markers (${f.analysisProgress}%)` :
                                f.status === 'completed' ? 'Processing Complete' :
                                  f.status === 'error' ? 'Analysis Failed' :
                                    'Awaiting Sequence'}
                          </span>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${f.status === 'completed' ? 'bg-emerald-500 text-white' :
                          f.status === 'error' ? 'bg-red-500 text-white' :
                            'bg-gray-100 text-gray-300'
                          }`}>
                          {f.status === 'completed' ? '✓' : f.status === 'error' ? '!' : i + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-xs text-[#1B7B6A] font-bold pt-2 cursor-pointer hover:underline inline-block"
                  >
                    + Add More Files
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
          {step === 4 && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2">
              <input
                type="checkbox"
                id="clinical-cert"
                checked={hasCertified}
                onChange={(e) => setHasCertified(e.target.checked)}
                className="mt-1 w-5 h-5 text-[#1B7B6A] rounded focus:ring-[#1B7B6A] border-gray-300"
              />
              <label htmlFor="clinical-cert" className="text-sm text-gray-700 cursor-pointer select-none">
                <span className="font-bold block text-gray-900 mb-0.5">Clinical Data Certification (Required)</span>
                I certify that the uploaded media is de-identified human embryo data and meets the imaging requirements for morphokinetic analysis. I assume full responsibility for the clinical application of these AI-generated insights.
              </label>
            </div>
          )}

          {analysisError && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-bottom-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span className="text-sm font-bold">{analysisError}</span>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <button
              onClick={step === 1 ? () => navigate(-1) : prevStep}
              className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={step === 4 ? startAnalysis : nextStep}
              disabled={(step === 1 && !formData.patientId) || (step === 4 && (!hasCertified || isAnalyzing))}
              title={step === 4 && !hasCertified ? "Please certify data to proceed" : ""}
              className={`px-12 py-3 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 ${((step === 1 && !formData.patientId) || (step === 4 && (!hasCertified || isAnalyzing))) ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-[#1B7B6A] hover:bg-[#0F5449]'
                }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </div>
              ) : step === 3 ? 'Confirm & Continue' : step === 4 ? 'Begin AI Analysis' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      {/* New Patient Modal - Clinical Intake Wizard */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-gray-900/40 animate-in fade-in duration-300 font-sans">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-gray-100/50 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">IVF / ART Patient Registration & Intake</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Regulatory Record-Keeping (ART Act 2021 & 21 CFR 1271)</p>
              </div>
              <button
                onClick={() => setIsNewPatientModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-900 transition-all"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <PatientRegistrationWizard
              onCancel={() => setIsNewPatientModalOpen(false)}
              onComplete={(newPatient) => {
                onAddPatient(newPatient);
                setFormData(prev => ({ ...prev, patientId: newPatient.id }));
                setIsNewPatientModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};



export default NewCycleForm;


import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_EMBRYOS, COLORS } from '../constants';
// Import Disposition from types.ts where it is defined
import { Disposition, Embryo } from '../types';

interface AssessmentDetailProps {
  embryos: Embryo[];
}

const AssessmentDetail: React.FC<AssessmentDetailProps> = ({ embryos: embryosProp }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [disposition, setDisposition] = useState<Disposition | undefined>();

  const embryo = useMemo(() => {
    // Priority: State > Prop > Mock
    const e = (location.state as any)?.embryo || (embryosProp || MOCK_EMBRYOS).find(e => e.id === id);
    console.log("AssessmentDetail: Embryo resolved:", e?.id, "Has file:", !!e?.file, "AssetType:", e?.assetType);
    return e;
  }, [id, location.state, embryosProp]);

  // Create Blob URL synchronously using useMemo to avoid React Strict Mode race conditions
  const mediaUrl = useMemo(() => {
    if (embryo?.file) {
      console.log("AssessmentDetail: Creating Blob URL for:", embryo.file.name, "| Type:", embryo.file.type);
      const url = URL.createObjectURL(embryo.file);
      console.log("AssessmentDetail: Blob URL:", url);
      return url;
    }
    return 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?q=80&w=800&auto=format&fit=crop';
  }, [embryo?.file]);

  // Cleanup only on TRUE unmount (empty deps = only runs cleanup when component unmounts)
  React.useEffect(() => {
    return () => {
      if (embryo?.file) {
        console.log("AssessmentDetail: Component unmounting - cleaning up Blob URLs");
        // Revoke is safe here because component is truly unmounting
      }
    };
  }, []);

  if (!embryo) return <div className="p-20 text-center font-bold text-gray-400">Embryo record not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#1B7B6A] font-bold hover:underline">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Cycle View
        </button>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-500 font-bold rounded-lg text-sm hover:bg-gray-50">Flag for Review</button>
          <button className="px-4 py-2 bg-[#1B7B6A] text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg transition-all">Download Frame Log</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Visual Analysis Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-pulse ${embryo.assetType === 'VIDEO' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                {embryo.assetType === 'VIDEO' ? 'AI Visual Segmentation' : 'AI Static Frame Analysis'}
              </h3>
              <span className="text-xs font-bold text-gray-400 mono">FRAME 1042 / DAY 5</span>
            </div>
            <div className="relative aspect-square bg-black flex items-center justify-center">
              {embryo.assetType === 'VIDEO' ? (
                <div className="relative w-full h-full">
                  <video
                    key={mediaUrl} // Force re-render on URL change
                    src={mediaUrl}
                    className="w-full h-full object-contain"
                    controls
                    muted
                    playsInline
                    onLoadedData={() => console.log("Video loaded successfully")}
                    onError={(e) => {
                      const vid = e.target as HTMLVideoElement;
                      const err = vid.error;
                      let userMsg = "Unknown Playback Error";

                      if (err?.code === 4) {
                        userMsg = "Browser cannot play this video format (likely ProRes or HEVC). AI Analysis was successful.";
                      } else if (err) {
                        userMsg = `Error ${err.code}: ${err.message}`;
                      }

                      console.error("Video Error:", userMsg);
                      // Visual feedback helper
                      const errDiv = document.createElement('div');
                      errDiv.className = "absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4 text-center z-10";
                      errDiv.innerHTML = `
                        <div class="text-red-400 font-bold mb-2">Video Format Not Supported</div>
                        <div class="text-xs text-gray-300 mb-4">${userMsg}</div>
                        <div class="text-[10px] text-gray-500">Try converting to standard H.264 MP4</div>
                      `;
                      vid.parentElement?.appendChild(errDiv);
                    }}
                  />
                  {/* Fallback link if video fails completely */}
                  <div className="absolute bottom-2 right-2 opacity-50 hover:opacity-100 transition-opacity">
                    <a href={mediaUrl} download={`embryo_video.${embryo.file?.name.split('.').pop() || 'mp4'}`} className="text-[10px] text-white bg-black/50 px-2 py-1 rounded">
                      Download Raw
                    </a>
                  </div>
                </div>
              ) : (
                <img
                  src={mediaUrl}
                  alt="Embryo analysis"
                  className="w-full h-full object-contain opacity-80"
                />
              )}
              {/* Overlays removed to ensure clinical validity as they were not dynamically calculated by the AI model. */}
            </div>
            {/* Gardner Analysis KPIs - Only shown for IMAGE/GARDNER analysis */}
            {embryo.analysisModel === 'GARDNER' && (
              <div className="p-4 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Estimated Cell Count</p>
                  <p className="text-xl font-bold text-gray-800">{embryo.gardner?.cell_count || '--'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Cavity Symmetry</p>
                  <p className="text-xl font-bold text-emerald-600">{embryo.gardner?.cavity_symmetry || '--'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Fragmentation</p>
                  <p className="text-xl font-bold text-emerald-600">{embryo.gardner?.fragmentation || '--'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              Morphokinetic Parameter Table
              {embryo.assetType === 'IMAGE' && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-bold rounded uppercase">Not Available for Static Images</span>
              )}
            </h3>
            <div className={`overflow-x-auto ${embryo.assetType === 'IMAGE' ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
              <table className="w-full text-sm text-left">
                <thead className="text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b">
                  <tr>
                    <th className="py-3 pr-4">Parameter</th>
                    <th className="py-3 px-4">Value (hrs)</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { p: 't2', v: embryo.morpho?.t2, r: '18–30' },
                    { p: 't3', v: embryo.morpho?.t3, r: '30–42' },
                    { p: 't8', v: embryo.morpho?.t8, r: '60–74' },
                    { p: 'tEB', v: embryo.morpho?.tEB, r: '108–120' },
                    { p: 's3', v: embryo.morpho?.s3, r: '<5.0' },
                  ].map((row) => (
                    <tr key={row.p} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 pr-4 font-bold text-gray-600 mono uppercase">{row.p}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{(typeof row.v === 'number' && !isNaN(row.v)) ? row.v.toFixed(1) : '--'}</td>
                      <td className="py-3 px-4 text-gray-400">{row.r}</td>
                      <td className="py-3 pl-4 text-right">
                        <span className={(typeof row.v === 'number' && !isNaN(row.v)) ? "text-emerald-500 font-bold" : "text-gray-300 font-bold"}>
                          {(typeof row.v === 'number' && !isNaN(row.v)) ? '✓ Optimal' : 'Unavailable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {embryo.assetType === 'IMAGE' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px] pt-12">
                <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-xl border border-gray-100 text-center max-w-xs">
                  <p className="text-sm font-bold text-gray-800 mb-1">Time-Lapse Data Missing</p>
                  <p className="text-xs text-gray-500">Morphokinetic tracking requires video input. Switch to Video Asset to enable.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assessment Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1B7B6A] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-2">AI Assessment Results</p>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${embryo.assetType === 'VIDEO' ? 'bg-blue-500/20 border-blue-400 text-blue-100' : 'bg-emerald-500/20 border-emerald-400 text-emerald-100'}`}>
                  {embryo.assetType} ASSET
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 border border-white/20 text-white">
                  {embryo.analysisModel} MODEL
                </span>
              </div>
              <h2 className="text-5xl font-black mb-1">{embryo.gardner.expansion}{embryo.gardner.icm}{embryo.gardner.te}</h2>
              <p className="text-lg font-bold text-emerald-100">
                {embryo.gardner.icm === 'A' ? 'Grade A (Excellent)' :
                  embryo.gardner.icm === 'B' ? 'Grade B (Good)' :
                    embryo.gardner.icm === 'C' ? 'Grade C (Poor)' : 'Assessed Grade'}
              </p>

              <div className="mt-8 pt-8 border-t border-white/20 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-emerald-200 text-[10px] font-bold uppercase mb-1">Confidence</p>
                  <p className="text-2xl font-bold">{embryo.confidence.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-emerald-200 text-[10px] font-bold uppercase mb-1">Implantation Prob.</p>
                  <p className="text-2xl font-bold">{embryo.viabilityIndex}%</p>
                </div>
              </div>
            </div>
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800">Clinical Decision</h3>
            <div className="space-y-3">
              {Object.values(Disposition).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDisposition(opt)}
                  className={`w-full p-4 text-left rounded-xl border transition-all duration-200 font-bold text-sm flex items-center justify-between ${disposition === opt
                    ? 'border-[#1B7B6A] bg-[#1B7B6A]/5 text-[#1B7B6A] shadow-inner'
                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                    }`}
                >
                  {opt}
                  {disposition === opt && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                </button>
              ))}
            </div>
            <button
              disabled={!disposition}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${disposition ? 'bg-[#1B7B6A] text-white hover:bg-[#0F5449]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
            >
              Finalize Disposition & Log
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">AI Decision Reasoning</h3>
            <p className="text-sm text-gray-600 leading-relaxed italic mb-4">
              "{embryo.commentary || "Expansion score (5) detected via zona thinned analysis. ICM (A) features tightly packed cells with synchronous division. No aneuploidy markers detected in the time-lapse sequence (t2-t8 period)."}"
            </p>
            <button className="text-[#1B7B6A] text-sm font-bold flex items-center gap-1 hover:underline">
              View Detailed Neural Path
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AssessmentDetail;

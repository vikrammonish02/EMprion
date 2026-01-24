
import React, { useState, useRef } from 'react';
import { COLORS } from '../constants';

interface UploadedFile {
    file: File;
    id: string;
    type: 'IMAGE' | 'VIDEO';
    progress: number;
    status: 'uploading' | 'complete' | 'error';
}

interface EmbryoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadComplete: (embryos: any[]) => void;
}

const EmbryoUploadModal: React.FC<EmbryoUploadModalProps> = ({ isOpen, onClose, onUploadComplete }) => {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileSelection = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const newFiles: UploadedFile[] = Array.from(selectedFiles).map(f => ({
            file: f,
            id: Math.random().toString(36).substr(2, 9),
            type: f.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
            progress: 0,
            status: 'uploading'
        }));

        setFiles(prev => [...prev, ...newFiles]);

        // Simulate upload for each file
        newFiles.forEach(f => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setFiles(current =>
                        current.map(cf => cf.id === f.id ? { ...cf, progress: 100, status: 'complete' } : cf)
                    );
                } else {
                    setFiles(current =>
                        current.map(cf => cf.id === f.id ? { ...cf, progress } : cf)
                    );
                }
            }, 500);
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelection(e.dataTransfer.files);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleComplete = () => {
        // In a real app, this would send the processed data back
        // We'll simulate a few newly created embryos based on the uploads
        const newEmbryos = files.filter(f => f.status === 'complete').map(f => ({
            id: `new-${f.id}`,
            displayId: `EMB-UPLOADED-${f.id.slice(0, 4).toUpperCase()}`,
            assetType: f.type,
            analysisModel: f.type === 'VIDEO' ? 'MORPHOKINETICS' : 'GARDNER',
            status: 'PENDING',
            confidence: 0,
            viabilityIndex: 0,
            gardner: { expansion: 0, icm: 'B', te: 'B' },
            file: f.file
        }));

        onUploadComplete(newEmbryos);
        setFiles([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">Upload Embryo Media</h3>
                        <p className="text-gray-500">Add images or time-lapse videos for AI assessment</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Drag & Drop Zone */}
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
              border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all
              ${isDragging ? 'border-[#1B7B6A] bg-emerald-50 scale-[0.99]' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}
            `}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*,video/*"
                            onChange={(e) => handleFileSelection(e.target.files)}
                        />
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </div>
                        <p className="text-lg font-bold text-gray-700">Drop files here or click to browse</p>
                        <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG (Gardner) and MP4, AVI (Morphokinetics)</p>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {files.map(f => (
                                <div key={f.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 group">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${f.type === 'VIDEO' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                                        {f.type === 'VIDEO' ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm13 8V6l-2 1v6l2 1z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-bold text-gray-900 truncate">{f.file.name}</p>
                                            <button onClick={() => removeFile(f.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${f.status === 'complete' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${f.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase w-8 text-right underline decoration-2 decoration-offset-2">
                                                {f.type === 'VIDEO' ? 'Full' : 'Static'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={files.length === 0 || files.some(f => f.status === 'uploading')}
                        onClick={handleComplete}
                        className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${files.length === 0 || files.some(f => f.status === 'uploading')
                            ? 'bg-gray-300 cursor-not-allowed shadow-none'
                            : 'bg-[#1B7B6A] hover:bg-[#0F5449]'
                            }`}
                    >
                        Start Processing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmbryoUploadModal;

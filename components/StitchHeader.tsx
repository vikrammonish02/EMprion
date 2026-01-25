import React from 'react';
import { useLocation } from 'react-router-dom';

const StitchHeader: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Worklist Dashboard';
        if (path.startsWith('/patients')) return 'Clinical Registry';
        if (path.startsWith('/cycle')) return 'Case Lifecycle';
        if (path.startsWith('/embryo')) return 'AI Assessment';
        return 'Lab Console';
    };

    return (
        <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>

                <div className="hidden sm:block">
                    <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <span className="hover:text-[#1B7B6A] cursor-pointer transition-colors leading-none">Console</span>
                        <span className="text-gray-200">/</span>
                        <span className="text-gray-900 leading-none">{getPageTitle()}</span>
                    </nav>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <p className="text-xs font-black text-gray-900 leading-none mb-1">Dr. Vikram M.</p>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Lab Director</p>
                </div>

                <div className="relative group">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 group-hover:shadow-md transition-all cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute right-0 top-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-4 border-white"></div>
                </div>
            </div>
        </header>
    );
};

export default StitchHeader;

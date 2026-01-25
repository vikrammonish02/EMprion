import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ICONS } from '../constants';

const StitchSidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: ICONS.Dashboard },
        { name: 'Patients', path: '/patients', icon: ICONS.Dashboard }, // Using Dashboard icon as placeholder for Patients
        { name: 'Assessment', path: '/assessment', icon: ICONS.Assessment },
        { name: 'Reports', path: '/reports', icon: ICONS.Reports },
    ];

    const NavContent = () => (
        <div className="h-full flex flex-col p-8 space-y-10">
            {/* Branding Area */}
            <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1B7B6A] to-[#7ECCC3] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <span className="text-white text-2xl font-black italic">E</span>
                </div>
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tighter">EMBRION <span className="text-[#1B7B6A]">AI</span></h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Clinical Suite v3</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => { if (window.innerWidth < 1024) toggle(); }}
                        className={({ isActive }) =>
                            `group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden ${isActive
                                ? 'bg-emerald-50 text-[#1B7B6A] shadow-inner'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`relative z-10 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                                    <item.icon />
                                </div>
                                <span className="relative z-10 font-black text-xs uppercase tracking-widest">{item.name}</span>
                                {isActive && (
                                    <div className="absolute left-0 top-0 w-1.5 h-full bg-[#1B7B6A] rounded-r-full"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Laboratory Status */}
            <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100/50 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lab Status</p>
                    <div className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-black text-gray-800">Main Facility-01</p>
                    <p className="text-[10px] font-medium text-gray-400 italic">Connected & Secure</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 bg-white border-r border-gray-100 h-full">
                <NavContent />
            </aside>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 z-50 transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={toggle}></div>
                <aside className={`absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <NavContent />
                </aside>
            </div>
        </>
    );
};

export default StitchSidebar;


import React from 'react';
import { NavLink } from 'react-router-dom';
import { ICONS, COLORS } from '../constants';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: <ICONS.Dashboard />, path: '/' },
    { name: 'Cycles & Patients', icon: <ICONS.Cycles />, path: '/patients' },
    { name: 'Assessment', icon: <ICONS.Assessment />, path: '/assessment' },
    { name: 'Reports', icon: <ICONS.Reports />, path: '/reports' },
    { name: 'Settings', icon: <ICONS.Settings />, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Subhag Logo" className="h-10 object-contain" />
        </div>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-[#1B7B6A] text-white shadow-lg'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-[#1B7B6A]'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-semibold mb-1">CURRENT USER</p>
          <p className="text-sm font-bold text-gray-800">Dr. Sarah Johnson</p>
          <p className="text-xs text-gray-400">Senior Embryologist</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

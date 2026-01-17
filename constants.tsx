
import React from 'react';
import { Patient, Cycle, CycleStatus, Embryo, Disposition } from './types';

export const COLORS = {
  primary: '#1B7B6A',
  primaryLight: '#7ECCC3',
  primaryDark: '#0F5449',
  bg: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  neutral: '#9CA3AF'
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    displayId: 'SUB-PATIENT-24091',
    husbandName: 'John Doe',
    wifeName: 'Jane Doe',
    husbandAge: 34,
    wifeAge: 32,
    clinicId: 'c1'
  }
];

export const MOCK_CYCLES: Cycle[] = [
  {
    id: 'cyc1',
    displayId: 'CYC-2026-001',
    patientId: 'p1',
    status: CycleStatus.ASSESSMENT,
    eggRetrievalDate: '2026-01-15',
    embryoCount: 15
  }
];

export const MOCK_EMBRYOS: Embryo[] = Array.from({ length: 15 }, (_, i) => ({
  id: `e${i + 1}`,
  displayId: `EMB-24091-E${(i + 1).toString().padStart(2, '0')}`,
  cycleId: 'cyc1',
  gardner: {
    expansion: Math.floor(Math.random() * 5) + 1,
    icm: ['A', 'B', 'C'][Math.floor(Math.random() * 3)] as any,
    te: ['A', 'B', 'C'][Math.floor(Math.random() * 3)] as any
  },
  morpho: {
    t2: 28.5 + (Math.random() * 2 - 1),
    t3: 37.0 + (Math.random() * 4 - 2),
    t5: 45.0 + (Math.random() * 5 - 2.5),
    t8: 68.0 + (Math.random() * 10 - 5),
    tEB: 110.0 + (Math.random() * 10 - 5),
    s3: 3.2 + Math.random() * 2
  },
  viabilityIndex: Math.floor(Math.random() * 40) + 50,
  confidence: 85 + Math.random() * 14,
  // Added type assertion to fix the status type mismatch
  status: (i < 12 ? 'COMPLETED' : 'PENDING') as 'COMPLETED' | 'PENDING'
})).sort((a, b) => b.viabilityIndex - a.viabilityIndex);

export const ICONS = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Cycles: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Assessment: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Reports: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

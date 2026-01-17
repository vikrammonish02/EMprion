
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './screens/DashboardHome';
import CycleDetail from './screens/CycleDetail';
import AssessmentDetail from './screens/AssessmentDetail';
import PatientsList from './screens/PatientsList';
import AssessmentOverview from './screens/AssessmentOverview';
import NewCycleForm from './screens/NewCycleForm';
import ReportsDashboard from './screens/ReportsDashboard';
import { MOCK_CYCLES, MOCK_PATIENTS } from './constants';
import { Cycle, Patient } from './types';

const App: React.FC = () => {
  const [activeCycles] = useState<Cycle[]>(MOCK_CYCLES);
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<DashboardHome cycles={activeCycles} />} />
            <Route path="/patients" element={<PatientsList patients={patients} />} />
            <Route path="/cycle/:id" element={<CycleDetail />} />
            <Route path="/assessment" element={<AssessmentOverview />} />
            <Route path="/embryo/:id" element={<AssessmentDetail />} />
            <Route path="/new-cycle" element={<NewCycleForm />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="*" element={<div className="text-center mt-20 text-gray-400">Section Under Development</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;

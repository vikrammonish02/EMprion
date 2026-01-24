
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardHome from './screens/DashboardHome';
import CycleDetail from './screens/CycleDetail';
import AssessmentDetail from './screens/AssessmentDetail';
import PatientsList from './screens/PatientsList';
import AssessmentOverview from './screens/AssessmentOverview';
import PatientDetail from './screens/PatientDetail';
import NewPatientForm from './screens/NewPatientForm';
import NewCycleForm from './screens/NewCycleForm';
import ReportsDashboard from './screens/ReportsDashboard';
import { MOCK_CYCLES, MOCK_PATIENTS, MOCK_EMBRYOS } from './constants';
import { Cycle, Patient, Embryo } from './types';

const App: React.FC = () => {
  // Load initial state from localStorage or fallback to mocks
  const [activeCycles, setActiveCycles] = useState<Cycle[]>(() => {
    const saved = localStorage.getItem('EMBRION_CYCLES');
    return saved ? JSON.parse(saved) : MOCK_CYCLES;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('EMBRION_PATIENTS');
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });

  const [activeEmbryos, setActiveEmbryos] = useState<Embryo[]>(() => {
    const saved = localStorage.getItem('EMBRION_EMBRYOS');
    return saved ? JSON.parse(saved) : MOCK_EMBRYOS;
  });

  // Persist changes to localStorage
  React.useEffect(() => {
    localStorage.setItem('EMBRION_CYCLES', JSON.stringify(activeCycles));
  }, [activeCycles]);

  React.useEffect(() => {
    localStorage.setItem('EMBRION_PATIENTS', JSON.stringify(patients));
  }, [patients]);

  React.useEffect(() => {
    localStorage.setItem('EMBRION_EMBRYOS', JSON.stringify(activeEmbryos));
  }, [activeEmbryos]);

  const addPatient = (p: Patient) => setPatients(prev => [...prev, p]);
  const addCycle = (c: Cycle) => setActiveCycles(prev => [c, ...prev]);
  const addEmbryos = (e: Embryo[]) => setActiveEmbryos(prev => [...e, ...prev]);
  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    // Also optional: cleanup cycles/embryos? For data safety, keeping them orphaned or cascading delete is a choice.
    // For now, simple soft delete of patient record. 
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<DashboardHome cycles={activeCycles} patients={patients} />} />
            <Route path="/patients" element={<PatientsList patients={patients} onDeletePatient={deletePatient} />} />
            <Route path="/new-patient" element={<NewPatientForm onAddPatient={addPatient} />} />
            <Route path="/patient/:id" element={<PatientDetail patients={patients} cycles={activeCycles} embryos={activeEmbryos} />} />
            <Route path="/cycle/:id" element={<CycleDetail cycles={activeCycles} embryos={activeEmbryos} onAddEmbryos={addEmbryos} />} />
            <Route path="/assessment" element={<AssessmentOverview embryos={activeEmbryos} cycles={activeCycles} />} />
            <Route path="/embryo/:id" element={<AssessmentDetail embryos={activeEmbryos} />} />
            <Route
              path="/new-cycle"
              element={
                <NewCycleForm
                  patients={patients}
                  onAddPatient={addPatient}
                  onAddCycle={addCycle}
                  onAddEmbryos={addEmbryos}
                />
              }
            />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="*" element={<div className="text-center mt-20 text-gray-400">Section Under Development</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;

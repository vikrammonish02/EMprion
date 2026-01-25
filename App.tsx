
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import StitchSidebar from './components/StitchSidebar';
import StitchHeader from './components/StitchHeader';
import DashboardHome from './screens/DashboardHome';
import CycleDetail from './screens/CycleDetail';
import AssessmentDetail from './screens/AssessmentDetail';
import PatientsList from './screens/PatientsList';
import AssessmentOverview from './screens/AssessmentOverview';
import PatientDetail from './screens/PatientDetail';
import NewPatientForm from './screens/NewPatientForm';
import NewCycleForm from './screens/NewCycleForm';
import ReportsDashboard from './screens/ReportsDashboard';
import StitchDashboard from './screens/StitchDashboard';
import StitchAssessmentDetail from './screens/StitchAssessmentDetail';
import StitchCycleDetail from './screens/StitchCycleDetail';
import StitchPatientsList from './screens/StitchPatientsList';
import StitchPatientDetail from './screens/StitchPatientDetail';
import StitchAssessmentOverview from './screens/StitchAssessmentOverview';
import { MOCK_CYCLES, MOCK_PATIENTS, MOCK_EMBRYOS } from './constants';
import { Cycle, Patient, Embryo } from './types';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <StitchSidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-screen">
        <StitchHeader onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="p-4 md:p-10 max-w-[1600px] mx-auto min-h-full flex flex-col">
            <Routes>
              {/* New Stitch Routes */}
              <Route path="/" element={<StitchDashboard cycles={activeCycles} patients={patients} />} />
              <Route path="/patients" element={<StitchPatientsList patients={patients} onDeletePatient={deletePatient} />} />
              <Route path="/patient/:id" element={<StitchPatientDetail patients={patients} cycles={activeCycles} embryos={activeEmbryos} />} />
              <Route path="/cycle/:id" element={<StitchCycleDetail cycles={activeCycles} embryos={activeEmbryos} onAddEmbryos={addEmbryos} />} />
              <Route path="/assessment" element={<StitchAssessmentOverview embryos={activeEmbryos} cycles={activeCycles} />} />
              <Route path="/embryo/:id" element={<StitchAssessmentDetail embryos={activeEmbryos} />} />
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
              <Route path="*" element={<div className="text-center mt-20 text-gray-400 font-black uppercase tracking-widest">Section Under Neural Development</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

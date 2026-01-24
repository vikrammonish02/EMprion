import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types';
import PatientRegistrationWizard from '../components/PatientRegistrationWizard';

interface NewPatientFormProps {
    onAddPatient: (patient: Patient) => void;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({ onAddPatient }) => {
    const navigate = useNavigate();

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">Register New Patient</h2>
                    <p className="text-gray-500 font-medium mt-1">Enroll a new patient pair for clinical tracking</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                <PatientRegistrationWizard
                    onCancel={() => navigate('/patients')}
                    onComplete={(newPatient) => {
                        onAddPatient(newPatient);
                        navigate('/patients');
                    }}
                />
            </div>
        </div>
    );
};

export default NewPatientForm;

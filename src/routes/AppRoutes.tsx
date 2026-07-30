import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { PatientLayout } from '@/layouts/PatientLayout';
import { HospitalLayout } from '@/layouts/HospitalLayout';

import { DoctorLayout } from '@/layouts/DoctorLayout';
import { DoctorDashboard } from '@/pages/doctor/Dashboard';
import { SearchPatient } from '@/pages/doctor/SearchPatient';
import { MyPatients } from '@/pages/doctor/MyPatients';
import { PatientDetail } from '@/pages/doctor/PatientDetail';

import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { PatientDashboard } from '@/pages/patient/Dashboard';
import { PatientTimeline } from '@/pages/patient/Timeline';
import { PatientRecords } from '@/pages/patient/Records';
import { PatientConsents } from '@/pages/patient/Consents';

import { HospitalDashboard } from '@/pages/hospital/Dashboard';
import { AddRecord } from '@/pages/hospital/AddRecord';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<div className="p-8 text-center">How it works coming soon...</div>} />
        </Route>

        {/* Auth Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Patient App Routes */}
        <Route path="/patient" element={<PatientLayout />}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="timeline" element={<PatientTimeline />} />
          <Route path="records" element={<PatientRecords />} />
          <Route path="consents" element={<PatientConsents />} />
          <Route path="emergency" element={<div className="p-4">Emergency Profile (Step 10)</div>} />
        </Route>

        {/* Hospital App Routes */}
        <Route path="/hospital" element={<HospitalLayout />}>
          <Route path="dashboard" element={<HospitalDashboard />} />
          <Route path="add-record" element={<AddRecord />} />
          <Route path="patients" element={<div className="p-4">Patient Directory (Step 7)</div>} />
        </Route>

       {/* Doctor App Routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<MyPatients />} /> 
          <Route path="patients/:id" element={<PatientDetail />} /> 
          <Route path="search" element={<SearchPatient />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
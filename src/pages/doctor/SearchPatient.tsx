import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, User, ShieldAlert, FileEdit, Eye, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';

export const SearchPatient = () => {
  const [searchStatus, setSearchStatus] = useState<'IDLE' | 'SEARCHING' | 'FOUND' | 'REQUEST_SENT'>('IDLE');
  const [upharId, setUpharId] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [duration, setDuration] = useState('24 Hours');
  const [error, setError] = useState('');

  const [doctorData, setDoctorData] = useState<any>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const res = await fetch('http://127.0.0.1:8000/users/');
        const users = await res.json();
        const dbUser = users.find((u: any) => u.email === user.email);
        if (dbUser) setDoctorData(dbUser);
      }
    };
    fetchDoctorData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchStatus('SEARCHING');
    setError('');
    
    try {
      let searchId = upharId.trim().toUpperCase();
      if (/^\d+$/.test(searchId)) {
        searchId = `UPH-${searchId}`;
      }

      const res = await fetch('http://127.0.0.1:8000/users/');
      const users = await res.json();
      
      const patient = users.find((u: any) => u.uphar_id === searchId && u.role === 'patient');
      
      if (patient) {
        setPatientData(patient);
        setSearchStatus('FOUND');
        setShowRequestForm(false);
      } else {
        setError('Patient not found! Please check the UPHAR ID.');
        setSearchStatus('IDLE');
      }
    } catch (err) {
      setError('Server error. Is FastAPI running?');
      setSearchStatus('IDLE');
    }
  };

  const sendConsentRequest = async () => {
    setActionLoading(true);
    try {
      const payload = {
        patient_id: patientData.id,
        doctor_id: doctorData.id,
        doctor_name: doctorData.name,
        hospital_name: doctorData.specialization || 'Independent Clinic',
        access_type: 'View & Modify',
        duration: duration
      };

      const res = await fetch('http://127.0.0.1:8000/consents/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSearchStatus('REQUEST_SENT');
      } else {
        alert('Failed to send request');
      }
    } catch (err) {
      alert('Server error while sending request');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Search Patient</h1>
        <p className="text-sm text-slate-500 mt-1">Enter a patient's UPHAR ID to view their medical history directly, or request modification access to add records.</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Enter Patient ID (e.g., UPH-140151)" 
              className="pl-10 h-12 text-lg uppercase font-mono" 
              required 
              value={upharId}
              onChange={(e) => setUpharId(e.target.value.toUpperCase())}
            />
          </div>
          <Button type="submit" className="h-12 px-8" disabled={searchStatus === 'SEARCHING'}>
            {searchStatus === 'SEARCHING' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </Button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
      </div>

      {searchStatus === 'FOUND' && patientData && (
        <div className="bg-white border rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{patientData.name}</h3>
              <p className="text-slate-500">Patient ID: {patientData.uphar_id}</p>
            </div>
          </div>

          {!showRequestForm ? (
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-2">
                <Eye className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p>You can currently <strong>view</strong> this patient's medical timeline directly. To add new prescriptions or upload records, you must request modification access.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to={`/doctor/patients/${patientData.id}`} className="flex-1">
                  <Button className="w-full h-12 text-base gap-2">
                    <Eye className="w-5 h-5" /> View Patient Timeline <ArrowRight className="w-4 h-4"/>
                  </Button>
                </Link>
                
                <Button variant="outline" onClick={() => setShowRequestForm(true)} className="flex-1 h-12 text-base gap-2 border-slate-300">
                  <FileEdit className="w-5 h-5" /> Request Modify Access
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-orange-500" /> Request Modification Access
              </h4>
              
              <div className="bg-slate-50 border p-4 rounded-xl flex gap-3 text-sm text-slate-700">
                 <FileEdit className="h-5 w-5 text-primary shrink-0" />
                 <p>You are requesting <strong>Full Modify Access</strong> to upload records, add consultation notes, and issue digital prescriptions to this patient's timeline.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Access Duration</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="24 Hours">24 Hours (Standard Visit)</option>
                  <option value="7 Days">7 Days (Ongoing Care)</option>
                  <option value="1 Month">1 Month (Chronic Treatment)</option>
                </select>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                <Button onClick={sendConsentRequest} className="flex-1 gap-2" disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <ShieldAlert className="w-5 h-5" />} 
                  Send Request
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {searchStatus === 'REQUEST_SENT' && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center animate-in zoom-in duration-300">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-1">Authorization Request Sent!</h3>
          <p className="text-sm">The patient has been notified. They need to approve this from their UPHAR portal before you can modify records.</p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100" onClick={() => {setSearchStatus('IDLE'); setUpharId('');}}>
              Search Another Patient
            </Button>
            <Link to={`/doctor/patients/${patientData?.id}`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Go to Timeline (View Only)</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
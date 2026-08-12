import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadCloud, Search, CheckCircle, AlertCircle, FileText, UserCheck, ChevronRight } from 'lucide-react';
import { supabase } from '@/supabaseClient';

export const AddRecord = () => {
  const [hospitalName, setHospitalName] = useState('Authorized Hospital');
  const [step, setStep] = useState(1);
  const [patientData, setPatientData] = useState<any>(null);
  
  const [upharId, setUpharId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Lab Result');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchHospitalData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const res = await fetch('http://127.0.0.1:8000/users/');
          const users = await res.json();
          const dbUser = users.find((u: any) => u.email === user.email);
          if (dbUser) setHospitalName(dbUser.name);
        } catch (err) {}
      }
    };
    fetchHospitalData();
  }, []);

  const handleSearchVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      // FIX: Format the ID properly
      let searchId = upharId.trim().toUpperCase();
      if (/^\d+$/.test(searchId)) {
        searchId = `UPH-${searchId}`;
      }

      const usersRes = await fetch('http://127.0.0.1:8000/users/');
      const users = await usersRes.json();
      
      // FIX: Match against uphar_id
      const patient = users.find((u: any) => u.uphar_id === searchId && u.role === 'patient');
      
      if (!patient) {
        setMessage({ type: 'error', text: 'Patient not found! Please check the UPHAR ID.' });
      } else {
        setPatientData(patient);
        setStep(2); 
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error. Is FastAPI running?' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recordData = { title, category, date, provider_name: hospitalName };
      const response = await fetch(`http://127.0.0.1:8000/users/${patientData.id}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Record successfully uploaded to ${patientData.name}'s timeline!` });
        setStep(1); setUpharId(''); setTitle(''); setPatientData(null); 
      } else {
        setMessage({ type: 'error', text: 'Failed to save record.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Medical Record</h1>
        <p className="text-sm text-slate-500 mt-1">Upload verified documents directly to a patient's UPHAR timeline.</p>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        
        {/* Progress Stepper */}
        <div className="flex items-center bg-slate-50 border-b px-6 py-4">
          <div className={`flex items-center gap-2 text-sm font-bold ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step >= 1 ? 'bg-primary' : 'bg-slate-300'}`}>1</span> Search
          </div>
          <ChevronRight className="w-4 h-4 mx-4 text-slate-300" />
          <div className={`flex items-center gap-2 text-sm font-bold ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step >= 2 ? 'bg-primary' : 'bg-slate-300'}`}>2</span> Verify
          </div>
          <ChevronRight className="w-4 h-4 mx-4 text-slate-300" />
          <div className={`flex items-center gap-2 text-sm font-bold ${step === 3 ? 'text-primary' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step === 3 ? 'bg-primary' : 'bg-slate-300'}`}>3</span> Upload
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
              {message.text}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSearchVerify} className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="space-y-3 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600"/> Enter Patient's UPHAR ID
                </label>
                <div className="flex gap-4">
                  <Input type="text" placeholder="e.g. UPH-105" required value={upharId} onChange={(e) => setUpharId(e.target.value.toUpperCase())} className="font-mono uppercase h-12 text-lg w-full max-w-sm" />
                  <Button type="submit" className="h-12 px-8 shadow-md" disabled={loading}>{loading ? 'Searching...' : 'Search Patient'}</Button>
                </div>
                <p className="text-xs text-slate-500">Ask the patient for their Unique Health ID generated during signup.</p>
              </div>
            </form>
          )}

          {step === 2 && patientData && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="bg-slate-50 border rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><UserCheck className="w-5 h-5 text-green-600"/> Please verify patient details</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-white p-4 rounded-lg border shadow-sm">
                  <div><p className="text-sm text-slate-500 font-medium">Patient Name</p><p className="text-xl font-bold text-slate-900">{patientData.name}</p></div>
                  <div><p className="text-sm text-slate-500 font-medium">UPHAR ID</p><p className="text-lg font-mono font-bold text-primary">{patientData.uphar_id || `UPH-${patientData.id}`}</p></div>
                  <div><p className="text-sm text-slate-500 font-medium">Date of Birth</p><p className="text-base font-semibold text-slate-700">{patientData.dob || 'Not Provided'}</p></div>
                  <div><p className="text-sm text-slate-500 font-medium">Gender</p><p className="text-base font-semibold text-slate-700">{patientData.gender || 'Not Provided'}</p></div>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 text-slate-600">Wrong Patient (Back)</Button>
                <Button onClick={() => setStep(3)} className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white gap-2 shadow-md">Yes, Identity Verified</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleUpload} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Document Details</h3>
                  <p className="text-sm text-slate-500">Uploading as: {hospitalName}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-green-200"><CheckCircle className="w-3.5 h-3.5"/> Verified: {patientData?.name}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Record Title *</label><Input type="text" placeholder="e.g. Complete Blood Count (CBC)" required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category *</label>
                  <select className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Lab Result">Lab Result</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Consultation Note">Consultation Note</option>
                    <option value="Imaging/MRI">Imaging/MRI</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Date of Record *</label><Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full md:w-1/2" /></div>

              <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl p-10 text-center hover:bg-primary/10 transition-colors cursor-pointer group">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <p className="text-base font-bold text-slate-700">Click to upload PDF or Image file</p>
                <p className="text-xs text-slate-500 mt-1">Maximum file size: 10MB (PDF, JPG, PNG)</p>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" className="flex-1 h-12 gap-2 text-base shadow-lg" disabled={loading}><UploadCloud className="w-5 h-5"/> {loading ? 'Processing...' : 'Submit Verified Record'}</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
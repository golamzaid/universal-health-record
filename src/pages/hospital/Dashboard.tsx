import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadCloud, Search, CheckCircle, AlertCircle, FileText, UserCheck } from 'lucide-react';
import { supabase } from '@/supabaseClient';

export const HospitalDashboard = () => {
  const [hospitalName, setHospitalName] = useState('Authorized Hospital');
  
  // Step Management: 1 = Search, 2 = Verify, 3 = Upload
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
    setLoading(true);
    setMessage(null);
    try {
      const numericId = upharId.replace(/[^0-9]/g, '');
      const usersRes = await fetch('http://127.0.0.1:8000/users/');
      const users = await usersRes.json();
      
      const patient = users.find((u: any) => String(u.id) === numericId && u.role === 'patient');
      if (!patient) {
        setMessage({ type: 'error', text: 'Patient not found! Please check the UPHAR ID.' });
      } else {
        setPatientData(patient);
        setStep(2); // Move to verification step
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
        setStep(1); setUpharId(''); setTitle(''); setPatientData(null); // Reset
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Upload Medical Record</h1>
        <p className="text-slate-500 mt-2">Verify patient identity before pushing medical records to their timeline.</p>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden p-6">
        {/* Status Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'} border`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertCircle className="w-5 h-5"/>}
            {message.text}
          </div>
        )}

        {/* STEP 1: Search */}
        {step === 1 && (
          <form onSubmit={handleSearchVerify} className="space-y-4 animate-in fade-in">
            <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Step 1: Locate Patient</h2>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600"/> Find Patient by UPHAR ID
              </label>
              <div className="flex gap-4">
                <Input type="text" placeholder="e.g. UPH-105" required value={upharId} onChange={(e) => setUpharId(e.target.value.toUpperCase())} className="font-mono uppercase max-w-sm h-12 text-lg" />
                <Button type="submit" className="h-12 px-8" disabled={loading}>{loading ? 'Searching...' : 'Search'}</Button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: Verify */}
        {step === 2 && patientData && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Step 2: Verify Identity</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-blue-600 font-medium">Patient Name</p><p className="text-xl font-bold text-blue-900">{patientData.name}</p></div>
                <div><p className="text-sm text-blue-600 font-medium">Contact Details</p><p className="text-lg font-semibold text-blue-900">{patientData.phone || patientData.email}</p></div>
                <div><p className="text-sm text-blue-600 font-medium">Date of Birth</p><p className="text-lg font-semibold text-blue-900">{patientData.dob || 'Not Provided'}</p></div>
                <div><p className="text-sm text-blue-600 font-medium">Gender</p><p className="text-lg font-semibold text-blue-900">{patientData.gender || 'Not Provided'}</p></div>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 text-slate-600 hover:bg-slate-100">Wrong Patient (Go Back)</Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-green-600 hover:bg-green-700 gap-2"><UserCheck className="w-5 h-5"/> Yes, Verify & Proceed</Button>
            </div>
          </div>
        )}

        {/* STEP 3: Upload Form */}
        {step === 3 && (
          <form onSubmit={handleUpload} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-semibold text-slate-900">Step 3: Document Details</h2>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Verified: {patientData?.name}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Record Title</label><Input type="text" placeholder="e.g. Complete Blood Count" required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Lab Result">Lab Result</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Consultation Note">Consultation Note</option>
                  <option value="Imaging/MRI">Imaging/MRI</option>
                </select>
              </div>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium text-slate-700">Date</label><Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full md:w-1/2" /></div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 cursor-pointer">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Click to upload PDF or Image</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button type="submit" className="flex-1 gap-2" disabled={loading}><UploadCloud className="w-5 h-5"/> {loading ? 'Uploading...' : 'Securely Upload to Timeline'}</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
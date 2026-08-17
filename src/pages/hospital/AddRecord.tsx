import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, UploadCloud, User, Activity, CheckCircle, FileText, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import imageCompression from 'browser-image-compression';

export const AddRecord = () => {
  const [step, setStep] = useState(1);
  const [upharId, setUpharId] = useState('');
  const [patientData, setPatientData] = useState<any>(null);
  
  // Hospital Data
  const [hospitalName, setHospitalName] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Lab Result');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch the authenticated hospital user's details on component mount
  useEffect(() => {
    const fetchHospitalData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/`);
        const users = await res.json();
        const dbUser = users.find((u: any) => u.email === user.email);
        if (dbUser) setHospitalName(dbUser.name);
      }
    };
    fetchHospitalData();
  }, []);

  // Verify the patient's UPHAR ID before allowing uploads
  const handleSearchVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Auto-format UPH- prefix if the user only entered the numeric portion
      let searchId = upharId.trim().toUpperCase();
      if (/^\d+$/.test(searchId)) {
        searchId = `UPH-${searchId}`;
      }

      const usersRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/`);
      const users = await usersRes.json();
      
      const patient = users.find((u: any) => u.uphar_id === searchId && u.role === 'patient');
      
      if (!patient) {
        setMessage({ type: 'error', text: 'Patient not found. Please verify the UPHAR ID.' });
      } else {
        setPatientData(patient);
        setStep(2); // Proceed to the upload step
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server connection failed. Ensure the backend is running.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection from the user's device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Compress and upload the selected medical record
  const handleUploadRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please attach a document to proceed.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      let fileToUpload = selectedFile;

      // Apply compression only if the uploaded file is an image (skip PDFs)
      if (selectedFile.type.startsWith('image/')) {
        const compressionOptions = {
          maxSizeMB: 1,          // Maximum file size in MB
          maxWidthOrHeight: 1920, // Max resolution dimension
          useWebWorker: true,    // Utilize multi-threading for performance
        };
        
        // Compress the image and replace the original file object
        fileToUpload = await imageCompression(selectedFile, compressionOptions);
      }

      // Construct form data for the API request
      const formData = new FormData();
      formData.append('patient_id', patientData.id.toString());
      formData.append('title', title);
      formData.append('category', category);
      formData.append('provider_name', hospitalName);
      formData.append('date', date);
      formData.append('file', fileToUpload);

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/records/`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Record successfully encrypted and pushed to patient timeline.' });
        
        // Reset the form state after a brief delay for UX
        setTimeout(() => {
          setStep(1);
          setUpharId('');
          setPatientData(null);
          setTitle('');
          setSelectedFile(null);
          setMessage(null);
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred during the upload process.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Patient Record</h1>
        <p className="text-sm text-slate-500 mt-1">Push lab reports, discharge summaries, or imaging directly to a patient's UPHAR timeline.</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>1</div>
          <span className="font-medium text-sm">Verify Patient</span>
        </div>
        <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-slate-100'}`}></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>2</div>
          <span className="font-medium text-sm">Upload Details</span>
        </div>
      </div>

      {/* STEP 1: VERIFY PATIENT */}
      {step === 1 && (
        <div className="bg-white border rounded-xl shadow-sm p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Enter Patient ID</h2>
          <form onSubmit={handleSearchVerify} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="e.g. UPH-140151" 
                className="pl-10 h-12 text-lg uppercase font-mono" 
                required
                value={upharId}
                onChange={(e) => setUpharId(e.target.value)}
              />
            </div>
            
            {message && message.type === 'error' && (
              <p className="text-sm font-medium text-red-500">{message.text}</p>
            )}

            <Button type="submit" className="w-full h-12 text-lg gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Patient'} <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </div>
      )}

      {/* STEP 2: UPLOAD RECORD */}
      {step === 2 && patientData && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
          
          {/* Active Patient Target Header */}
          <div className="bg-slate-50 p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Uploading to timeline of:</p>
                <h3 className="text-lg font-bold text-slate-900">{patientData.name} <span className="text-sm font-mono text-primary font-medium ml-2">({patientData.uphar_id || `UPH-${patientData.id}`})</span></h3>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-slate-500">Change Patient</Button>
          </div>

          <form onSubmit={handleUploadRecord} className="p-6 sm:p-8 space-y-6">
            
            {/* Record Metadata Fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Record Title / Diagnosis</label>
              <Input placeholder="e.g., Complete Blood Count (CBC)" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Lab Result">Lab Result</option>
                  <option value="Imaging/MRI">Imaging/MRI</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Vaccination">Vaccination Record</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Date of Record</label>
                <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            {/* Document Upload Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Upload Document</label>
              <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFile ? 'border-green-400 bg-green-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png,.dcm"
                  onChange={handleFileChange}
                />
                {selectedFile ? (
                  <>
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800 text-center px-4 truncate w-full">{selectedFile.name}</p>
                    <p className="text-xs text-green-600 mt-1 font-medium">Ready to upload</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-700">Click to attach file</p>
                    <p className="text-xs text-slate-500 mt-1">Supports PDF, JPG, PNG, DICOM (Max 10MB)</p>
                  </>
                )}
              </label>
            </div>

            {/* Status Alert */}
            {message && (
              <div className={`p-4 rounded-lg text-sm font-medium flex gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <Activity className="w-5 h-5 shrink-0" />}
                {message.text}
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <Button type="submit" className="w-full h-12 text-lg gap-2" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />} Upload & Push to Timeline
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
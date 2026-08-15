import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/Badges/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Filter, FileText, UploadCloud, Loader2, X, CheckCircle } from 'lucide-react';
import { supabase } from '@/supabaseClient';

export const PatientRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState<number | null>(null);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Lab Result');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const usersRes = await fetch('http://127.0.0.1:8000/users/');
        const users = await usersRes.json();
        const dbUser = users.find((u: any) => u.email === user.email);

        if (dbUser) {
          setPatientId(dbUser.id);
          const recordsRes = await fetch(`http://127.0.0.1:8000/users/${dbUser.id}/records`);
          const recordsData = await recordsRes.json();
          setRecords(recordsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
      } catch (error) {
        console.error("Error fetching records", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;
    
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('patient_id', patientId.toString());
      formData.append('title', title);
      formData.append('category', category);
      formData.append('provider_name', 'Self-Uploaded');
      formData.append('date', date);
      formData.append('file', selectedFile);

      const res = await fetch(`http://127.0.0.1:8000/records/`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const newRecord = await res.json();
        setRecords([newRecord, ...records]);
        setShowModal(false);
        setTitle('');
        setSelectedFile(null);
      } else {
        alert("Failed to upload record");
      }
    } catch (error) {
      alert("Server error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Records</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your medical reports, prescriptions, and documents.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Upload Record
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search records by name or provider..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center text-primary"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : records.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No records found. Click "Upload Record" to add your past reports.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {records.map((record) => (
              <div key={record.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg mt-1 sm:mt-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{record.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-500">
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{record.provider_name}</span>
                      <span>•</span>
                      <span className="text-xs uppercase font-semibold text-slate-400">{record.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <StatusBadge status={record.provider_name === 'Self-Uploaded' ? 'PATIENT_UPLOADED' : 'PROVIDER_VERIFIED'} />
                  {record.file_url ? (
                    <a href={record.file_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">View File</Button>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic px-3">No Attachment</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Upload Past Record</h3>
              <button onClick={() => {setShowModal(false); setSelectedFile(null);}} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Record Title</label>
                <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., 2023 Blood Test" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select className="flex h-10 w-full rounded-md border border-slate-300 px-3 text-sm" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Lab Result">Lab Result</option>
                    <option value="Past Prescription">Past Prescription</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Imaging/MRI">Imaging / MRI</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Date</label>
                  <Input type="date" required value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>

              <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFile ? 'border-green-400 bg-green-50 hover:bg-green-100' : 'border-primary/30 bg-primary/5 hover:bg-primary/10'}`}>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {selectedFile ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800 text-center px-4 truncate w-full">{selectedFile.name}</p>
                    <p className="text-xs text-green-600 mt-1 font-medium">Ready to upload</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">Click to browse your files</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  </>
                )}
              </label>

              <Button type="submit" className="w-full gap-2 h-11" disabled={uploading}>
                {uploading ? <Loader2 className="w-5 h-5 animate-spin"/> : <UploadCloud className="w-5 h-5" />} Save to Timeline
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
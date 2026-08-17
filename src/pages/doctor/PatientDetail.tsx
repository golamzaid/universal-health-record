import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Activity, TestTube, ArrowLeft, Plus, Eye, Lock, Pill, FileText, Stethoscope, Loader2, UploadCloud, CheckCircle, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/Badges/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/supabaseClient';

export const PatientDetail = () => {
  const { id } = useParams(); 
  
  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [hasModifyAccess, setHasModifyAccess] = useState(false);
  const [isPendingAccess, setIsPendingAccess] = useState(false); // For Pending state 
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState('');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [recordType, setRecordType] = useState<'Note' | 'Prescription'>('Note');
  const [noteTitle, setNoteTitle] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPatientAndRecords = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const usersRes = await fetch('http://127.0.0.1:8000/users/');
        const users = await usersRes.json();

        const dbDoctor = users.find((u: any) => u.email === user?.email);
        if (dbDoctor) setDoctorName(dbDoctor.name);

        const dbPatient = users.find((u: any) => String(u.id) === id);
        if (dbPatient) setPatient(dbPatient);

        if (dbPatient && dbDoctor) {
          const recordsRes = await fetch(`http://127.0.0.1:8000/users/${dbPatient.id}/records`);
          const recordsData = await recordsRes.json();
          setRecords(recordsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));

          const consentsRes = await fetch(`http://127.0.0.1:8000/users/${dbPatient.id}/consents`);
          const consentsData = await consentsRes.json();

          // Active and Pending check 
          const activeModifyConsent = consentsData.find(
            (c: any) => c.doctor_id === dbDoctor.id && c.status === 'ACTIVE' && c.access_type.includes('Modify')
          );
          
          const pendingModifyConsent = consentsData.find(
            (c: any) => c.doctor_id === dbDoctor.id && c.status === 'PENDING' && c.access_type.includes('Modify')
          );

          setHasModifyAccess(!!activeModifyConsent);
          setIsPendingAccess(!!pendingModifyConsent);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientAndRecords();
  }, [id]);

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Lab Result': return { icon: TestTube, color: 'text-purple-600', bg: 'bg-purple-100' };
      case 'Prescription': return { icon: Pill, color: 'text-teal-600', bg: 'bg-teal-100' };
      case 'Consultation Note': return { icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'Imaging/MRI': return { icon: Activity, color: 'text-slate-600', bg: 'bg-slate-100' };
      default: return { icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' };
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recordType === 'Prescription' && !selectedFile) {
      alert("Please select a prescription file to upload.");
      return;
    }

    setSavingNote(true);
    try {
      const formData = new FormData();
      formData.append('patient_id', id || '0');
      formData.append('title', noteTitle);
      formData.append('category', recordType === 'Prescription' ? 'Prescription' : 'Consultation Note');
      formData.append('provider_name', doctorName);
      formData.append('date', new Date().toISOString().split('T')[0]);
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await fetch(`http://127.0.0.1:8000/records/`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const newRecord = await res.json();
        setRecords([newRecord, ...records]); 
        setShowModal(false);
        setNoteTitle('');
        setSelectedFile(null);
        setRecordType('Note');
      } else {
        const errorData = await res.json();
        alert(`Failed to save: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-primary">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium text-slate-500">Loading patient timeline...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/doctor/patients" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{patient?.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
              <span className="font-mono text-primary font-medium">{patient?.uphar_id || `UPH-${patient?.id}`}</span>
              <span>•</span>
              <span>{patient?.gender || 'Unknown'}, {patient?.dob || 'DOB Not provided'}</span>
              <span>•</span>
              
              {/* Dynamic Badges based on access state */}
              {hasModifyAccess ? (
                 <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-medium">
                   <ShieldCheck className="h-3.5 w-3.5" /> Modify Access Active
                 </span>
              ) : isPendingAccess ? (
                 <span className="flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-medium">
                   <Clock className="h-3.5 w-3.5" /> Request Pending
                 </span>
              ) : (
                 <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
                   <Eye className="h-3.5 w-3.5" /> View Only Mode
                 </span>
              )}
            </div>
          </div>
        </div>
        
        
        {hasModifyAccess ? (
          <Button onClick={() => setShowModal(true)} className="gap-2 shadow-sm shrink-0">
            <Plus className="h-4 w-4" /> Add Record
          </Button>
        ) : (
          <Button variant="outline" className="gap-2 text-slate-500 bg-slate-100 cursor-not-allowed border-slate-200 shrink-0">
            <Lock className="h-4 w-4" /> Add Record (Locked)
          </Button>
        )}
      </div>

      {/* Dynamic Warning Banner */}
      {!hasModifyAccess && (
        <div className={`border rounded-xl p-4 flex gap-3 text-sm ${isPendingAccess ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          {isPendingAccess ? <Clock className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" /> : <Eye className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />}
          <p>
            {isPendingAccess 
              ? "Your request for Modify Access is currently Pending. Once the patient approves it from their portal, you will be able to upload new records."
              : "You are viewing this record in Read-Only mode. You can browse the medical history, but to add new prescriptions or update records, patient authorization is required."}
          </p>
        </div>
      )}

      {/* Timeline View */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b">Patient Medical Timeline</h3>
        
        {records.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            No medical records found for this patient.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
            {records.map((event) => {
              const style = getCategoryStyle(event.category);
              const Icon = style.icon;

              return (
                <div key={event.id} className="relative pl-8">
                  <div className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${style.bg}`}>
                    <Icon className={`h-4 w-4 ${style.color}`} />
                  </div>
                  <div className="bg-slate-50 border rounded-xl p-5 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{event.category}</span>
                        <h4 className="text-lg font-bold text-slate-900 mt-0.5">{event.title}</h4>
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <span className="text-sm font-medium text-slate-700">{event.provider_name}</span>
                      <StatusBadge status="PROVIDER_VERIFIED" />
                      
                      {event.file_url && (
                        <a href={event.file_url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-primary border-primary/20 hover:bg-primary/5">
                            <Eye className="w-3.5 h-3.5" /> View Document
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary"/> Add Medical Record
              </h3>
            </div>
            
            <form onSubmit={handleAddNote} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Record Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`border rounded-lg p-3 cursor-pointer text-center text-sm font-medium transition-colors ${recordType === 'Note' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600'}`}>
                    <input type="radio" name="type" className="sr-only" checked={recordType === 'Note'} onChange={() => setRecordType('Note')} />
                    Consultation Note
                  </label>
                  <label className={`border rounded-lg p-3 cursor-pointer text-center text-sm font-medium transition-colors ${recordType === 'Prescription' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-600'}`}>
                    <input type="radio" name="type" className="sr-only" checked={recordType === 'Prescription'} onChange={() => setRecordType('Prescription')} />
                    Prescription
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Diagnosis / Title</label>
                <Input 
                  required 
                  value={noteTitle} 
                  onChange={e => setNoteTitle(e.target.value)} 
                  placeholder={recordType === 'Prescription' ? "e.g., Asthma Medication" : "e.g., Viral Fever Follow-up"} 
                  className="bg-white"
                />
              </div>

              {recordType === 'Prescription' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Upload Digital Prescription</label>
                  <label className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFile ? 'border-green-400 bg-green-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    {selectedFile ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                        <p className="text-xs font-bold text-slate-800 text-center px-4 truncate w-full">{selectedFile.name}</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                        <p className="text-xs font-medium text-slate-600">Click to attach PDF/Image</p>
                      </>
                    )}
                  </label>
                </div>
              )}

              <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                This record will be permanently added to {patient?.name}'s timeline as a Provider Verified document.
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => {setShowModal(false); setSelectedFile(null);}}>Cancel</Button>
                <Button type="submit" className="flex-1 gap-2" disabled={savingNote}>
                  {savingNote ? <Loader2 className="w-4 h-4 animate-spin"/> : <Plus className="w-4 h-4" />} Save Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
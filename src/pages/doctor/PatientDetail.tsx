import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Activity, TestTube, ArrowLeft, Plus, Eye, Lock, Pill, FileText, Stethoscope, Loader2 } from 'lucide-react';
import { StatusBadge } from '@/components/Badges/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/supabaseClient';

export const PatientDetail = () => {
  const { id } = useParams(); 
  
  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [hasModifyAccess, setHasModifyAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    const fetchPatientAndRecords = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const usersRes = await fetch('http://127.0.0.1:8000/users/');
        const users = await usersRes.json();

        // Find logged-in doctor
        const dbDoctor = users.find((u: any) => u.email === user?.email);
        if (dbDoctor) setDoctorName(dbDoctor.name);

        // Find patient from URL ID
        const dbPatient = users.find((u: any) => String(u.id) === id);
        if (dbPatient) setPatient(dbPatient);

        if (dbPatient && dbDoctor) {
          // 1. Fetch Records
          const recordsRes = await fetch(`http://127.0.0.1:8000/users/${dbPatient.id}/records`);
          const recordsData = await recordsRes.json();
          setRecords(recordsData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));

          // 2. Fetch Consents to verify access level
          const consentsRes = await fetch(`http://127.0.0.1:8000/users/${dbPatient.id}/consents`);
          const consentsData = await consentsRes.json();

          const activeModifyConsent = consentsData.find(
            (c: any) => c.doctor_id === dbDoctor.id && c.status === 'ACTIVE' && c.access_type === 'View & Modify'
          );

          setHasModifyAccess(!!activeModifyConsent);
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

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNote(true);
    try {
      // FIX 1: Added patient_id so the backend knows which patient this belongs to
      const payload = {
        patient_id: parseInt(id || '0'), 
        title: noteTitle,
        category: 'Consultation Note',
        provider_name: doctorName
      };

      // FIX 2: Corrected the API route to /records/
      const res = await fetch(`http://127.0.0.1:8000/records/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newRecord = await res.json();
        setRecords([newRecord, ...records]); // Update UI instantly
        setShowModal(false);
        setNoteTitle('');
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
              {hasModifyAccess ? (
                 <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-medium">
                   <ShieldCheck className="h-3.5 w-3.5" /> Modify Access Active
                 </span>
              ) : (
                 <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-medium">
                   <Eye className="h-3.5 w-3.5" /> View Only Mode
                 </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Modify Action Button */}
        {hasModifyAccess ? (
          <Button onClick={() => setShowModal(true)} className="gap-2 shadow-sm shrink-0">
            <Plus className="h-4 w-4" /> Add Consultation Note
          </Button>
        ) : (
          <Button variant="outline" className="gap-2 text-slate-500 bg-slate-100 cursor-not-allowed border-slate-200 shrink-0">
            <Lock className="h-4 w-4" /> Add Note (Locked)
          </Button>
        )}
      </div>

      {/* Warning Banner based on Access */}
      {!hasModifyAccess && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
          <Eye className="h-5 w-5 text-blue-600 shrink-0" />
          <p>
            You are viewing this record in <strong>Read-Only</strong> mode. You can browse the medical history, but to add new prescriptions or update records, patient authorization is required.
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
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-slate-700">{event.provider_name}</span>
                      <StatusBadge status="PROVIDER_VERIFIED" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary"/> New Consultation Note
              </h3>
            </div>
            <form onSubmit={handleAddNote} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Diagnosis / Note Title</label>
                <Input 
                  required 
                  value={noteTitle} 
                  onChange={e => setNoteTitle(e.target.value)} 
                  placeholder="e.g., Viral Fever Follow-up" 
                  className="bg-white"
                />
              </div>
              <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                This note will be permanently added to {patient?.name}'s medical timeline as a Provider Verified record.
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 gap-2" disabled={savingNote}>
                  {savingNote ? <Loader2 className="w-4 h-4 animate-spin"/> : <Plus className="w-4 h-4" />} Save Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
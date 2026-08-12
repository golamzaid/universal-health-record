import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Users, Clock, Eye, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/supabaseClient';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  uphar_id: string; 
}

export const MyPatients = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinkedPatients = async () => {
      try {
        // 1. Get logged in doctor
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch all users to find the current doctor
        const usersRes = await fetch('http://127.0.0.1:8000/users/');
        const allUsers = await usersRes.json();
        
        const dbDoctor = allUsers.find((u: any) => u.email === user.email);
        
        if (dbDoctor) {
          // 2. Fetch consents specifically for this doctor
          const consentsRes = await fetch(`http://127.0.0.1:8000/doctors/${dbDoctor.id}/consents`);
          const doctorConsents = await consentsRes.json();

          // 3. Get unique patient IDs who have interacted with this doctor
          const linkedPatientIds = [...new Set(doctorConsents.map((c: any) => c.patient_id))];

          // 4. Filter allUsers to only show patients from the linked list
          const myLinkedPatients = allUsers.filter((u: any) => 
            u.role === 'patient' && linkedPatientIds.includes(u.id)
          );
          
          setPatients(myLinkedPatients);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLinkedPatients();
  }, []);

  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
          <p className="text-sm text-slate-500 mt-1">View patients who have shared their medical records with you.</p>
        </div>
        <Link to="/doctor/search">
          <Button className="gap-2 shadow-sm">
            <Users className="h-4 w-4" />
            Request New Access
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-primary">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <span className="font-medium">Loading your patients...</span>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No Patients Found</h3>
            <p className="text-slate-500 mt-1">You haven't requested access to any patients yet.</p>
            <Link to="/doctor/search" className="mt-4">
              <Button variant="outline" className="gap-2">Search Patient by UPHAR ID</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <div key={patient.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                
                {/* Patient Info */}
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg bg-primary/10 text-primary">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{patient.name}</h3>
                    <div className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-medium text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                        {patient.uphar_id || `UPH-${patient.id}`}
                      </span>
                      <span>•</span>
                      <span>{patient.email}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 hidden sm:flex">
                    <Clock className="h-4 w-4" />
                    Authorized
                  </span>
                  
                  <Link to={`/doctor/patients/${patient.id}`}>
                    <Button variant="outline" className="gap-2 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-colors">
                      <Eye className="h-4 w-4" /> View Records
                    </Button>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
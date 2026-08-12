import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Users, Clock, Eye, Loader2 } from 'lucide-react';
import { supabase } from '@/supabaseClient';

// TypeScript interface update kiya jisme uphar_id add kiya
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
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/users/');
        const data = await response.json();
        
        // Sirf 'patient' role walo ko filter kar rahe hain
        const onlyPatients = data.filter((user: User) => user.role === 'patient');
        setPatients(onlyPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
          <p className="text-sm text-slate-500 mt-1">View patients and access their authorized medical records.</p>
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
            <span className="font-medium">Loading patients...</span>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No patients found in the network yet.
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
                      
                      {/* FIX: Yahan pehle dummy ID tha, ab real UPHAR ID hai */}
                      <span className="font-mono font-medium text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                        {patient.uphar_id || 'PENDING'}
                      </span>
                      <span>•</span>
                      <span>{patient.email}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {/* Status Tag */}
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 hidden sm:flex">
                    <Clock className="h-4 w-4" />
                    Network Patient
                  </span>
                  
                  {/* View Records Button */}
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
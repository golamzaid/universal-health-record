import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Users, Clock, Eye, AlertCircle } from 'lucide-react';

// 1. TypeScript ko data ka structure batao
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const MyPatients = () => {
  // 2. State setup karo
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Backend se data fetch karo
  useEffect(() => {
    fetch('http://127.0.0.1:8000/users/')
      .then(response => response.json())
      .then(data => {
        // Sirf 'patient' role walo ko filter karke dikhate hain
        const onlyPatients = data.filter((user: User) => user.role === 'patient');
        setPatients(onlyPatients);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching patients:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
          <p className="text-sm text-slate-500 mt-1">Patients fetched live from Supabase Database.</p>
        </div>
        <Link to="/doctor/search">
          <Button className="gap-2">
            <Users className="h-4 w-4" />
            Request New Access
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-primary font-medium animate-pulse">
            Loading patients from database...
          </div>
        ) : patients.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No patients found in the database yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <div key={patient.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg bg-primary/10 text-primary">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{patient.name}</h3>
                    <div className="text-sm text-slate-500 flex gap-2 mt-0.5">
                      <span>ID: P-{10000 + patient.id}</span>
                      <span>•</span>
                      <span>{patient.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <Clock className="h-4 w-4" />
                    Active Patient
                  </span>
                  
                  <Link to={`/doctor/patients/${patient.id}`}>
                    <Button variant="outline" className="gap-2 text-primary border-primary/30 hover:bg-primary/10">
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
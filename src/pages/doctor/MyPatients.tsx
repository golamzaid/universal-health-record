import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Users, Clock, Eye, AlertCircle } from 'lucide-react';

export const MyPatients = () => {
  const authorizedPatients = [
    {
      id: 'P-10023',
      name: 'Golam Zaid',
      age: 28,
      gender: 'Male',
      accessExpiry: 'Expires in 22 hours',
      status: 'ACTIVE',
    },
    {
      id: 'P-88392',
      name: 'Mira Khan',
      age: 34,
      gender: 'Female',
      accessExpiry: 'Expires in 5 days',
      status: 'ACTIVE',
    },
    {
      id: 'P-44012',
      name: 'Rohan Sharma',
      age: 45,
      gender: 'Male',
      accessExpiry: 'Expired',
      status: 'EXPIRED',
    }
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
          <p className="text-sm text-slate-500 mt-1">Patients who have granted you access to their medical records.</p>
        </div>
        <Link to="/doctor/search">
          <Button className="gap-2">
            <Users className="h-4 w-4" />
            Request New Access
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {authorizedPatients.map((patient) => (
            <div key={patient.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${patient.status === 'ACTIVE' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{patient.name}</h3>
                  <div className="text-sm text-slate-500 flex gap-2 mt-0.5">
                    <span>{patient.id}</span>
                    <span>•</span>
                    <span>{patient.age} Yrs, {patient.gender}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {patient.status === 'ACTIVE' ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <Clock className="h-4 w-4" />
                    {patient.accessExpiry}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    <AlertCircle className="h-4 w-4" />
                    Access Expired
                  </span>
                )}

                {patient.status === 'ACTIVE' ? (
                  <Link to={`/doctor/patients/${patient.id}`}>
                    <Button variant="outline" className="gap-2 text-primary border-primary/30 hover:bg-primary/10">
                      <Eye className="h-4 w-4" /> View Records
                    </Button>
                  </Link>
                ) : (
                  <Link to="/doctor/search">
                    <Button variant="ghost" className="gap-2 text-slate-500">
                      Request Again
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
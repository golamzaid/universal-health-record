import { useState, useEffect } from 'react';
import { Search, UserPlus, FileText, User } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export const PatientDirectory = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all users and filter only patients
    fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/`)
      .then(res => res.json())
      .then(data => {
        setPatients(data.filter((u: any) => u.role === 'patient'));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching patients:", err);
        setLoading(false);
      });
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.uphar_id && p.uphar_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Search and manage patients in the UPHAR network.</p>
        </div>
        <Link to="/hospital/add-record">
          <Button className="gap-2"><FileText className="w-4 h-4" /> New Medical Record</Button>
        </Link>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b bg-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by Name, UPHAR ID, or Email..." 
              className="pl-10 h-11 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Patient Details</th>
                <th className="px-6 py-4">UPHAR ID</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Demographics</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 animate-pulse">Loading patient directory...</td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No patients found matching your search.</td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {patient.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900">{patient.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-100">
                        {patient.uphar_id || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div>{patient.phone || 'N/A'}</div>
                      <div className="text-xs text-slate-400">{patient.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {patient.gender || '-'} • {patient.dob || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to="/hospital/add-record">
                        <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/20 hover:bg-primary/5">
                          <UserPlus className="w-4 h-4" /> Add Record
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
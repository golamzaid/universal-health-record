import { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, FilePlus, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/supabaseClient';

export const HospitalDashboard = () => {
  const [hospitalName, setHospitalName] = useState('');
  const [patientCount, setPatientCount] = useState(0);
  const [isFetching, setIsFetching] = useState(true); // New loading state

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      try {
        // Fetch all users from backend
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/`);
        const users = await res.json();
        
        // 1. Set Hospital Name
        if (user) {
          const dbUser = users.find((u: any) => u.email === user.email);
          if (dbUser) setHospitalName(dbUser.name);
        }

        // 2. Count total registered patients in the network
        const totalPatients = users.filter((u: any) => u.role === 'patient').length;
        setPatientCount(totalPatients);

      } catch (err) {
        console.error("Could not fetch dashboard data", err);
      } finally {
        // Loading stop when data is fetched or if there's an error
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);


  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-primary">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium text-slate-500">Loading Dashboard Data...</p>
      </div>
    );
  }

  const stats = [
    { name: 'Total Patients in Network', value: patientCount.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Records Uploaded (This Month)', value: '124', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Pending Approvals', value: '3', icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-white border rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {hospitalName}!</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your patients and upload verified medical records securely.</p>
        </div>
        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <Link to="/hospital/add-record" className="w-full md:w-auto">
            <Button className="w-full gap-2 shadow-lg h-12 text-base px-6">
              <FilePlus className="w-5 h-5" /> New Upload
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.name}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quick Actions */}
        <div className="bg-white border rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Quick Actions
          </h2>
          <div className="space-y-4">
            <Link to="/hospital/add-record" className="flex items-center justify-between p-4 rounded-xl border hover:bg-slate-50 transition-colors group">
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">Upload Medical Record</h3>
                <p className="text-sm text-slate-500 mt-1">Push lab results to a patient's timeline</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link to="/hospital/patients" className="flex items-center justify-between p-4 rounded-xl border hover:bg-slate-50 transition-colors group">
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">View Patient Directory</h3>
                <p className="text-sm text-slate-500 mt-1">Search and manage existing patients</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* System Status / Notice */}
        <div className="bg-slate-900 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
            <CheckCircle className="w-6 h-6 text-green-400" /> UPHAR System Status
          </h2>
          <p className="text-slate-300 mb-6 relative z-10 leading-relaxed">
            All systems are fully operational. Data synchronization with the central database is active. Remember to verify patient UPHAR IDs before uploading sensitive medical documents.
          </p>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm relative z-10 border border-white/20">
            <p className="text-sm font-medium text-slate-200">Current API Connection: <span className="text-green-400 font-bold ml-2">Secure & Encrypted</span></p>
          </div>
        </div>

      </div>
    </div>
  );
};
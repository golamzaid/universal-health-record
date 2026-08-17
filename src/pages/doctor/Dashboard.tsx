import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/supabaseClient';

export const DoctorDashboard = () => {
  const [doctorName, setDoctorName] = useState('Loading...');

  // Fetch logged-in doctor details on component mount
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        // Retrieve authenticated user from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch all users from the backend API
        const response = await fetch('http://127.0.0.1:8000/users/');
        const users = await response.json();
        
        // Find the specific database record matching the authenticated email
        const dbUser = users.find((u: any) => u.email === user.email);
        
        if (dbUser) {
          // Ensure the name includes the "Dr." prefix for professional display
          const formattedName = dbUser.name.startsWith('Dr.') 
            ? dbUser.name 
            : `Dr. ${dbUser.name}`;
            
          setDoctorName(formattedName);
        }
      } catch (error) {
        console.error("Failed to fetch doctor details:", error);
        setDoctorName('Doctor');
      }
    };

    fetchDoctorDetails();
  }, []);

  // Static statistics for UI representation (to be connected to API later)
  const stats = [
    { name: 'Authorized Patients', value: '45', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Pending Requests', value: '3', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Recent Access (24h)', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{doctorName}'s Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your patients and access requests.</p>
      </div>

      {/* Overview Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
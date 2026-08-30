import { useState, useEffect } from 'react';
import { FileText, FileBadge, Activity, ShieldAlert } from 'lucide-react';
import { supabase } from '@/supabaseClient';

export const PatientDashboard = () => {
  const [patientName, setPatientName] = useState('Loading...');
  const [greeting, setGreeting] = useState('Welcome');

  // Fetch logged-in user details and set dynamic greeting
  useEffect(() => {
    // Determine time-based greeting
    const currentHour = new Date().getHours();
    if (currentHour < 12) setGreeting('Good morning');
    else if (currentHour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const fetchUserDetails = async () => {
      try {
        // Retrieve authenticated user from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch all users from the backend API
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/`);
        const users = await response.json();
        
        // Find the specific database record matching the authenticated email
        const dbUser = users.find((u: any) => u.email === user.email);
        
        if (dbUser) {
          // Extract the first name for a friendlier greeting
          const firstName = dbUser.name.split(' ')[0];
          setPatientName(firstName);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setPatientName('User');
      }
    };

    fetchUserDetails();
  }, []);

  // Static statistics for UI representation (to be connected to API later)
  const stats = [
    { name: 'Total Records', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Consents', value: '2', icon: FileBadge, color: 'text-teal-600', bg: 'bg-teal-100' },
    { name: 'Recent Access', value: '5', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Emergency Profile', value: 'Setup', icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{greeting}, {patientName}</h1>
        <p className="text-sm text-slate-500 mt-1">Here is a summary of your medical records and recent activity.</p>
      </div>

      {/* Overview Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Recent Activity Timeline Section */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-900">Recent Medical Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            
            {/* Timeline Item 1 */}
            <div className="flex gap-4">
              <div className="w-2 mt-1.5 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium text-slate-900">Complete Blood Count (CBC)</p>
                <p className="text-sm text-slate-500">Added by ABC Hospital • 23 July 2026</p>
              </div>
            </div>
            
            {/* Timeline Item 2 */}
            <div className="flex gap-4">
              <div className="w-2 mt-1.5 rounded-full bg-teal-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Access Requested</p>
                <p className="text-sm text-slate-500">Dr. Smith requested access to Lab Reports • 22 July 2026</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
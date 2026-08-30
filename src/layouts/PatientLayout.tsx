import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, FileText, FileBadge, ShieldAlert, User, LogOut, History, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

export const PatientLayout = () => {
  const location = useLocation();
  const [patientName, setPatientName] = useState('Loading...');

  // Fetch logged-in patient's details from the database
  useEffect(() => {
    const fetchPatientDetails = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/`);
          const users = await res.json();
          const dbUser = users.find((u: any) => u.email === user.email);
          if (dbUser) {
            setPatientName(dbUser.name);
          }
        } catch (error) {
          console.error("Error fetching patient details:", error);
        }
      }
    };
    fetchPatientDetails();
  }, []);

  // Navigation menu items for patient portal
  const navigation = [
    { name: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Timeline', href: '/patient/timeline', icon: Activity },
    { name: 'My Records', href: '/patient/records', icon: FileText },
    { name: 'Consents', href: '/patient/consents', icon: FileBadge },
    { name: 'Activity Log', href: '/patient/activity', icon: History },
    { name: 'Emergency Profile', href: '/patient/emergency', icon: ShieldAlert },
    { name: 'Settings', href: '/patient/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar navigation (Desktop) - uses dark theme */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Activity className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl text-white">UPHAR Patient</span>
        </div>
        
        {/* Patient profile section with name and welcome message */}
        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-sm font-medium text-white">{patientName}</p>
          <p className="text-xs text-slate-400 mt-0.5">My Health Portal</p>
        </div>
        
        {/* Main navigation menu */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.includes(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Logout section */}
        <div className="p-4 border-t border-slate-800">
          <Link 
            to="/login" 
            onClick={() => supabase.auth.signOut()} // Perform actual logout here
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 opacity-80" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header with mobile navigation and patient info */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="md:hidden flex items-center">
            <Activity className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg">UPHAR</span>
          </div>
          <div className="flex items-center ml-auto gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">{patientName}</span>
            </div>
          </div>
        </header>
        
        {/* Main page content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Search, LogOut, Stethoscope } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';

export const DoctorLayout = () => {
  const location = useLocation();
  
  // State for real-time doctor information
  const [doctorName, setDoctorName] = useState('Loading...');
  const [doctorSpec, setDoctorSpec] = useState('Doctor');
  const [doctorLicense, setDoctorLicense] = useState('');

  // Fetch logged-in doctor's details from the database
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const res = await fetch('http://127.0.0.1:8000/users/');
          const users = await res.json();
          const dbUser = users.find((u: any) => u.email === user.email);
          
          if (dbUser) {
            setDoctorName(dbUser.name);
            setDoctorSpec(dbUser.specialization || 'General Practice');
            setDoctorLicense(dbUser.license_number || 'N/A');
          }
        } catch (error) {
          console.error("Error fetching doctor details:", error);
        }
      }
    };
    fetchDoctorDetails();
  }, []);

  // Navigation menu items for doctor portal
  const navigation = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'My Patients', href: '/doctor/patients', icon: Users },
    { name: 'Search & Request Access', href: '/doctor/search', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Stethoscope className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl text-white">UPHAR Doctor</span>
        </div>
        
        {/* Doctor profile section with name and specialization */}
        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-sm font-medium text-white">{doctorName}</p>
          <p className="text-xs text-slate-400 mt-0.5">{doctorSpec}</p>
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
          })
        }
        </nav>
        
        {/* Logout section */}
        <div className="p-4 border-t border-slate-800">
          <Link 
            to="/login" 
            onClick={() => supabase.auth.signOut()} // Perform actual logout
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 opacity-80" />
            Sign Out
          </Link>
        </div>
      </aside>
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-end px-4 sm:px-6 lg:px-8">
           {/* Display doctor's license number */}
           <span className="text-sm font-medium text-slate-700">License: {doctorLicense}</span>
        </header>
        
        {/* Main page content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Search, Activity, LogOut, Stethoscope } from 'lucide-react';

export const DoctorLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'My Patients', href: '/doctor/patients', icon: Users },
    { name: 'Search & Request Access', href: '/doctor/search', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Stethoscope className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl text-white">UPHRP Doctor</span>
        </div>
        
        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-sm font-medium text-white">Dr. Sarah Smith</p>
          <p className="text-xs text-slate-400 mt-0.5">Cardiology • ABC Hospital</p>
        </div>
        
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

        <div className="p-4 border-t border-slate-800">
          <Link to="/login" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors">
            <LogOut className="mr-3 h-5 w-5 opacity-80" />
            Sign Out
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-end px-4 sm:px-6 lg:px-8">
           <span className="text-sm font-medium text-slate-700">License: MED-908234</span>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
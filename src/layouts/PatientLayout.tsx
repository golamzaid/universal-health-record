import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, FileText, FileBadge, ShieldAlert, User, LogOut } from 'lucide-react';

export const PatientLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Timeline', href: '/patient/timeline', icon: Activity },
    { name: 'My Records', href: '/patient/records', icon: FileText },
    { name: 'Consents', href: '/patient/consents', icon: FileBadge },
    { name: 'Emergency Profile', href: '/patient/emergency', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Activity className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl text-slate-900">UPHRP</span>
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
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Link to="/login" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="mr-3 h-5 w-5 opacity-80" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header & Desktop Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="md:hidden flex items-center">
            <Activity className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg">UPHRP</span>
          </div>
          <div className="flex items-center ml-auto gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Golam Zaid</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
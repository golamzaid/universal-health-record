import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Activity } from 'lucide-react';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Activity className="h-6 w-6" />
            <span>UPHRP</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary">How it works</Link>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content (Changes based on route) */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
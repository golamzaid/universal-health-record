import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Activity } from 'lucide-react';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Navbar - Scroll karne par upar rahega */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight">
            <Activity className="h-7 w-7" />
            <span>UPHAR</span>
          </Link>
          
          {/* Main Navigation Links (App Style) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">Home</Link>
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Features</a>
            <a href="#preview" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">App Preview</a>
            <Link to="/how-it-works" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">How it works</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block">
              <span className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Sign In</span>
            </Link>
            <Link to="/login">
              <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content (Changes based on route) */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
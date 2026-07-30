import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

type Role = 'patient' | 'doctor' | 'hospital';

export const LoginPage = () => {
  const [role, setRole] = useState<Role>('patient');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-2xl mb-2">
            <Activity className="h-8 w-8" />
            <span>UPHRP</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to your account</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-slate-100 rounded-lg">
          {(['patient', 'doctor', 'hospital'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 text-sm font-medium py-2 rounded-md capitalize transition-colors ${
                role === r ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email address</label>
            <Input type="email" placeholder={`demo@${role}.com`} required defaultValue={`demo@${role}.com`} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <Input type="password" placeholder="••••••••" required defaultValue="password123" />
          </div>
          <Button type="submit" className="w-full h-11 text-base">Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</Button>
        </form>
      </div>
    </div>
  );
};
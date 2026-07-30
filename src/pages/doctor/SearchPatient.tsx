import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, User, ShieldAlert } from 'lucide-react';

export const SearchPatient = () => {
  const [searchStatus, setSearchStatus] = useState<'IDLE' | 'FOUND' | 'REQUESTED'>('IDLE');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchStatus('FOUND');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Search Patient</h1>
        <p className="text-sm text-slate-500 mt-1">Find a patient by their unique Health ID to request access to their records.</p>
      </div>

      {/* Search Box */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input placeholder="Enter Patient ID (e.g., P-10023)" className="pl-10 h-12 text-lg" required />
          </div>
          <Button type="submit" className="h-12 px-8">Search</Button>
        </form>
      </div>

      {/* Search Result & Request Form */}
      {searchStatus === 'FOUND' && (
        <div className="bg-white border rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Golam Zaid</h3>
              <p className="text-slate-500">Patient ID: P-10023</p>
            </div>
          </div>

          <div className="space-y-5">
            <h4 className="font-medium text-slate-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-orange-500" />
              Request Access
            </h4>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">What do you need access to?</label>
              <div className="grid grid-cols-2 gap-3">
                {['Medical History', 'Lab Reports', 'Prescriptions', 'Imaging / MRI'].map(item => (
                  <label key={item} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer text-sm">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" defaultChecked />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium text-slate-700">Duration</label>
              <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>24 Hours</option>
                <option>7 Days</option>
                <option>1 Month</option>
                <option>Ongoing (Chronic Care)</option>
              </select>
            </div>

            <Button onClick={() => setSearchStatus('REQUESTED')} className="w-full mt-4">
              Send Consent Request
            </Button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {searchStatus === 'REQUESTED' && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center animate-in zoom-in duration-300">
          <h3 className="text-lg font-bold mb-1">Request Sent Successfully!</h3>
          <p className="text-sm">Golam Zaid has been notified. You will be able to view their records once they approve the request from their portal.</p>
          <Button variant="outline" className="mt-4 border-green-300 text-green-700 hover:bg-green-100" onClick={() => setSearchStatus('IDLE')}>
            Search Another Patient
          </Button>
        </div>
      )}
    </div>
  );
};
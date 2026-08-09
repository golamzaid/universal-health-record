import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, User, ShieldAlert, FileEdit, Eye, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SearchPatient = () => {
  const [searchStatus, setSearchStatus] = useState<'IDLE' | 'FOUND' | 'REQUEST_SENT'>('IDLE');
  const [upharId, setUpharId] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchStatus('FOUND'); 
    setShowRequestForm(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Search Patient</h1>
        <p className="text-sm text-slate-500 mt-1">Enter a patient's UPHAR ID to view their medical history or request modification access.</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Enter Patient ID (e.g., UPH-10023)" 
              className="pl-10 h-12 text-lg uppercase font-mono" 
              required 
              value={upharId}
              onChange={(e) => setUpharId(e.target.value.toUpperCase())}
            />
          </div>
          <Button type="submit" className="h-12 px-8">Search</Button>
        </form>
      </div>

      {searchStatus === 'FOUND' && (
        <div className="bg-white border rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Golam Zaid</h3>
              <p className="text-slate-500">Patient ID: {upharId || 'UPH-10023'} | 28 Yrs, Male</p>
            </div>
          </div>

          {!showRequestForm ? (
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex gap-2">
                <Eye className="w-5 h-5 text-blue-600 shrink-0" />
                <p>You can currently view this patient's medical timeline. To add or modify records, you must request authorization.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {/* DIRECT VIEW ACCESS */}
                <Link to={`/doctor/patients/${upharId.replace(/[^0-9]/g, '') || '10023'}`} className="flex-1">
                  <Button className="w-full h-12 text-base gap-2">
                    <Eye className="w-5 h-5" /> View Patient Timeline <ArrowRight className="w-4 h-4"/>
                  </Button>
                </Link>
                
                {/* MODIFY ACCESS REQUEST */}
                <Button variant="outline" onClick={() => setShowRequestForm(true)} className="flex-1 h-12 text-base gap-2 border-slate-300">
                  <FileEdit className="w-5 h-5" /> Request Modify Access
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-orange-500" /> Request Authorization to Modify
              </h4>
              <p className="text-sm text-slate-500">Specify how long you need access to add new consultation notes or update treatments.</p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Access Duration</label>
                <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>24 Hours (Standard Visit)</option>
                  <option>7 Days (Ongoing Care)</option>
                  <option>1 Month (Chronic Treatment)</option>
                </select>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                <Button onClick={() => setSearchStatus('REQUEST_SENT')} className="flex-1 gap-2">
                  <ShieldAlert className="h-5 w-5" /> Send Modify Request
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {searchStatus === 'REQUEST_SENT' && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center animate-in zoom-in duration-300">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-1">Authorization Request Sent!</h3>
          <p className="text-sm">The patient has been notified. You can still view their timeline, but modification rights will unlock once they approve.</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100" onClick={() => setSearchStatus('IDLE')}>
              Search Another Patient
            </Button>
            <Link to={`/doctor/patients/${upharId.replace(/[^0-9]/g, '') || '10023'}`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white">Go to Timeline</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
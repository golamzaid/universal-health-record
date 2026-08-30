import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Shield, Clock, Building, User, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/supabaseClient';

type Tab = 'PENDING' | 'HISTORY';

export const PatientConsents = () => {
  const [activeTab, setActiveTab] = useState<Tab>('PENDING');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [consents, setConsents] = useState<any[]>([]);

  // Fetch Consents on Load
  useEffect(() => {
    const fetchConsents = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const resUsers = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/`);
          const users = await resUsers.json();
          const dbUser = users.find((u: any) => u.email === user.email);
          
          if (dbUser) {
            const resConsents = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/${dbUser.id}/consents`);
            const data = await resConsents.json();
            
            // Sort by newest first
            const sorted = data.sort((a: any, b: any) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime());
            setConsents(sorted);
          }
        } catch (err) {
          console.error('Error fetching consents:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchConsents();
  }, []);

  const handleAction = async (consentId: number, newStatus: string) => {
    setActionLoading(consentId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/consents/${consentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        // Update local state immediately
        setConsents(prev => prev.map(c => c.id === consentId ? { ...c, status: newStatus } : c));
      } else {
        alert('Failed to update consent status');
      }
    } catch (err) {
      alert('Server error while updating consent');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredConsents = consents.filter(c => 
    activeTab === 'PENDING' ? c.status === 'PENDING' : c.status !== 'PENDING'
  );

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Access & Consents</h1>
        <p className="text-sm text-slate-500 mt-1">Manage who can view or modify your medical records.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'PENDING' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Pending Requests
          {consents.filter(c => c.status === 'PENDING').length > 0 && (
            <span className="bg-orange-100 text-orange-600 py-0.5 px-2 rounded-full text-xs font-bold">
              {consents.filter(c => c.status === 'PENDING').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'HISTORY' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Active & Past Access
        </button>
      </div>

      {/* Consent Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filteredConsents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <Shield className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No requests found</h3>
            <p className="text-sm text-slate-500">You don't have any {activeTab.toLowerCase()} access requests.</p>
          </div>
        ) : (
          filteredConsents.map((consent) => (
            <div key={consent.id} className="bg-white border rounded-xl shadow-sm p-5 transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                {/* Requester Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    {consent.status === 'PENDING' && <span className="flex items-center gap-1 text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md border border-orange-200"><AlertCircle className="w-3.5 h-3.5"/> Action Required</span>}
                    {consent.status === 'ACTIVE' && <span className="flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-md border border-green-200"><Check className="w-3.5 h-3.5"/> Active Access</span>}
                    {consent.status === 'REVOKED' && <span className="flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200"><X className="w-3.5 h-3.5"/> Revoked</span>}
                    {consent.status === 'REJECTED' && <span className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-md border border-red-200"><X className="w-3.5 h-3.5"/> Rejected</span>}
                    <span className="text-xs font-medium text-slate-500 ml-auto md:ml-0">
                      {new Date(consent.request_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-slate-400" /> {consent.doctor_name}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4 text-slate-400" /> {consent.hospital_name}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mt-3 border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requested Access</p>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{consent.access_type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 mt-3">
                      <span className="text-slate-600 flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-slate-400"/> Duration: {consent.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-3 min-w-[140px]">
                  {consent.status === 'PENDING' && (
                    <>
                      <Button onClick={() => handleAction(consent.id, 'ACTIVE')} className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm" disabled={actionLoading === consent.id}>
                        {actionLoading === consent.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4" />} Approve
                      </Button>
                      <Button onClick={() => handleAction(consent.id, 'REJECTED')} variant="outline" className="w-full text-red-600 hover:bg-red-50 border-red-200 gap-2" disabled={actionLoading === consent.id}>
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </>
                  )}
                  {consent.status === 'ACTIVE' && (
                    <Button onClick={() => handleAction(consent.id, 'REVOKED')} variant="outline" className="w-full text-red-600 hover:bg-red-50 border-red-200 gap-2" disabled={actionLoading === consent.id}>
                      {actionLoading === consent.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <X className="w-4 h-4" />} Revoke Access
                    </Button>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
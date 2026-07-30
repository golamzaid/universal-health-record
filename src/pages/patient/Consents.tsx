import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Shield, Clock, Building, User, Check, X, AlertCircle } from 'lucide-react';

type Tab = 'PENDING' | 'HISTORY';

export const PatientConsents = () => {
  const [activeTab, setActiveTab] = useState<Tab>('PENDING');

  const consents = [
    {
      id: 'REQ-001',
      doctor: 'Dr. Sarah Smith',
      organization: 'ABC Diagnostic Center',
      requestedData: ['Lab Reports', 'Medical History'],
      duration: '24 Hours',
      status: 'PENDING',
      requestDate: '2026-07-30',
      reason: 'Upcoming Consultation'
    },
    {
      id: 'REQ-002',
      doctor: 'Dr. Rajesh Kumar',
      organization: 'City Hospital',
      requestedData: ['Prescriptions', 'Lab Reports'],
      duration: '1 Week',
      status: 'ACTIVE',
      requestDate: '2026-07-28',
      reason: 'Ongoing Treatment'
    },
    {
      id: 'REQ-003',
      doctor: 'Dr. Emily Chen',
      organization: 'General Clinic',
      requestedData: ['Imaging/MRI'],
      duration: '24 Hours',
      status: 'REVOKED',
      requestDate: '2026-07-15',
      reason: 'Second Opinion'
    }
  ];

  const filteredConsents = consents.filter(c => 
    activeTab === 'PENDING' ? c.status === 'PENDING' : c.status !== 'PENDING'
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Access & Consents</h1>
        <p className="text-sm text-slate-500 mt-1">Manage who can view your medical records.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'PENDING' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Pending Requests
          <span className="ml-2 bg-orange-100 text-orange-600 py-0.5 px-2 rounded-full text-xs">1</span>
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'HISTORY' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Active & Past
        </button>
      </div>

      {/* Consent Cards List */}
      <div className="space-y-4">
        {filteredConsents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <Shield className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No requests found</h3>
            <p className="text-sm text-slate-500">You don't have any {activeTab.toLowerCase()} access requests.</p>
          </div>
        ) : (
          filteredConsents.map((consent) => (
            <div key={consent.id} className="bg-white border rounded-xl shadow-sm p-5 transition-shadow hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                {/* Requester Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    {consent.status === 'PENDING' && <span className="flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full"><AlertCircle className="w-3 h-3"/> Action Required</span>}
                    {consent.status === 'ACTIVE' && <span className="flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full"><Check className="w-3 h-3"/> Active Access</span>}
                    {consent.status === 'REVOKED' && <span className="flex items-center gap-1 text-xs font-medium bg-red-100 text-red-700 px-2.5 py-1 rounded-full"><X className="w-3 h-3"/> Revoked</span>}
                    <span className="text-xs text-slate-500 ml-auto md:ml-0">{consent.requestDate}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-slate-400" /> {consent.doctor}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4 text-slate-400" /> {consent.organization}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 mt-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Requested Access</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {consent.requestedData.map(data => (
                        <span key={data} className="bg-white border text-slate-700 text-xs px-2 py-1 rounded-md">{data}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400"/> {consent.duration}</span>
                      <span className="text-slate-500 italic">"{consent.reason}"</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-3 min-w-[140px]">
                  {consent.status === 'PENDING' && (
                    <>
                      <Button className="w-full bg-success hover:bg-success/90 text-white gap-2">
                        <Check className="w-4 h-4" /> Approve
                      </Button>
                      <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 border-destructive/30 gap-2">
                        <X className="w-4 h-4" /> Reject
                      </Button>
                    </>
                  )}
                  {consent.status === 'ACTIVE' && (
                    <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 border-destructive/30 gap-2">
                      <X className="w-4 h-4" /> Revoke Access
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
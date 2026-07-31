import { useState } from 'react';
import { StatusBadge } from '@/components/Badges/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Plus, Filter, FileText, History } from 'lucide-react';
import { VersionHistoryModal } from '@/components/modals/VersionHistoryModal';

export const PatientRecords = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const records = [
    { id: 'REC-001', date: '2026-07-23', title: 'Complete Blood Count (CBC)', provider: 'ABC Diagnostic Center', status: 'PROVIDER_VERIFIED' as const, hasHistory: true },
    { id: 'REC-002', date: '2026-07-21', title: 'General Checkup', provider: 'Dr. Sarah Smith', status: 'PROVIDER_VERIFIED' as const, hasHistory: false },
    { id: 'REC-003', date: '2019-04-15', title: 'Appendectomy Report', provider: 'City Hospital', status: 'PATIENT_UPLOADED' as const, hasHistory: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Records</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your medical reports, prescriptions, and documents.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Upload Record</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search records by name or provider..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {records.map((record) => (
            <div key={record.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg mt-1 sm:mt-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{record.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-500">
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{record.provider}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <StatusBadge status={record.status} />
                {record.hasHistory && (
                  <Button variant="outline" size="sm" onClick={() => setIsHistoryOpen(true)} className="gap-2 text-slate-600">
                    <History className="h-4 w-4" /> History
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-primary">View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <VersionHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
};
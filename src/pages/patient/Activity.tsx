import { useState } from 'react';
import { Eye, Edit3, ShieldAlert, CheckCircle, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const PatientActivity = () => {
  const auditLogs = [
    {
      id: 1,
      date: '24 July 2026, 10:15 AM',
      actor: 'ABC Diagnostic Center',
      action: 'UPDATED',
      resource: 'Complete Blood Count (CBC)',
      reason: 'Lab data entry correction.',
      icon: Edit3,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      id: 2,
      date: '24 July 2026, 09:30 AM',
      actor: 'Dr. Sarah Smith',
      action: 'VIEWED',
      resource: 'Medical Timeline & Lab Reports',
      reason: 'Authorized access via Consent (REQ-002)',
      icon: Eye,
      color: 'text-slate-600',
      bg: 'bg-slate-100'
    },
    {
      id: 3,
      date: '23 July 2026, 04:00 PM',
      actor: 'You (Golam Zaid)',
      action: 'APPROVED',
      resource: 'Access Request (Dr. Sarah Smith)',
      reason: 'Duration: 24 Hours',
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      id: 4,
      date: '23 July 2026, 02:30 PM',
      actor: 'ABC Diagnostic Center',
      action: 'CREATED',
      resource: 'Complete Blood Count (CBC)',
      reason: 'New lab result uploaded.',
      icon: Edit3,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Access & Activity Log</h1>
        <p className="text-sm text-slate-500 mt-1">A complete, tamper-proof history of who accessed or modified your data.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search logs by doctor, hospital, or action..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
          {auditLogs.map((log) => (
            <div key={log.id} className="relative pl-8">
              <div className={`absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${log.bg}`}>
                <log.icon className={`h-4 w-4 ${log.color}`} />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-slate-900">
                    <span className="font-bold">{log.actor}</span> <span className="font-semibold text-slate-600">{log.action.toLowerCase()}</span> your <span className="font-medium text-slate-800">{log.resource}</span>
                  </p>
                  {log.reason && (
                    <p className="text-sm text-slate-500 mt-1 border-l-2 border-slate-200 pl-3">
                      Note: {log.reason}
                    </p>
                  )}
                </div>
                <div className="text-xs font-medium text-slate-400 whitespace-nowrap">
                  {log.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Security note */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
        <ShieldAlert className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p>This audit log is append-only and cannot be altered by anyone, including platform administrators. It provides a cryptographically secure trail of your medical data history.</p>
      </div>
    </div>
  );
};
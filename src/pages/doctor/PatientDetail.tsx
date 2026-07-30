import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Activity, TestTube, ArrowLeft, Plus } from 'lucide-react';
import { StatusBadge } from '@/components/Badges/StatusBadge';
import { Button } from '@/components/ui/Button';

export const PatientDetail = () => {
  const { id } = useParams(); // URL se P-10023 nikalega

  const timelineEvents = [
    {
      id: 1,
      date: '2026-07-23',
      type: 'Lab Result',
      title: 'Complete Blood Count (CBC)',
      provider: 'ABC Diagnostic Center',
      status: 'PROVIDER_VERIFIED' as const,
      icon: TestTube,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      id: 2,
      date: '2019-04-15',
      type: 'Surgery',
      title: 'Appendectomy',
      provider: 'City Hospital',
      status: 'PATIENT_UPLOADED' as const,
      icon: Activity,
      color: 'text-slate-600',
      bg: 'bg-slate-100'
    }
  ];

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <Link to="/doctor/patients" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Golam Zaid</h1>
          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
            <span>ID: {id || 'P-10023'}</span>
            <span>•</span>
            <span>28 Yrs, Male</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> Authorized (22h left)
            </span>
          </div>
        </div>
        <Button className="ml-auto gap-2">
          <Plus className="h-4 w-4" /> Add Consultation Note
        </Button>
      </div>

      {/* Warning Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-blue-800 text-sm">
        <Activity className="h-5 w-5 text-blue-600 shrink-0" />
        <p>
          You are viewing a patient-controlled medical record. You only have access to <strong>Medical History</strong> and <strong>Lab Reports</strong> as authorized by the patient. Any new records you add will be marked as Provider Verified.
        </p>
      </div>

      {/* Timeline View */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b">Authorized Medical Timeline</h3>
        
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative pl-8">
              <div className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${event.bg}`}>
                <event.icon className={`h-4 w-4 ${event.color}`} />
              </div>

              <div className="bg-slate-50 border rounded-xl p-5 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{event.type}</span>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">{event.title}</h4>
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">{event.provider}</span>
                  <StatusBadge status={event.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
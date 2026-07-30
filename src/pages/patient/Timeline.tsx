import { StatusBadge } from '@/components/Badges/StatusBadge';
import { Activity, Stethoscope, TestTube, Pill } from 'lucide-react';

export const PatientTimeline = () => {
  // Mock Data for the Timeline
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
      date: '2026-07-21',
      type: 'Consultation',
      title: 'General Checkup',
      provider: 'Dr. Sarah Smith',
      status: 'PROVIDER_VERIFIED' as const,
      icon: Stethoscope,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      id: 3,
      date: '2025-11-10',
      type: 'Prescription',
      title: 'Antibiotics Course',
      provider: 'XYZ Clinic',
      status: 'PROVIDER_VERIFIED' as const,
      icon: Pill,
      color: 'text-teal-600',
      bg: 'bg-teal-100'
    },
    {
      id: 4,
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
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Medical Timeline</h1>
        <p className="text-sm text-slate-500 mt-1">A chronological view of your health history.</p>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
        {timelineEvents.map((event) => (
          <div key={event.id} className="relative pl-8">
            {/* Timeline Dot */}
            <div className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${event.bg}`}>
              <event.icon className={`h-4 w-4 ${event.color}`} />
            </div>

            {/* Event Card */}
            <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{event.type}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{event.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-slate-700">{event.provider}</span>
                <span className="text-slate-300">•</span>
                <StatusBadge status={event.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
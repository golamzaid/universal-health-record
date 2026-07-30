import { Users, FileText, CheckCircle } from 'lucide-react';

export const HospitalDashboard = () => {
  const stats = [
    { name: 'Total Patients', value: '1,245', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Records Added (This Month)', value: '342', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Pending Consents', value: '12', icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hospital Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of ABC Diagnostic Center's platform usage.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
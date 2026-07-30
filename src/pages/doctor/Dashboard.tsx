import { Users, Clock, CheckCircle } from 'lucide-react';

export const DoctorDashboard = () => {
  const stats = [
    { name: 'Authorized Patients', value: '45', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Pending Requests', value: '3', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Recent Access (24h)', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dr. Smith's Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your patients and access requests.</p>
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
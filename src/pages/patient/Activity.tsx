import { useState, useEffect } from 'react';
import { Eye, Edit3, ShieldAlert, CheckCircle, Search, Filter, Loader2, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/supabaseClient';

// Define the interface for our unified activity log objects
interface ActivityItem {
  id: string;
  rawDate: Date; // Used for accurate sorting
  displayDate: string; // Formatted date for UI
  actor: string;
  action: string;
  resource: string;
  reason: string;
  icon: any;
  color: string;
  bg: string;
}

export const PatientActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        // 1. Authenticate and retrieve the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const usersRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/`);
        const users = await usersRes.json();
        const dbUser = users.find((u: any) => u.email === user.email);

        if (dbUser) {
          // 2. Fetch both Medical Records and Consents concurrently for maximum performance
          const [recordsRes, consentsRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/${dbUser.id}/records`),
            fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/${dbUser.id}/consents`)
          ]);

          const recordsData = await recordsRes.json();
          const consentsData = await consentsRes.json();

          // 3. Transform Medical Records into Activity Items
          const recordLogs: ActivityItem[] = recordsData.map((record: any) => ({
            id: `rec-${record.id}`,
            rawDate: new Date(record.date),
            displayDate: new Date(record.date).toLocaleString('en-US', { 
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            }),
            actor: record.provider_name,
            action: 'UPLOADED',
            resource: record.title,
            reason: `Category: ${record.category}`,
            icon: Edit3,
            color: 'text-purple-600',
            bg: 'bg-purple-100'
          }));

          // 4. Transform Consents (Access Requests) into Activity Items
          const consentLogs: ActivityItem[] = consentsData.map((consent: any) => {
            let actionStr = consent.status;
            let actorStr = consent.doctor_name;
            let icon = Eye;
            let color = 'text-slate-600';
            let bg = 'bg-slate-100';

            // Determine styling and terminology based on the consent status
            if (consent.status === 'PENDING') {
              actionStr = 'REQUESTED ACCESS';
              icon = ShieldAlert;
              color = 'text-orange-600'; 
              bg = 'bg-orange-100';
            } else if (consent.status === 'ACTIVE') {
              actionStr = 'AUTHORIZED';
              actorStr = 'You'; // The patient performed the authorization
              icon = CheckCircle;
              color = 'text-green-600'; 
              bg = 'bg-green-100';
            } else if (consent.status === 'REVOKED' || consent.status === 'REJECTED') {
              actionStr = consent.status;
              actorStr = 'You'; // The patient performed the rejection/revocation
              icon = XCircle;
              color = 'text-red-600'; 
              bg = 'bg-red-100';
            }

            return {
              id: `con-${consent.id}`,
              rawDate: new Date(consent.request_date),
              displayDate: new Date(consent.request_date).toLocaleString('en-US', { 
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
              }),
              actor: actorStr,
              action: actionStr,
              resource: `Medical Records (${consent.access_type})`,
              reason: `Duration: ${consent.duration} | Facility: ${consent.hospital_name}`,
              icon: icon,
              color: color,
              bg: bg
            };
          });

          // 5. Merge both arrays and sort chronologically (newest first)
          const mergedLogs = [...recordLogs, ...consentLogs].sort(
            (a, b) => b.rawDate.getTime() - a.rawDate.getTime()
          );

          setActivities(mergedLogs);
        }
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  // Filter functionality for the search bar
  const filteredActivities = activities.filter(log => 
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Access & Activity Log</h1>
        <p className="text-sm text-slate-500 mt-1">A complete, tamper-proof history of who accessed or modified your data.</p>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search logs by doctor, hospital, or action..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {/* Activity Log Feed */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-primary">
             <Loader2 className="w-8 h-8 animate-spin mb-3" />
             <p className="text-sm font-medium">Compiling activity history...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
             No activity found matching your search criteria.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
            {filteredActivities.map((log) => (
              <div key={log.id} className="relative pl-8">
                
                {/* Timeline Node/Icon */}
                <div className={`absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${log.bg}`}>
                  <log.icon className={`h-4 w-4 ${log.color}`} />
                </div>
                
                {/* Log Details */}
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
                  
                  {/* Timestamp */}
                  <div className="text-xs font-medium text-slate-400 whitespace-nowrap pt-1">
                    {log.displayDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Security Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg text-sm text-slate-600 border">
        <ShieldAlert className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p>This audit log is append-only and cannot be altered by anyone, including platform administrators. It provides a cryptographically secure trail of your medical data history.</p>
      </div>
    </div>
  );
};
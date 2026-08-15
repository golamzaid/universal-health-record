import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/Badges/StatusBadge';
import { Activity, Stethoscope, TestTube, Pill, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/supabaseClient';

interface Record {
  id: number;
  title: string;
  provider_name: string;
  category: string;
  date: string;
  file_url?: string;
}

export const PatientTimeline = () => {
  const [events, setEvents] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const usersResponse = await fetch('http://127.0.0.1:8000/users/');
        const users = await usersResponse.json();
        const dbUser = users.find((u: any) => u.email === user.email);

        if (dbUser) {
          const recordsResponse = await fetch(`http://127.0.0.1:8000/users/${dbUser.id}/records`);
          const recordsData = await recordsResponse.json();
          
          const sortedRecords = recordsData.sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setEvents(sortedRecords);
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Lab Result':
        return { icon: TestTube, color: 'text-purple-600', bg: 'bg-purple-100' };
      case 'Prescription':
        return { icon: Pill, color: 'text-teal-600', bg: 'bg-teal-100' };
      case 'Consultation Note':
        return { icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'Imaging/MRI':
        return { icon: Activity, color: 'text-slate-600', bg: 'bg-slate-100' };
      default:
        return { icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' };
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Medical Timeline</h1>
        <p className="text-sm text-slate-500 mt-1">A chronological view of your real-time health history.</p>
      </div>

      {loading ? (
        <div className="text-center p-10 text-primary animate-pulse font-medium">
          Loading your secure medical timeline...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center p-10 bg-white border rounded-xl shadow-sm text-slate-500">
          No medical records found yet. When hospitals upload your reports, they will appear here.
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-8">
          {events.map((event) => {
            const style = getCategoryStyle(event.category);
            const Icon = style.icon;
            
            return (
              <div key={event.id} className="relative pl-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${style.bg}`}>
                  <Icon className={`h-4 w-4 ${style.color}`} />
                </div>
                
                <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{event.category}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">{event.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 w-full">
                    <span className="text-sm font-medium text-slate-700">{event.provider_name}</span>
                    <span className="text-slate-300">•</span>
                    <StatusBadge status="PROVIDER_VERIFIED" />
                    
                    {event.file_url && (
                      <a href={event.file_url} target="_blank" rel="noopener noreferrer" className="ml-auto">
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-primary border-primary/20 hover:bg-primary/5">
                          <Eye className="w-3.5 h-3.5" /> View File
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
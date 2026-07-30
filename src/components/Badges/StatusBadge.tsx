import { ShieldCheck, User, AlertCircle } from 'lucide-react';
import { cn } from '@/components/ui/Button';

type Status = 'PROVIDER_VERIFIED' | 'PATIENT_UPLOADED' | 'UNVERIFIED';

export const StatusBadge = ({ status, className }: { status: Status; className?: string }) => {
  const config = {
    PROVIDER_VERIFIED: {
      color: 'bg-success/10 text-success-foreground border-success/20',
      icon: ShieldCheck,
      label: 'Provider Verified'
    },
    PATIENT_UPLOADED: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: User,
      label: 'Patient Uploaded'
    },
    UNVERIFIED: {
      color: 'bg-warning/10 text-warning-foreground border-warning/20',
      icon: AlertCircle,
      label: 'Unverified'
    }
  };

  const { color, icon: Icon, label } = config[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", color, className)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
};
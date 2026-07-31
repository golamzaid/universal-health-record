import { X, History, ArrowRight } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistoryModal = ({ isOpen, onClose }: VersionHistoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Record Version History</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="mb-2">
            <h3 className="font-semibold text-slate-900">Complete Blood Count (CBC)</h3>
            <p className="text-sm text-slate-500">Record ID: REC-001</p>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pb-4">
            
            {/* Current Version */}
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-white" />
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Current Version (v2)</span>
                  <span className="text-xs text-slate-500">24 July 2026, 10:15 AM</span>
                </div>
                <div className="text-sm text-slate-900 space-y-1">
                  <p><strong>Hemoglobin:</strong> 13.2 g/dL</p>
                  <p><strong>WBC:</strong> 7200 /uL</p>
                </div>
                <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-blue-200 border-dashed">
                  <strong>Updated by:</strong> ABC Diagnostic Center<br/>
                  <strong>Reason:</strong> Lab data entry correction.
                </p>
              </div>
            </div>

            {/* Previous Version */}
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-slate-300 ring-4 ring-white" />
              <div className="bg-white border rounded-lg p-4 opacity-75">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Original Version (v1)</span>
                  <span className="text-xs text-slate-500">23 July 2026, 02:30 PM</span>
                </div>
                <div className="text-sm text-slate-500 space-y-1 line-through">
                  <p><strong>Hemoglobin:</strong> 12.5 g/dL</p>
                  <p><strong>WBC:</strong> 7200 /uL</p>
                </div>
                <div className="mt-3 text-sm text-orange-600 flex items-center gap-1.5">
                  <ArrowRight className="h-4 w-4" /> Changed to 13.2 g/dL in v2
                </div>
                <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-dashed">
                  <strong>Added by:</strong> ABC Diagnostic Center
                </p>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
};
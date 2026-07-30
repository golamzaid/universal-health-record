import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadCloud } from 'lucide-react';

export const AddRecord = () => {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Add Medical Record</h1>
        <p className="text-sm text-slate-500 mt-1">Upload a verified medical record to a patient's timeline.</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Patient ID or Email *</label>
            <div className="flex gap-2">
              <Input placeholder="e.g. P-10023 or patient@email.com" />
              <Button variant="secondary">Verify</Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Record Title *</label>
            <Input placeholder="e.g. Complete Blood Count (CBC)" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Date of Test/Event *</label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category *</label>
              <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Lab Result</option>
                <option>Prescription</option>
                <option>Consultation Note</option>
                <option>Imaging/MRI</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Upload Document (PDF, JPG) *</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end gap-3">
          <Button variant="ghost">Cancel</Button>
          <Button>Submit Verified Record</Button>
        </div>
      </div>
    </div>
  );
};
import { AlertCircle, Droplet, HeartPulse, Phone, QrCode, ShieldAlert, Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PatientEmergency = () => {
  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            Emergency Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">Critical life-saving information accessible via QR code for first responders.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" /> Print</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2"><Download className="h-4 w-4" /> Save PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* QR Code Section */}
        <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-white border-2 border-red-100 rounded-xl shadow-sm text-center">
          <div className="bg-red-50 p-4 rounded-xl mb-4">
            {/* Mock QR Code for Stage 1 */}
            <QrCode className="h-32 w-32 text-slate-800" strokeWidth={1} />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Emergency Access QR</h3>
          <p className="text-xs text-slate-500 mb-4">Scan to view critical medical data only. Access is logged.</p>
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">Regenerate QR</Button>
        </div>

        {/* Critical Info Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <h2 className="font-semibold text-red-900">Patient Identification</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500">Full Name</p>
                <p className="font-semibold text-slate-900">Golam Zaid</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date of Birth</p>
                <p className="font-semibold text-slate-900">14 August 1995 (30 Yrs)</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 flex items-center gap-1"><Droplet className="h-4 w-4 text-red-500"/> Blood Group</p>
                <p className="font-bold text-red-600 text-lg">O Positive (O+)</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 flex items-center gap-1"><Phone className="h-4 w-4 text-slate-400"/> Emergency Contact</p>
                <p className="font-semibold text-slate-900">Sarah Zaid (Wife)</p>
                <p className="text-sm text-slate-600">+91 98765 43210</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
              <h2 className="font-semibold text-orange-900 flex items-center gap-2">
                <HeartPulse className="h-5 w-5 text-orange-600" />
                Critical Medical Alerts
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Severe Allergies</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Penicillin (Anaphylaxis)</span>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Peanuts</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Chronic Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Type 1 Diabetes</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Asthma</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
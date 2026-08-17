import { useState, useRef } from 'react';
import { AlertCircle, Droplet, HeartPulse, Phone, ShieldAlert, Download, Printer, Activity, User, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const PatientEmergency = () => {
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Professional Structured Medical Data Format
  const generateEmergencyData = () => {
    return `====================================
 🏥 UPHAR DIGITAL MEDICAL ALERT 🏥
====================================
PATIENT ID  : UPH-140151
FULL NAME   : Golam Zaid
BLOOD TYPE  : O+ (O POSITIVE)
DOB / AGE   : 14 Aug 1995 (30 Yrs)
GENDER      : Male
------------------------------------
[ CRITICAL MEDICAL ALERTS ]
⚠️ ALLERGIES:
• Penicillin (Anaphylaxis)
• Peanuts

⚠️ CHRONIC CONDITIONS:
• Type 1 Diabetes
• Asthma
------------------------------------
[ EMERGENCY CONTACT ]
NAME  : XXXXXX (Wife)
PHONE : +91 98765-43210
------------------------------------
* CONFIDENTIAL MEDICAL DATA *
Authorized by Universal Health Record
====================================`;
  };

  const [qrValue, setQrValue] = useState(generateEmergencyData());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  // 1. REGENERATE QR FUNCTION
  const handleRegenerateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Adding Timestamp for authenticity
      const timestamp = new Date().toLocaleString();
      setQrValue(generateEmergencyData() + `\nGenerated: ${timestamp}`);
      setIsGenerating(false);
    }, 800);
  };

  // 2. PRINT FUNCTION
  const handlePrint = () => {
    window.print();
  };

  // 3. DOWNLOAD PDF FUNCTION
  const handleDownloadPDF = async () => {
    if (!profileRef.current) return;
    setIsPdfLoading(true);
    
    try {
      const canvas = await html2canvas(profileRef.current, { 
        scale: 2, 
        useCORS: true, 
        logging: false 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; 
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('UPHAR_Emergency_Profile.pdf');
    } catch (error) {
      console.error('PDF Generation failed', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-300">
      
      {/* Inline CSS */}
      <style>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 95%; }
          90% { opacity: 1; }
          100% { top: 5%; opacity: 0; }
        }
        .scanner-line {
          animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @media print {
          body * { visibility: hidden; }
          #emergency-profile, #emergency-profile * { visibility: visible; }
          #emergency-profile { position: absolute; left: 0; top: 0; width: 100%; }
          .print-hidden { display: none !important; }
        }
      `}</style>

      {/* Header Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print-hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-red-500" />
            Emergency Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">Critical life-saving information accessible via QR code for first responders.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="gap-2 border-slate-300 hover:bg-slate-100">
            <Printer className="h-4 w-4" /> Print Card
          </Button>
          <Button onClick={handleDownloadPDF} disabled={isPdfLoading} className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg shadow-red-600/20">
            {isPdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} 
            {isPdfLoading ? 'Generating PDF...' : 'Save as PDF'}
          </Button>
        </div>
      </div>

      <div id="emergency-profile" ref={profileRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 bg-slate-50 p-2 rounded-3xl">
        
        {/* QR SCANNER SECTION */}
        <div className="lg:col-span-1 relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="p-8 flex-1 flex flex-col items-center justify-center relative z-10">
            
            <div className="relative p-4 bg-white rounded-2xl shadow-xl mb-8 group transition-transform hover:scale-105 duration-500">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500 rounded-tl-xl transition-all group-hover:border-red-600 group-hover:-translate-x-1 group-hover:-translate-y-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500 rounded-tr-xl transition-all group-hover:border-red-600 group-hover:translate-x-1 group-hover:-translate-y-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500 rounded-bl-xl transition-all group-hover:border-red-600 group-hover:-translate-x-1 group-hover:translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500 rounded-br-xl transition-all group-hover:border-red-600 group-hover:translate-x-1 group-hover:translate-y-1"></div>

              <div className="scanner-line print-hidden absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_2px_rgba(239,68,68,0.8)] z-20 pointer-events-none"></div>

              {/* QR CODE WITH ACTUAL DATA */}
              <div className={`transition-opacity duration-300 relative z-10 ${isGenerating ? 'opacity-20' : 'opacity-100'}`}>
                <QRCodeSVG 
                  value={qrValue} 
                  size={180} 
                  level="Q" 
                  fgColor="#0f172a" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full z-20">
                  <Activity className="w-8 h-8 text-red-600 bg-red-50 p-1.5 rounded-full" />
                </div>
              </div>
            </div>

            <h3 className="font-bold text-white text-xl mb-2 flex items-center gap-2 tracking-wide">
              Scan For Rescue
            </h3>
            <p className="text-sm text-slate-400 text-center mb-6 px-2 leading-relaxed">
              First responders can scan this to securely access your life-saving medical data.
            </p>

            <Button onClick={handleRegenerateQR} disabled={isGenerating} className="print-hidden w-full bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg shadow-red-500/25 h-12 text-sm rounded-xl font-semibold gap-2">
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate Secure QR
            </Button>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-white px-8 py-5 border-b border-red-100 flex items-center gap-3">
              <User className="h-5 w-5 text-red-600" />
              <h2 className="font-bold text-slate-900 text-lg">Patient Identification</h2>
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</p>
                <p className="font-black text-slate-900 text-xl">Golam Zaid</p>
                <p className="text-sm text-slate-500 mt-1">Male, 14 August 1995 (30 Yrs)</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1 flex items-center gap-1.5">
                  <Droplet className="h-4 w-4" /> Blood Group
                </p>
                <p className="font-black text-red-600 text-3xl">O Positive <span className="text-xl">(O+)</span></p>
              </div>

              <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Emergency Contact (Wife)</p>
                  <p className="font-bold text-slate-900 text-lg">XXXXXX • +91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-white px-8 py-5 border-b border-orange-100 flex items-center gap-3">
              <HeartPulse className="h-6 w-6 text-orange-600" />
              <h2 className="font-bold text-slate-900 text-lg">Critical Medical Alerts</h2>
            </div>
            
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500"/> Severe Allergies
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-200 shadow-sm">
                    Penicillin (Anaphylaxis)
                  </span>
                  <span className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-200 shadow-sm">
                    Peanuts
                  </span>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500"/> Chronic Conditions
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-orange-50 text-orange-800 rounded-xl text-sm font-bold border border-orange-200 shadow-sm">
                    Type 1 Diabetes
                  </span>
                  <span className="px-4 py-2 bg-orange-50 text-orange-800 rounded-xl text-sm font-bold border border-orange-200 shadow-sm">
                    Asthma
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
import { User, Stethoscope, Building, ShieldCheck, Key, FileText, Share2, Search, UploadCloud, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const HowItWorks = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 pb-24">
      
      {/* Header Section */}
      <div className="bg-white border-b py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          How <span className="text-primary">UPHAR</span> Works
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          A unified, secure, and transparent healthcare ecosystem. See how UPHAR simplifies medical records for everyone.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* PATIENT SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">For Patients</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <StepCard 
              number="1"
              icon={Key}
              title="Create UPHAR ID"
              desc="Sign up to generate your unique Health ID. This ID will be used across all hospitals and clinics."
            />
            <StepCard 
              number="2"
              icon={FileText}
              title="Collect Records"
              desc="Hospitals push your lab reports and prescriptions directly to your secure digital timeline."
            />
            <StepCard 
              number="3"
              icon={ShieldCheck}
              title="Grant Access"
              desc="Give temporary, time-bound access (e.g., 24 hours) to your doctor. You control your data."
            />
          </div>
        </section>

        {/* DOCTOR SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-teal-100 p-3 rounded-xl text-teal-600">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">For Doctors</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <StepCard 
              number="1"
              icon={Search}
              title="Search Patient"
              desc="Enter the patient's UPHAR ID to find their profile in the secure healthcare directory."
            />
            <StepCard 
              number="2"
              icon={Share2}
              title="Request Consent"
              desc="Send a request specifying what records you need (e.g., MRI, Blood Tests) and for how long."
            />
            <StepCard 
              number="3"
              icon={Activity}
              title="View Timeline"
              desc="Once approved, view a clean, chronological timeline of the patient's medical history."
            />
          </div>
        </section>

        {/* HOSPITAL SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <Building className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">For Hospitals & Labs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <StepCard 
              number="1"
              icon={ShieldCheck}
              title="Verify Patient"
              desc="Verify the patient's identity using their UPHAR ID before generating any medical report."
            />
            <StepCard 
              number="2"
              icon={UploadCloud}
              title="Upload Records"
              desc="Securely upload verified documents (PDFs/Images) directly to the patient's digital record."
            />
            <StepCard 
              number="3"
              icon={FileText}
              title="Immutable Log"
              desc="Every record uploaded is digitally signed and logged permanently to prevent tampering."
            />
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-3xl p-10 text-center text-white mt-16 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
            Join thousands of patients, doctors, and hospitals already using UPHAR to streamline medical records.
          </p>
          <Link to="/login">
            <Button className="bg-white text-primary hover:bg-slate-100 h-14 px-8 text-lg rounded-xl font-bold shadow-lg">
              Create Your Free Account
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

// Ek chhota sa component reusable cards ke liye
const StepCard = ({ number, icon: Icon, title, desc }: any) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="text-6xl font-black text-slate-50 absolute -right-4 -top-6 group-hover:scale-110 transition-transform duration-300 pointer-events-none select-none">
      {number}
    </div>
    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-6 border relative z-10">
      <Icon className="w-6 h-6 text-slate-600" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2 relative z-10">{title}</h3>
    <p className="text-slate-600 relative z-10">{desc}</p>
  </div>
);
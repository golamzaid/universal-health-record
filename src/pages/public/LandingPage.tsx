import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Share2, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  const features = [
    {
      title: "Complete Patient Control",
      description: "You decide who sees your records. Grant temporary access to doctors and revoke it anytime.",
      icon: ShieldCheck,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Universal Integration",
      description: "Hospitals and labs can directly push verified reports to your unified medical timeline.",
      icon: Activity,
      color: "text-teal-600",
      bg: "bg-teal-100"
    },
    {
      title: "Instant Sharing",
      description: "Generate emergency QR codes or share secure links for immediate medical attention.",
      icon: Share2,
      color: "text-purple-600",
      bg: "bg-purple-100"
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-24 text-center overflow-hidden flex-1 flex flex-col justify-center">
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-blue-200 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm text-primary text-sm font-semibold mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Welcome to the Future of Healthcare
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Your Medical History. <br/>
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Secure. Portable. Yours.
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto sm:text-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            The <strong>Universal Patient Health Access & Record (UPHAR)</strong> platform puts you in control. 
            Collect your records from hospitals, clinics, and labs. Share them securely with doctors using temporary access codes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link to="/login">
              <Button className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all gap-2 rounded-xl">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#preview">
              <Button variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto border-2 rounded-xl hover:bg-slate-100">
                See App Preview
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* 2. APP PREVIEW / IMAGE SCROLL SECTION */}
      <section id="preview" className="py-24 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">How UPHAR Works</h2>
              <p className="mt-4 text-slate-600 text-lg">A seamless experience for patients and doctors alike.</p>
            </div>

            {/* Image Row 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h3 className="text-3xl font-bold text-slate-900">Unified Health Dashboard</h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Get a complete overview of your medical journey. UPHAR brings all your lab reports, prescriptions, and consultation notes into one beautiful, easy-to-read timeline. No more carrying thick files to the clinic.
                    </p>
                    <ul className="space-y-3 text-slate-600">
                      <li className="flex items-center gap-3"><ShieldCheck className="text-primary w-5 h-5"/> Tamper-proof medical records</li>
                      <li className="flex items-center gap-3"><ShieldCheck className="text-primary w-5 h-5"/> Chronological timeline view</li>
                    </ul>
                </div>
                <div className="flex-1">
                    <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000" alt="Medical Dashboard on Laptop" className="rounded-2xl shadow-2xl border border-slate-200 object-cover aspect-video hover:scale-[1.02] transition-transform duration-500" />
                </div>
            </div>
            
            {/* Image Row 2 (Reversed) */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h3 className="text-3xl font-bold text-slate-900">Secure Doctor Access</h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      You are the boss of your data. Securely generate temporary access tokens for your doctor and revoke them the moment your consultation is over. You decide exactly what they can see.
                    </p>
                    <ul className="space-y-3 text-slate-600">
                      <li className="flex items-center gap-3"><ShieldCheck className="text-primary w-5 h-5"/> Time-limited access codes</li>
                      <li className="flex items-center gap-3"><ShieldCheck className="text-primary w-5 h-5"/> Complete audit log of who viewed your data</li>
                    </ul>
                </div>
                <div className="flex-1">
                    <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000" alt="Doctor reviewing tablet" className="rounded-2xl shadow-2xl border border-slate-200 object-cover aspect-[4/3] hover:scale-[1.02] transition-transform duration-500" />
                </div>
            </div>

            {/* Image Row 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h3 className="text-3xl font-bold text-slate-900">Life-Saving Emergency Profile</h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      In critical moments, first responders can scan your emergency QR code to instantly access life-saving information like your blood group, severe allergies, and emergency contacts.
                    </p>
                    <ul className="space-y-3 text-slate-600">
                      <li className="flex items-center gap-3"><ShieldCheck className="text-primary w-5 h-5"/> Instantly accessible via QR</li>
                      <li className="flex items-center gap-3"><ShieldCheck className="text-primary w-5 h-5"/> Highlights critical allergies & conditions</li>
                    </ul>
                </div>
                <div className="flex-1">
                    <img src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1000" alt="Emergency Medical Supplies" className="rounded-2xl shadow-2xl border border-slate-200 object-cover aspect-video hover:scale-[1.02] transition-transform duration-500" />
                </div>
            </div>

        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="px-4 py-24 sm:px-6 lg:px-8 bg-slate-50 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why choose UPHAR?</h2>
            <p className="mt-4 text-slate-600 text-lg">Everything you need to manage your healthcare journey in one place.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1 hover:border-primary/30 group">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
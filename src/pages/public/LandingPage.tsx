import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 text-center px-4">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Your Medical History. <br/>
          <span className="text-primary">Secure. Portable. Yours.</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          The Universal Patient Health Record Platform puts you in control. 
          Collect your records from hospitals, clinics, and labs. Share them securely with doctors using temporary access codes.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link to="/login">
            <Button className="h-12 px-8 text-base">Get Started</Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="ghost" className="h-12 px-8 text-base">Learn More</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
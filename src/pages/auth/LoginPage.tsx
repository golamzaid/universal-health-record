import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Activity, UserPlus, LogIn, Stethoscope, Building, User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';

type Role = 'patient' | 'doctor' | 'hospital';

export const LoginPage = () => {
  const [role, setRole] = useState<Role>('patient');
  
  // Common Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Patient Specific
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  
  // Doctor & Hospital Specific
  const [license, setLicense] = useState(''); 
  const [specialization, setSpecialization] = useState(''); 
  const [address, setAddress] = useState(''); 

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  // Reset role-specific fields when role or sign-up mode changes
  useEffect(() => {
    setName(''); setPhone(''); setDob(''); setGender(''); 
    setLicense(''); setSpecialization(''); setAddress('');
  }, [role, isSignUp]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Handle sign-up flow
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });

      if (error) {
        setMessage('Error: ' + error.message);
      } else {
        try {
          const payload = {
            name: name,
            email: email,
            role: role,
            phone: phone,
            dob: role === 'patient' ? dob : null,
            gender: role === 'patient' ? gender : null,
            license_number: role === 'doctor' || role === 'hospital' ? license : null,
            specialization: role === 'doctor' ? specialization : null,
            address: role === 'hospital' ? address : null
          };

          await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          setMessage('Account created successfully! You can now log in.');
          setIsSignUp(false);
        } catch (err) {
          console.error("FastAPI Sync Error:", err);
          setMessage('Account created, but failed to sync profile to Database.');
        }
      }
    } else {
      // Handle sign-in flow
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setMessage('Error: ' + error.message);
      } else {
        setMessage('Logged in successfully!');
        navigate(`/${role}/dashboard`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border p-8 space-y-6 transition-all duration-300 relative">
        
        {/* Navigation link back to home page */}
        <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-primary flex items-center gap-1.5 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        {/* Page title and branding section */}
        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-2xl mb-2">
            <Activity className="h-8 w-8" />
            <span>UPHAR</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
            {isSignUp ? <><UserPlus className="w-6 h-6 text-primary"/> Create Account</> : <><LogIn className="w-6 h-6 text-primary"/> Welcome Back</>}
          </h1>
          <p className="text-sm text-slate-500">
            {isSignUp ? 'Join UPHAR to manage medical records securely' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {/* Role selection tabs for user type */}
        <div className="flex p-1 bg-slate-100 rounded-lg">
          {(['patient', 'doctor', 'hospital'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-md capitalize transition-colors ${
                role === r ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r === 'patient' && <User className="w-4 h-4" />}
              {r === 'doctor' && <Stethoscope className="w-4 h-4" />}
              {r === 'hospital' && <Building className="w-4 h-4" />}
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Common fields for all user types: name and contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    {role === 'hospital' ? 'Hospital Name' : 'Full Name'}
                  </label>
                  <Input 
                    type="text" 
                    placeholder={role === 'doctor' ? "e.g. Dr. Sarah Smith" : (role === 'hospital' ? "e.g. City Hospital" : "e.g. Golam Zaid")}
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Contact Number</label>
                  <Input 
                    type="tel" 
                    placeholder="+91 9876543210" 
                    required={isSignUp}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Patient-specific fields: date of birth and gender */}
              {role === 'patient' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                    <Input type="date" required={isSignUp} value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Gender</label>
                    <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required={isSignUp} value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Doctor-specific fields: medical license and specialization */}
              {role === 'doctor' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Medical License No.</label>
                    <Input type="text" placeholder="e.g. MED-908234" required={isSignUp} value={license} onChange={(e) => setLicense(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Specialization</label>
                    <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required={isSignUp} value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                      <option value="" disabled>Select Specialization</option>
                      <option value="General Physician">General Physician</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Neurologist">Neurologist</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Hospital-specific fields: registration number and address */}
              {role === 'hospital' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Registration Number</label>
                    <Input type="text" placeholder="e.g. REG-2023-WB" required={isSignUp} value={license} onChange={(e) => setLicense(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Complete Address</label>
                    <Input type="text" placeholder="123 Health Ave, City" required={isSignUp} value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Email and password fields - required for both sign-up and sign-in */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {role === 'hospital' ? 'Admin Email address' : 'Email address'}
            </label>
            <Input 
              type="email" 
              placeholder={`demo@${role}.com`} 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700">Password</label>
              {!isSignUp && <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>}
            </div>
            <Input 
              type="password" 
              placeholder={isSignUp ? "Create a strong password (min 6 chars)" : "Enter your password"} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {/* Status message display for success or error feedback */}
          {message && (
            <div className={`text-sm p-3 rounded-lg border ${message.includes('Error') ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              {message}
            </div>
          )}

          {/* Submit button for authentication action */}
          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
            {loading ? 'Processing...' : (isSignUp ? `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}` : `Sign In`)}
          </Button>
        </form>

        {/* Toggle between sign-up and sign-in modes */}
        <div className="text-center text-sm text-slate-500 pt-2 border-t">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); setMessage(''); setPassword(''); }} 
            className="text-primary hover:underline font-semibold"
          >
            {isSignUp ? 'Log in here' : 'Sign up here'}
          </button>
        </div>
      </div>
    </div>
  );
};
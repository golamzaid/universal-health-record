import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Camera, ShieldCheck, Heart, CreditCard, Save } from 'lucide-react';
import { supabase } from '@/supabaseClient';

export const PatientSettings = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [upharId, setUpharId] = useState('');
  
  // Form States
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [abha, setAbha] = useState('');
  const [provider, setProvider] = useState('');
  const [policy, setPolicy] = useState('');

  // Load User Data
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const res = await fetch('http://127.0.0.1:8000/users/');
        const users = await res.json();
        const dbUser = users.find((u: any) => u.email === user.email);
        
        if (dbUser) {
          setUserId(dbUser.id);
          setUpharId(dbUser.uphar_id || 'Pending...');
          setName(dbUser.name);
          setFatherName(dbUser.father_name || '');
          setAadhaar(dbUser.aadhaar_number || '');
          setAbha(dbUser.abha_number || '');
          setProvider(dbUser.insurance_provider || '');
          setPolicy(dbUser.insurance_policy || '');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setLoading(true);
    try {
      const payload = {
        father_name: fatherName,
        aadhaar_number: aadhaar,
        abha_number: abha,
        insurance_provider: provider,
        insurance_policy: policy
      };

      const response = await fetch(`http://127.0.0.1:8000/users/${userId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal details, health IDs, and insurance.</p>
        
        {upharId !== 'Pending...' && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-lg border border-primary/20">
            Your UPHAR ID: {upharId}
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Photo Section (UI Only for now) */}
        <div className="bg-white p-6 border rounded-xl shadow-sm flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-slate-50">
            <Camera className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-medium">Upload</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Profile Photo</h3>
            <p className="text-sm text-slate-500 mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
            <Button type="button" variant="outline" size="sm">Choose Image</Button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 border-b pb-2 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <Input value={name} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Father's Name</label>
              <Input placeholder="Enter father's full name" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Government IDs */}
        <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Identity & Health Cards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Aadhaar Number (Optional)</label>
              <Input type="text" placeholder="Enter 12-digit Aadhaar Number" maxLength={12} value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Ayushman Bharat ID (ABHA)</label>
              <Input placeholder="Enter 14-digit ABHA Number" value={abha} onChange={(e) => setAbha(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Insurance Details */}
        <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" /> Health Insurance (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Insurance Provider</label>
              <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={provider} onChange={(e) => setProvider(e.target.value)}>
                <option value="">Select Provider...</option>
                <option value="Star Health">Star Health</option>
                <option value="HDFC Ergo">HDFC Ergo</option>
                <option value="ICICI Lombard">ICICI Lombard</option>
                <option value="Care Health">Care Health</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Policy Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="e.g. POL-902348" className="pl-9" value={policy} onChange={(e) => setPolicy(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" className="gap-2" disabled={loading}>
            <Save className="h-4 w-4" /> {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};
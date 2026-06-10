
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, AlertCircle, Zap } from 'lucide-react';
import { User } from '../types.ts';

interface AuthProps {
  onLogin: (user: User) => void;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'seed-user-1',
    name: 'Divya',
    email: 'fastfacts@gmail.com',
    password: '12345',
    role: 'sales'
  }
];

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const storedUsers: User[] = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const allUsers = [...DEFAULT_USERS, ...storedUsers];

      if (isLogin) {
        const user = allUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password);
        if (user) {
          const { password, ...safeUser } = user;
          localStorage.setItem('current_user', JSON.stringify(safeUser));
          onLogin(safeUser as User);
        } else {
          setError("Invalid credentials. Access denied.");
        }
      } else {
        const exists = allUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
        if (exists) {
          setError("Identity already registered.");
        } else {
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'sales'
          };
          storedUsers.push(newUser);
          localStorage.setItem('registered_users', JSON.stringify(storedUsers));
          const { password, ...safeUser } = newUser;
          localStorage.setItem('current_user', JSON.stringify(safeUser));
          onLogin(safeUser as User);
        }
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-inter">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-200/40 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-200/40 blur-[150px] rounded-full"></div>
      
      <div className="w-full max-w-md bg-white border border-slate-200 p-12 rounded-[3rem] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="mb-8 flex flex-col items-center">
            <div className="flex items-center gap-0 leading-none">
              <span className="font-black text-4xl tracking-tighter text-[#EA580C]">FAST</span>
              <span className="font-black text-4xl tracking-tighter text-[#EA580C]">/</span>
              <span className="font-black text-4xl tracking-tighter text-black"> FACTS</span>
            </div>
            <div className="text-xs font-bold tracking-[0.2em] mt-2 leading-none">
              <span className="text-black uppercase">Powered by </span>
              <span className="text-[#EA580C] uppercase">Newgen</span>
            </div>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Neural Command Center v3.1</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Operator Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="Arjun Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 outline-none focus:ring-2 focus:ring-[#EA580C] transition-all font-bold"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Corporate ID</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                type="email" 
                placeholder="fastfacts@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 outline-none focus:ring-2 focus:ring-[#EA580C] transition-all font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Passkey</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                required
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 outline-none focus:ring-2 focus:ring-[#EA580C] transition-all font-bold"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#EA580C] hover:bg-orange-700 disabled:bg-slate-300 text-white font-black py-5 rounded-3xl transition-all flex items-center justify-center gap-3 group shadow-xl shadow-orange-600/20 active:scale-95"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="uppercase tracking-widest text-xs">{isLogin ? 'Initiate Node Sync' : 'Provision Identity'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-[10px] font-black text-slate-400 hover:text-[#EA580C] uppercase tracking-widest transition-colors"
          >
            {isLogin ? "Provision new access node?" : "Return to secure gateway"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

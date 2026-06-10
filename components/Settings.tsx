
import React from 'react';
import { Key, Shield, Save, CheckCircle2 } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900">System Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Configure your API connections and security protocols.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="p-3 bg-orange-600 rounded-2xl shadow-lg shadow-orange-900/20">
                <Key className="text-white" size={24} />
            </div>
            <div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">API Integrations</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Manage credentials for external data providers</p>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Apollo.io API Key', placeholder: 'ap-xxxxxxxxxxxxxxxx' },
                { label: 'LinkedIn Session Cookie', placeholder: 'li_at=xxxxxxxxxxxxxxx' },
                { label: 'Serper Search API', placeholder: 'serp-xxxxxxxxxxxxxxx' },
                { label: 'Gemini (Google AI) API', placeholder: 'ai-xxxxxxxxxxxxxxxx' }
              ].map((input, idx) => (
                <div key={idx} className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex justify-between">
                        {input.label}
                        <CheckCircle2 size={14} className="text-emerald-500" />
                    </label>
                    <input 
                    type="password" 
                    placeholder={input.placeholder}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-orange-600 text-slate-900 font-mono text-sm transition-all"
                    />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-900/10">
                <Shield className="text-white" size={24} />
            </div>
            <div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Security & MFA</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Protect your workspace with enterprise authentication</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-orange-200 transition-all">
              <div>
                <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                <p className="text-sm text-slate-500 font-medium">Secure your account with TOTP (Google Authenticator).</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <div className="w-12 h-6 bg-orange-600 rounded-full shadow-inner"></div>
                <div className="absolute left-6 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-orange-200 transition-all">
              <div>
                <h4 className="font-bold text-slate-900">IP Whitelisting</h4>
                <p className="text-sm text-slate-500 font-medium">Restricts access to specified IP ranges only.</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <div className="w-12 h-6 bg-slate-200 rounded-full shadow-inner"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4">
          <button className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-black transition-all shadow-sm">
            Discard Changes
          </button>
          <button className="flex items-center gap-2 px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-orange-900/20 transform active:scale-95">
            <Save size={20} strokeWidth={3} />
            Commit Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

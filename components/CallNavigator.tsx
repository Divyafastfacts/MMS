
import React, { useState } from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  ShieldAlert, 
  ChevronDown, 
  ChevronRight, 
  Save, 
  Quote, 
  Zap, 
  Users, 
  Landmark,
  UserCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

type Persona = 'Finance' | 'HR';
type Tone = 'Formal' | 'Conversational';

interface PainPoint {
  title: string;
  description: string;
  deepDive: string;
}

const CallNavigator: React.FC = () => {
  const [persona, setPersona] = useState<Persona>('Finance');
  const [tone, setTone] = useState<Tone>('Formal');
  const [expandedPainPoints, setExpandedPainPoints] = useState<string[]>([]);
  const [callNotes, setCallNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const togglePainPoint = (title: string) => {
    setExpandedPainPoints(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const handleSaveNotes = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Call notes synced to CRM successfully.");
    }, 1200);
  };

  const financePainPoints: PainPoint[] = [
    { 
      title: "CARO Compliance", 
      description: "Asset registers often fail audit checks for CARO 2020.",
      deepDive: "Fast-Facts FAMS provides a 100% compliant Fixed Asset Register (FAR) that meets every CARO requirement, specifically regarding physical verification and depreciation mapping."
    },
    { 
      title: "TDS Reconciliation", 
      description: "Huge mismatches between 26AS and internal books.",
      deepDive: "Our eTDS module automatically reconciles TRACES data with your ERP data in seconds, flagging potential notices before they arrive."
    },
    { 
      title: "Asset Depreciation Mismatches", 
      description: "Companies Act vs Income Tax Act discrepancies.",
      deepDive: "We automate dual-depreciation calculation, ensuring zero manual intervention and accurate deferred tax liability reporting."
    }
  ];

  const hrPainPoints: PainPoint[] = [
    { 
      title: "Biometric Integration", 
      description: "Manual errors during attendance to payroll export.",
      deepDive: "Our solution syncs directly with multiple biometric hardware vendors to push sanitized attendance data straight into the payroll compliance engine."
    },
    { 
      title: "TDS on Salary", 
      description: "Incorrect investment declaration processing leads to employee friction.",
      deepDive: "We provide an employee self-service portal for investment proof uploads with automated validation based on the latest tax slabs."
    },
    { 
      title: "Statutory Reporting Speed", 
      description: "Filling PF/ESI/TDS returns takes days of manual consolidation.",
      deepDive: "Generate one-click challans and return files for all major statutory bodies, reducing your month-end cycle by up to 4 days."
    }
  ];

  const objections = [
    { q: "We already have an ERP (SAP/Oracle)", a: "Most ERPs are generic. Fast-Facts acts as a 'last-mile' compliance layer that bridges the gaps generic ERPs leave behind in specialized Indian tax laws." },
    { q: "Not looking to switch right now", a: "That's exactly why I'm calling. This isn't a migration, it's an optimization. We can plug into your current system without disruption." },
    { q: "Our manual process is working fine", a: "It's working until an audit happens or a notice arrives. We provide the 'Audit Insurance' your team needs to stay stress-free." }
  ];

  const getScript = () => {
    if (persona === 'Finance') {
      return tone === 'Formal' 
        ? "Good morning, [Name]. This is Priti Tiwari from Fast-Facts, a subsidiary of Newgen Digital Works. Do you have two minutes to discuss how we’re helping finance teams streamline their tax and asset compliance? We’ve spent 24 years perfecting solutions for Fixed Assets and TDS Management. Specifically, we automate depreciation for CARO compliance and solve the headache of physical asset tracking via a mobile app—essentially eliminating the need for manual third-party verification."
        : "Hi [Name]! Priti Tiwari here from Fast-Facts (Newgen). Hope you're having a good day. Just wanted to see if you have a quick minute? We've been working with finance heads to automate CARO compliance and physical asset tracking using a mobile app. It's saving teams a ton of time on third-party verifications. Out of curiosity, how is your team currently handling physical asset verification or TDS mismatches?";
    } else {
      return tone === 'Formal'
        ? "Good morning, [Name]. My name is Priti Tiwari from Fast-Facts (Newgen Digital Works). I’m calling to see if you have two minutes to discuss a way to simplify your payroll and employee self-service? We offer a web-based payroll solution that automates PF and Salary TDS. The highlight is our mobile app, which allows employees to upload documents and download payslips directly. It also integrates seamlessly with your existing biometric systems to ensure data accuracy."
        : "Hello [Name], Priti from Fast-Facts here. I'm checking in to see if you have a moment to talk about simplifying your payroll cycle? We've got a web-based setup that automates PF and Salary TDS, plus an app where employees can grab their payslips and upload docs. It even syncs with your biometric gear. Are you currently using an integrated mobile solution for your employee payroll, or is it still a manual process?";
    }
  };

  const activePainPoints = persona === 'Finance' ? financePainPoints : hrPainPoints;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <PhoneCall className="text-orange-600" size={32} />
            Sales Call Navigator
          </h1>
          <p className="text-slate-500 font-medium mt-1">Strategic live-call guidance and dynamic persona-based scripts.</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
          <button
            onClick={() => setPersona('Finance')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              persona === 'Finance' 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Landmark size={14} /> Finance
          </button>
          <button
            onClick={() => setPersona('HR')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              persona === 'HR' 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users size={14} /> HR
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Script Area */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <span className="text-slate-900 font-black text-xs uppercase tracking-[0.2em]">Live Call Script</span>
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${persona === 'Finance' ? 'bg-orange-600' : 'bg-blue-600'}`}></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{persona} Focus</span>
                </div>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setTone('Formal')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    tone === 'Formal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Formal
                </button>
                <button
                  onClick={() => setTone('Conversational')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    tone === 'Conversational' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  Conversational
                </button>
              </div>
            </div>

            <div className="p-10">
              <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl relative">
                <Quote className="absolute -top-4 -left-2 text-orange-600/10" size={64} />
                <p className="text-xl text-slate-800 leading-relaxed font-medium italic relative z-10">
                  {getScript()}
                </p>
              </div>

              <div className="mt-10 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Zap size={14} className="text-orange-600" /> Clickable Pain Points
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activePainPoints.map((pp) => {
                    const isExpanded = expandedPainPoints.includes(pp.title);
                    return (
                      <button
                        key={pp.title}
                        onClick={() => togglePainPoint(pp.title)}
                        className={`text-left p-5 rounded-2xl border transition-all ${
                          isExpanded 
                            ? 'bg-orange-50 border-orange-200 shadow-md ring-1 ring-orange-200' 
                            : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className={`font-bold text-sm ${isExpanded ? 'text-orange-900' : 'text-slate-900'}`}>
                            {pp.title}
                          </h5>
                          {isExpanded ? <ChevronDown size={16} className="text-orange-600" /> : <ChevronRight size={16} className="text-slate-400" />}
                        </div>
                        <p className={`text-xs ${isExpanded ? 'text-orange-700/80' : 'text-slate-500'} font-medium`}>
                          {pp.description}
                        </p>
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-orange-100 animate-in slide-in-from-top-2">
                            <p className="text-xs font-bold text-orange-900 leading-relaxed italic">
                              "{pp.deepDive}"
                            </p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CRM Notes Integration */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <MessageCircle size={18} className="text-orange-600" /> Call Highlights & CRM Sync
              </h3>
              <div className="flex items-center gap-1">
                 <CheckCircle2 size={14} className="text-emerald-500" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client: RIL Group</span>
              </div>
            </div>
            <textarea
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="Start typing call notes here... (e.g., Prospect interested in demo next Tuesday, mentioned dissatisfaction with current SAP FAR module)"
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-600 text-slate-700 font-medium transition-all"
            />
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                {isSaving ? <Save className="animate-spin" size={16} /> : <Save size={16} />}
                {isSaving ? 'Syncing...' : 'Sync to CRM Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Objection Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <ShieldAlert size={16} className="text-orange-600" /> Objection Library
            </h3>
            
            <div className="space-y-4">
              {objections.map((obj, i) => (
                <div key={i} className="group">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-orange-50 group-hover:border-orange-100 transition-all">
                    <p className="text-[11px] font-black text-slate-900 mb-2">{obj.q}</p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed group-hover:text-orange-800 transition-colors">
                      {obj.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
               <div className="bg-amber-50 p-4 rounded-xl flex items-start gap-3">
                  <Info className="text-amber-600 shrink-0" size={16} />
                  <p className="text-[10px] font-bold text-amber-700 leading-normal">
                    Pro-tip: Don't argue. Use the "Feel, Felt, Found" method to lower prospect defenses.
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-orange-600 p-6 rounded-3xl text-white shadow-xl shadow-orange-900/20">
            <h4 className="font-black uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
              <UserCheck size={14} /> Quick Prospect Audit
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium opacity-80">Last Contact</span>
                <span className="font-black">12 Days Ago</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium opacity-80">Tech Stack</span>
                <span className="font-black">SAP S/4HANA</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium opacity-80">Risk Level</span>
                <span className="bg-white text-orange-600 px-2 py-0.5 rounded font-black">HIGH (Audit Due)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallNavigator;

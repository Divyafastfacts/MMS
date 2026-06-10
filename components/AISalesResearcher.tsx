
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Loader2, 
  Zap, 
  Building2, 
  ExternalLink, 
  Linkedin, 
  Link as LinkIcon,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  UserCheck,
  Monitor,
  Rocket,
  Shield,
  Compass,
  CheckCircle,
  Cpu,
  Layers,
  BarChart3,
  ChevronDown,
  LayoutGrid,
  ZapIcon,
  Database,
  Lock,
  AlertTriangle,
  AtSign,
  Target,
  Palette,
  TrendingUp,
  ShoppingCart,
  FlaskConical,
  Scale,
  BrainCircuit,
  Settings2,
  Users,
  Info,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { researchCompanyLeads } from '../services/geminiService.ts';
import { Lead, CompanyInfo } from '../types.ts';

const DEPARTMENT_PERSONA_DATA = [
  { id: "Marketing", personas: ["CMO", "VP Marketing", "Marketing Director", "Brand Head", "Head of Digital Marketing", "Comm Director", "PR Head"] },
  { id: "Digital/Growth", personas: ["CDO", "Head of Growth", "Performance Marketing Lead", "Digital Head", "Growth Architect", "Retention Lead"] },
  { id: "Creative/Content", personas: ["Creative Director", "Head of Content", "Design Lead", "Brand Content Strategist", "UX/UI Director"] },
  { id: "IT & Technology", personas: ["CTO", "CIO", "VP Engineering", "Infrastructure Head", "IT Director", "Systems Architect", "Head of IT Ops"] },
  { id: "Product", personas: ["CPO", "Head of Product", "Product Director", "VP Product", "Group Product Manager", "Mobile Product Head"] },
  { id: "Innovation/AI", personas: ["Chief AI Officer (CAIO)", "Head of AI", "Innovation Director", "R&D Head", "Applied AI Lead", "ML Strategist"] },
  { id: "Sales/Revenue", personas: ["CRO (Chief Revenue Officer)", "VP Sales", "Head of Revenue", "GTM Strategy Lead", "Sales Ops Director"] },
  { id: "E-commerce", personas: ["Head of E-commerce", "Digital Retail Director", "Marketplace Lead", "Online Sales Head"] },
  { id: "Operations", personas: ["COO", "Head of Operations", "Process Excellence Lead", "Operational Transformation Director", "Lean Six Sigma Head"] },
  { id: "Corporate Strategy", personas: ["CSO (Chief Strategy Officer)", "Head of Strategy", "VP Corporate Development", "Strategic Planning Director"] },
  { id: "Innovation Lab", personas: ["Lab Director", "Venture Studio Lead", "Intrapreneurship Head", "Innovation Catalyst"] },
  { id: "Digital Transformation", personas: ["Transformation Lead", "Digital Catalyst", "Modernization Director", "Change Management Lead"] },
  { id: "Data Science / AI", personas: ["Chief Data Officer", "Head of Data Science", "Analytics Director", "Lead Data Scientist", "BI Director"] },
  { id: "Information Security", personas: ["CISO", "VP Information Security", "Cybersecurity Director", "Security Architect"] },
  { id: "Data Privacy / Legal", personas: ["DPO (Data Privacy Officer)", "Privacy Counsel", "General Counsel", "Compliance Head", "Legal Operations"] },
  { id: "Risk Management", personas: ["Chief Risk Officer (CRO)", "Risk Management Head", "Internal Audit Director", "IT Risk Manager"] }
];

interface AISalesResearcherProps {
  onSelectLeadForEmail: (lead: Lead) => void;
  onSelectLeadForLinkedIn?: (lead: Lead) => void;
  onToggleContact?: (lead: Lead) => void;
  savedContactIds?: string[];
  onSearchSuccess?: (companyInfo: CompanyInfo, leads: Lead[]) => void;
  externalQuery?: string | null;
  clearExternalQuery?: () => void;
  initialResults?: Lead[];
  initialCompanyInfo?: CompanyInfo | null;
}

const AISalesResearcher: React.FC<AISalesResearcherProps> = ({ 
  onSelectLeadForEmail, 
  onSelectLeadForLinkedIn,
  onToggleContact,
  savedContactIds = [],
  onSearchSuccess,
  externalQuery,
  clearExternalQuery,
  initialResults = [],
  initialCompanyInfo = null
}) => {
  const [company, setCompany] = useState('');
  const [selectedReferenceDept, setSelectedReferenceDept] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Lead[]>(initialResults);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(initialCompanyInfo);
  const [progress, setProgress] = useState(0);
  const [researchStep, setResearchStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (externalQuery) {
      performSearch(externalQuery);
      clearExternalQuery?.();
    }
  }, [externalQuery]);

  const handleLeadIdentitySearch = (lead: Lead) => {
    const googleQuery = encodeURIComponent(`"${lead.name}" "${lead.title}" "${lead.company}"`);
    const linkedinQuery = encodeURIComponent(`"${lead.name}" "${lead.title}" "${lead.company}"`);
    window.open(`https://www.google.com/search?q=${googleQuery}`, '_blank');
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${linkedinQuery}`, '_blank');
  };

  const performSearch = async (targetCompany: string) => {
    if (!targetCompany || isSearching) return;
    setIsSearching(true);
    setProgress(0);
    setResults([]);
    setCompanyInfo(null);
    setCompany(targetCompany);
    setError(null);

    const steps = [
      "Anchoring Official Domain...",
      "Mapping 16 Strategic Cluster Nodes...",
      "Executing Multi-Source Intelligence Sweep...",
      "Resolving Global Decision Maker Identities...",
      "Applying Boolean Integrity Filters...",
      "Finalizing 100% Precision Audit..."
    ];

    try {
      let currentStep = 0;
      const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
          setResearchStep(steps[currentStep]);
          setProgress(Math.min(95, Math.floor(((currentStep + 1) / steps.length) * 100)));
          currentStep++;
        }
      }, 1200);

      const data = await researchCompanyLeads(targetCompany);
      clearInterval(progressInterval);
      setProgress(100);
      setResults(data.leads);
      setCompanyInfo(data.companyInfo);
      if (data.companyInfo.name) {
        onSearchSuccess?.(data.companyInfo, data.leads);
      }
    } catch (err: any) {
      setError(err?.message || "Audit interrupted. The research node requires reset.");
    } finally {
      setIsSearching(false);
    }
  };

  const filteredLeadsForSidebar = useMemo(() => {
    if (!selectedReferenceDept || !results.length) return [];
    return results.filter(lead => 
      lead.department?.toLowerCase().includes(selectedReferenceDept.toLowerCase()) ||
      selectedReferenceDept.toLowerCase().includes(lead.department?.toLowerCase() || '')
    );
  }, [selectedReferenceDept, results]);

  const getDeptIcon = (dept?: string) => {
    const d = dept?.toUpperCase() || '';
    if (d.includes('MARKETING')) return <Rocket size={14} className="text-pink-600" />;
    if (d.includes('DIGITAL')) return <ZapIcon size={14} className="text-orange-600" />;
    if (d.includes('STRATEGY')) return <Compass size={14} className="text-indigo-600" />;
    if (d.includes('OPERATIONS')) return <BarChart3 size={14} className="text-emerald-600" />;
    if (d.includes('TECH') || d.includes('IT')) return <Cpu size={14} className="text-blue-600" />;
    if (d.includes('PRODUCT')) return <Layers size={14} className="text-orange-600" />;
    if (d.includes('SECURITY')) return <Shield size={14} className="text-rose-600" />;
    if (d.includes('DATA')) return <Database size={14} className="text-violet-600" />;
    if (d.includes('LEGAL') || d.includes('PRIVACY')) return <Lock size={14} className="text-slate-600" />;
    if (d.includes('RISK')) return <AlertTriangle size={14} className="text-amber-600" />;
    return <CheckCircle size={14} className="text-slate-400" />;
  };

  const currentReference = DEPARTMENT_PERSONA_DATA.find(d => d.id === selectedReferenceDept);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-1.5 h-4 bg-[#EA580C] rounded-full"></div>
             <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Global Intelligence Audit Node</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Persona Researcher</h1>
          <p className="text-slate-500 font-medium mt-1">High-Precision Stakeholder Extraction across 16 strategic clusters.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Boolean Integrity Active</span>
          </div>
        </div>
      </header>

      {/* Primary Search Interface */}
      <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <form onSubmit={(e) => { e.preventDefault(); performSearch(company); }} className="flex flex-col lg:flex-row gap-4 relative z-10">
          <div className="relative flex-[4]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter Precise Corporate Entity (e.g., Raymond Ltd)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-6 pl-14 pr-4 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-600 outline-none transition-all text-slate-900 font-black text-xl placeholder:text-slate-300"
            />
          </div>
          <button 
            disabled={isSearching}
            className="bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white px-12 py-6 rounded-2xl font-black shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 active:scale-95 flex-1"
          >
            {isSearching ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} className="text-[#EA580C]" />}
            {isSearching ? 'Mapping 16 Nodes...' : 'Execute Audit'}
          </button>
        </form>

        {isSearching && (
          <div className="mt-10 space-y-5 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-end px-2">
              <span className="text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
                {researchStep}
              </span>
              <span className="text-orange-600 font-black text-2xl tabular-nums">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200 shadow-inner">
              <div 
                className="bg-gradient-to-r from-orange-600 to-[#EA580C] h-full transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Strategic Designation Reference Dropdown */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
             <LayoutGrid className="text-orange-600" size={20} />
             <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Departmental Persona Guide</span>
          </div>
          
          <div className="relative flex-1">
            <select 
              value={selectedReferenceDept}
              onChange={(e) => setSelectedReferenceDept(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-4 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-600 appearance-none outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all"
            >
              <option value="">Select Department to view Designations...</option>
              {DEPARTMENT_PERSONA_DATA.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.id}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 italic">
             <Info size={14} />
             Search pulls from all 16 departments automatically.
          </div>
        </div>

        {selectedReferenceDept && currentReference && (
          <div className="mt-6 p-6 bg-white border border-slate-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
             <div className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em] mb-4">Targeted designations for {selectedReferenceDept}:</div>
             <div className="flex flex-wrap gap-2">
                {currentReference.personas.map((p, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-700">
                    {p}
                  </span>
                ))}
             </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-start gap-4 text-rose-600 animate-in slide-in-from-top-4">
          <ShieldAlert size={24} className="shrink-0 mt-1" />
          <div>
            <h4 className="font-black uppercase text-xs tracking-widest mb-1">Intelligence Error</h4>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Results Workspace */}
      {companyInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-2 space-y-10">
            {/* Entity Header */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
                  <Building2 size={40} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{companyInfo.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-widest">
                      <AtSign size={14} /> {companyInfo.domain || 'Verified Domain'}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><Monitor size={16} className="text-blue-600" /> {companyInfo.industry}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] shadow-inner">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Neural Entity Profile</h3>
                 </div>
                 <p className="text-slate-700 leading-relaxed font-medium text-lg whitespace-pre-wrap italic">
                   {companyInfo.summary}
                 </p>
              </div>
            </div>

            {/* Global Table */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
               <div className="px-10 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                   <Users size={18} className="text-slate-900" /> Global Stakeholder Audit Results
                 </h3>
                 <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-slate-900 border border-slate-200">{results.length} Identity Hits</span>
               </div>
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-10 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Stakeholder</th>
                      <th className="px-10 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest">Department Node</th>
                      <th className="px-10 py-5 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Cadence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {results.map((lead) => {
                      const isSaved = savedContactIds.includes(lead.id);
                      return (
                        <tr key={lead.id} className="hover:bg-orange-50/30 transition-colors group">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => onToggleContact?.(lead)}
                                className={`p-2 rounded-xl transition-all ${isSaved ? 'text-orange-600 bg-orange-50' : 'text-slate-300 hover:text-orange-400'}`}
                              >
                                {isSaved ? <UserCheck size={20} /> : <UserPlus size={20} />}
                              </button>
                              <div className="flex items-center gap-5 cursor-pointer group/name" onClick={() => handleLeadIdentitySearch(lead)}>
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg uppercase">
                                  {lead.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="font-black text-slate-900 text-lg tracking-tight group-hover/name:text-orange-600 transition-all">
                                    {lead.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{lead.title}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-2">
                               <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 bg-white shadow-sm ring-1 ring-slate-100`}>
                                 {getDeptIcon(lead.department)}
                                 <span className="text-[10px] font-black uppercase text-slate-900 tracking-tight">{lead.department}</span>
                               </div>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex justify-end gap-3">
                               <button onClick={() => onSelectLeadForLinkedIn?.(lead)} className="p-3 text-slate-400 hover:text-[#0077b5] transition-all"><Linkedin size={18} /></button>
                               <button onClick={() => onSelectLeadForEmail(lead)} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-orange-600 transition-all uppercase tracking-widest shadow-md">Outreach</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Targeted Sidebar (Personas View) */}
          <div className="space-y-10">
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm h-fit">
               {selectedReferenceDept ? (
                 <div className="animate-in fade-in duration-500">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        {getDeptIcon(selectedReferenceDept)} {selectedReferenceDept} Cluster
                      </h3>
                      <span className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[9px] font-black">{filteredLeadsForSidebar.length} Hits</span>
                    </div>
                    
                    {filteredLeadsForSidebar.length > 0 ? (
                      <div className="space-y-4">
                        {filteredLeadsForSidebar.map((lead) => (
                          <div key={lead.id} className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:border-orange-200 transition-all group shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                               <div className="text-[9px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1.5">
                                 <ShieldCheck size={12} /> Grounded Identity
                               </div>
                               <button onClick={() => handleLeadIdentitySearch(lead)} className="text-slate-400 hover:text-orange-600 transition-colors">
                                 <ExternalLink size={14} />
                               </button>
                            </div>
                            <div className="font-black text-slate-900 text-sm mb-1">{lead.name}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase leading-tight mb-4">{lead.title}</div>
                            
                            <div className="flex gap-2 pt-4 border-t border-slate-200/50">
                               <button onClick={() => onSelectLeadForEmail(lead)} className="flex-1 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-orange-600 hover:text-orange-600 transition-all">Mail</button>
                               <button onClick={() => onSelectLeadForLinkedIn?.(lead)} className="flex-1 py-2 bg-white border border-slate-200 text-[#0077b5] rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-[#0077b5] transition-all">Connect</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                          <Fingerprint size={32} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No stakeholders found in this cluster node yet.</p>
                      </div>
                    )}
                 </div>
               ) : (
                 <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-8">
                      <ZapIcon size={20} className="text-orange-600" /> Cluster Navigation
                    </h3>
                    <div className="p-10 text-center space-y-4 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                       <Compass className="w-12 h-12 text-slate-300 mx-auto" />
                       <p className="text-[10px] font-black text-slate-400 uppercase leading-relaxed tracking-widest">
                         Select a department node in the guide to filter results into this deep-dive view.
                       </p>
                    </div>
                 </div>
               )}
            </div>

            {/* Evidence Logs always visible below personas or as a toggle */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm h-fit">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-8">
                 <LinkIcon size={20} className="text-orange-600" /> Evidence Logs
               </h3>
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                 {companyInfo.groundingSources?.map((source, i) => (
                   <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:border-orange-200 transition-all group shadow-sm">
                     <div className="mt-1 p-2 bg-white rounded-lg group-hover:bg-orange-50"><ExternalLink size={14} className="text-slate-400 group-hover:text-orange-600" /></div>
                     <div className="flex-1 min-w-0">
                       <div className="text-[10px] font-black text-slate-900 truncate mb-1">{source.title}</div>
                       <div className="text-[8px] text-slate-400 truncate font-mono">{source.uri}</div>
                     </div>
                   </a>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISalesResearcher;

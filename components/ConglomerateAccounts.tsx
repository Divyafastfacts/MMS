
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Globe, 
  Briefcase, 
  Landmark, 
  Search, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  History, 
  Linkedin, 
  Star, 
  ArrowLeft,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Info,
  UserPlus
} from 'lucide-react';
import { SavedAccount, Lead } from '../types.ts';
import { scrubLeadContact } from '../services/geminiService.ts';

interface ConglomerateAccountsProps {
  accounts: SavedAccount[];
  onViewAccount: (companyName: string) => void;
  onSelectLeadForEmail: (lead: Lead) => void;
  onSelectLeadForLinkedIn?: (lead: Lead) => void;
  onToggleContact?: (lead: Lead) => void;
  savedContactIds?: string[];
  onUpdateAccounts?: (updatedAccounts: SavedAccount[]) => void;
  externalQuery?: string | null;
  clearExternalQuery?: () => void;
}

const ConglomerateAccounts: React.FC<ConglomerateAccountsProps> = ({ 
  accounts, 
  onViewAccount, 
  onSelectLeadForEmail, 
  onSelectLeadForLinkedIn,
  onToggleContact,
  savedContactIds = [],
  onUpdateAccounts,
  externalQuery,
  clearExternalQuery
}) => {
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [scrubbingLeads, setScrubbingLeads] = useState<Record<string, boolean>>({});
  const [scrubError, setScrubError] = useState<string | null>(null);

  // Auto-expand and scroll to the account if passed via dashboard
  useEffect(() => {
    if (externalQuery) {
      const match = accounts.find(acc => acc.companyInfo.name.toLowerCase().includes(externalQuery.toLowerCase()));
      if (match) {
        setExpandedAccountId(match.companyInfo.name);
        // Clean up the query after processing
        setTimeout(() => clearExternalQuery?.(), 100);
      }
    }
  }, [externalQuery, accounts]);

  const toggleExpand = (id: string) => {
    setExpandedAccountId(expandedAccountId === id ? null : id);
  };

  const handleScrubLead = async (lead: Lead, account: SavedAccount) => {
    if (scrubbingLeads[lead.id]) return;
    
    setScrubbingLeads(prev => ({ ...prev, [lead.id]: true }));
    setScrubError(null);

    try {
      const enriched = await scrubLeadContact(lead, account.companyInfo.name);
      
      if (onUpdateAccounts) {
        const updatedAccounts = accounts.map(acc => {
          if (acc.companyInfo.name === account.companyInfo.name) {
            return {
              ...acc,
              leads: acc.leads.map(l => l.id === lead.id ? { 
                ...l, 
                email: enriched.email || l.email, 
                phone: enriched.phone || l.phone,
                isEnriched: true,
                // Fix: added 'as const' to prevent string widening from 'grounded_fact' to string
                verificationStatus: 'grounded_fact' as const,
                confidenceScore: enriched.email ? 10 : l.confidenceScore
              } : l)
            };
          }
          return acc;
        });
        onUpdateAccounts(updatedAccounts);
      }
    } catch (err) {
      console.error("Scrub error", err);
      setScrubError(`Failed to scrub details for ${lead.name}.`);
      setTimeout(() => setScrubError(null), 4000);
    } finally {
      setScrubbingLeads(prev => ({ ...prev, [lead.id]: false }));
    }
  };

  const handleLeadIdentitySearch = (lead: Lead) => {
    const googleQuery = encodeURIComponent(`"${lead.name}" "${lead.title}" "${lead.company}"`);
    const linkedinQuery = encodeURIComponent(`"${lead.name}" "${lead.title}" "${lead.company}"`);
    
    window.open(`https://www.google.com/search?q=${googleQuery}`, '_blank');
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${linkedinQuery}`, '_blank');
  };

  const handleCompanyIdentitySearch = (companyName: string) => {
    const query = encodeURIComponent(`${companyName} India latest results`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-6 bg-orange-600 rounded-full"></div>
             <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Grounded Intelligence Storage</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Conglomerate Accounts</h1>
          <p className="text-slate-500 font-medium">Archived leadership hierarchies across your key targets.</p>
        </div>
        <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl border-b-4 border-orange-600 flex items-center gap-3 shadow-md">
          <History size={18} className="text-orange-600" />
          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{accounts.length} Entities Audited</span>
        </div>
      </header>

      <div className="space-y-6">
        {accounts.map((account, idx) => {
          const isExpanded = expandedAccountId === account.companyInfo.name;
          return (
            <div key={idx} className={`bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden transition-all duration-300 shadow-sm ${isExpanded ? 'ring-2 ring-orange-600 shadow-2xl' : 'hover:shadow-lg hover:border-orange-200'}`}>
              <div className="p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-center gap-6 flex-1">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors border shadow-sm ${isExpanded ? 'bg-orange-600 text-white border-transparent' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    <Building2 size={36} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 
                        onClick={() => handleCompanyIdentitySearch(account.companyInfo.name)}
                        className="text-2xl font-black text-slate-900 tracking-tight cursor-pointer hover:text-orange-600 transition-colors"
                      >
                        {account.companyInfo.name}
                      </h2>
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-orange-100">{account.companyInfo.industry}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><Globe size={16} className="text-orange-600" /> {account.companyInfo.headquarters}</span>
                      <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><Landmark size={16} className="text-emerald-500" /> {account.companyInfo.turnover}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleExpand(account.companyInfo.name)} className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${isExpanded ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-600 hover:text-orange-600'}`}>
                    {isExpanded ? <>Close Report <ChevronUp size={18} /></> : <>Hierarchy Audit <ChevronDown size={18} /></>}
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-slate-100 bg-white animate-in slide-in-from-top-4 duration-500">
                  <div className="p-10 space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><div className="w-1.5 h-4 bg-orange-600 rounded-full"></div> Audit Summary</h3>
                        <p className="text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm relative whitespace-pre-wrap italic">
                           {account.companyInfo.summary}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center px-1">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3"><div className="w-1.5 h-4 bg-slate-900 rounded-full"></div> Target Stakeholders</h3>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Executive</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification</th>
                              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cadence</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {account.leads.map((lead) => {
                              const isSaved = savedContactIds.includes(lead.id);
                              return (
                                <tr key={lead.id} className="hover:bg-orange-50/20 transition-colors group">
                                  <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                      <button 
                                        onClick={() => onToggleContact?.(lead)}
                                        className={`p-2 rounded-xl transition-all ${isSaved ? 'text-orange-600 bg-orange-50' : 'text-slate-300 hover:text-orange-400'}`}
                                      >
                                        <UserPlus size={18} fill={isSaved ? "currentColor" : "none"} />
                                      </button>
                                      <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black">
                                        {lead.name.split(' ').map(n => n[0]).join('')}
                                      </div>
                                      <div>
                                        <div 
                                          onClick={() => handleLeadIdentitySearch(lead)}
                                          className="font-black text-slate-900 text-lg flex items-center gap-2 group-hover:text-orange-600 transition-colors cursor-pointer hover:underline decoration-orange-200 underline-offset-4"
                                          title="Audit: Google + LinkedIn Search"
                                        >
                                          {lead.name}
                                          {lead.relevanceScore >= 9 && <div className="p-0.5 bg-orange-600 rounded shadow-sm text-white"><Star size={12} fill="currentColor" /></div>}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{lead.title}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1.5 w-32">
                                       <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                         <span className={lead.confidenceScore && lead.confidenceScore > 7 ? 'text-emerald-600' : 'text-amber-600'}>
                                           {lead.confidenceScore || 5}/10 Score
                                         </span>
                                       </div>
                                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                         <div 
                                           className={`h-full transition-all duration-700 ${lead.confidenceScore && lead.confidenceScore > 7 ? 'bg-emerald-500' : 'bg-orange-600'}`}
                                           style={{ width: `${(lead.confidenceScore || 5) * 10}%` }}
                                         />
                                       </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-3 items-center">
                                      <button onClick={() => onSelectLeadForLinkedIn?.(lead)} className="p-3 text-slate-400 hover:text-[#0077b5] hover:bg-white rounded-xl transition-all border border-transparent hover:border-[#0077b5]/30 shadow-sm" title="Direct Search on LinkedIn"><Linkedin size={18} /></button>
                                      <button onClick={() => onSelectLeadForEmail(lead)} className="ml-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-orange-600 transition-all uppercase tracking-widest shadow-md active:scale-95">Outreach</button>
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConglomerateAccounts;

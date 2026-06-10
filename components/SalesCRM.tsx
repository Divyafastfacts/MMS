
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  MessageSquare, 
  ChevronRight, 
  History, 
  Globe, 
  Briefcase, 
  ArrowLeft,
  Save,
  Clock,
  Calendar,
  Phone,
  Mail,
  PlusCircle,
  Filter,
  CheckCircle2,
  Sparkles,
  Zap,
  Copy,
  Check,
  TriangleAlert,
  TrendingUp,
  ExternalLink,
  ClipboardList,
  ChevronDown,
  Linkedin,
  Rocket,
  Monitor
} from 'lucide-react';
import { SavedAccount, Lead, InteractionLog, Task } from '../types.ts';
import { polishRemarks } from '../services/geminiService.ts';

const CRM_STATUSES = [
  'Discovery Initiated',
  'Pitch Delivered',
  'Product Demo Scheduled',
  'Technical Evaluation',
  'Proposal Sent',
  'Contract Negotiation',
  'Closed Won',
  'Closed Lost'
];

interface SalesCRMProps {
  accounts: SavedAccount[];
  onUpdateAccounts: (updatedAccounts: SavedAccount[]) => void;
  onSelectLeadForEmail: (lead: Lead) => void;
  onSelectLeadForLinkedIn?: (lead: Lead) => void;
  onAutoAddTask?: (task: Task) => void;
}

const SalesCRM: React.FC<SalesCRMProps> = ({ accounts, onUpdateAccounts, onSelectLeadForEmail, onSelectLeadForLinkedIn, onAutoAddTask }) => {
  const [selectedAccountName, setSelectedAccountName] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newLog, setNewLog] = useState({ status: CRM_STATUSES[0], remarks: '', nextCallDate: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const selectedAccount = accounts.find(acc => acc.companyInfo.name === selectedAccountName);
  const selectedLead = selectedAccount?.leads.find(lead => lead.id === selectedLeadId);

  const handleEmailDraft = (lead: Lead) => {
    onSelectLeadForEmail(lead);
  };

  const calculateLeadScore = (lead: Lead): number => {
    let score = lead.relevanceScore || 5;
    if (!lead.logs) return score;
    lead.logs.forEach(log => {
      if (log.status.includes('Demo')) score += 3;
      if (log.status.includes('Technical')) score += 4;
    });
    return Math.min(10, Math.max(0, score));
  };

  const handlePolish = async () => {
    if (!newLog.remarks) return;
    setIsPolishing(true);
    try {
      const result = await polishRemarks(newLog.remarks);
      setNewLog(prev => ({ ...prev, remarks: result }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !selectedLead) return;
    setIsSaving(true);
    const timestamp = new Date().toISOString();
    const logEntry: InteractionLog = {
      id: Math.random().toString(36).substr(2, 9),
      status: newLog.status,
      remarks: newLog.remarks,
      timestamp,
      nextCallDate: newLog.nextCallDate || undefined
    };
    
    const updatedAccounts = accounts.map(acc => {
      if (acc.companyInfo.name === selectedAccountName) {
        return { 
          ...acc, 
          leads: acc.leads.map(lead => 
            lead.id === selectedLeadId 
              ? { ...lead, logs: [logEntry, ...(lead.logs || [])] } 
              : lead
          ) 
        };
      }
      return acc;
    });
    
    setTimeout(() => { 
      onUpdateAccounts(updatedAccounts); 
      setNewLog({ status: CRM_STATUSES[0], remarks: '', nextCallDate: '' }); 
      setIsSaving(false); 
    }, 600);
  };

  const generateDynamicPitch = (lead: Lead, account: SavedAccount) => {
    const isMkt = lead.department?.toUpperCase() === 'MARKETING';
    const name = lead.name.split(' ')[0];
    if (isMkt) return `Hi ${name}, I've been following ${account.companyInfo.name}'s digital presence. Your recent growth initiatives suggest a focus on demand-gen efficiency. I'd love to share how our AI-driven transformation stack can accelerate your LTV and customer acquisition velocity.`;
    return `Hi ${name}, given your role at ${account.companyInfo.name}, I suspect you're navigating the complexities of modern tech-stack consolidation. Our solution streamlines architectural friction and enhances overall system throughput. Would a 10-minute technical brief be of value?`;
  };

  const handleLeadIdentitySearch = (lead: Lead) => {
    const googleQuery = encodeURIComponent(`"${lead.name}" "${lead.title}" "${lead.company}"`);
    const linkedinQuery = encodeURIComponent(`"${lead.name}" "${lead.title}" "${lead.company}"`);
    window.open(`https://www.google.com/search?q=${googleQuery}`, '_blank');
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${linkedinQuery}`, '_blank');
  };

  const renderAccountSelection = () => (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div><h1 className="text-3xl font-black text-slate-900">Portfolio View</h1><p className="text-slate-500 font-medium mt-1">Select a digital-first account to manage outreach.</p></div>
        <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl font-bold text-sm"><Filter size={18} /> Filters</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {accounts.map((acc, idx) => (
          <button key={idx} onClick={() => setSelectedAccountName(acc.companyInfo.name)} className="text-left bg-white border border-slate-200 p-8 rounded-3xl hover:border-orange-500 transition-all group relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6"><div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors"><Building2 size={28} /></div><div><h3 className="text-xl font-black text-slate-900">{acc.companyInfo.name}</h3><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{acc.companyInfo.industry}</span></div></div>
            <div className="space-y-4"><p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">{acc.companyInfo.summary}</p><div className="pt-4 border-t border-slate-50 flex items-center justify-between"><div className="flex items-center gap-2"><User size={16} className="text-orange-600" /><span className="text-xs font-black text-slate-700">{acc.leads.length} Stakeholders</span></div><ChevronRight size={20} className="text-slate-300 group-hover:text-orange-600 transition-transform" /></div></div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPersonaList = () => (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <button onClick={() => setSelectedAccountName(null)} className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-bold mb-4 group"><ArrowLeft size={18} /> Back to Accounts</button>
      {selectedAccount && (
        <>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col lg:row gap-4 items-start"><div className="flex items-center gap-4"><div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><Building2 size={32} /></div><div><h2 className="text-2xl font-black text-slate-900">{selectedAccount.companyInfo.name}</h2><div className="flex items-center gap-4 mt-1"><span className="text-xs font-bold text-slate-500">{selectedAccount.companyInfo.industry}</span></div></div></div><p className="text-slate-600 font-medium">{selectedAccount.companyInfo.summary}</p></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Decision Maker</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cadence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {selectedAccount.leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-black text-xs">{lead.name.split(' ').map(n => n[0]).join('')}</div>
                        <div>
                          <div onClick={() => handleLeadIdentitySearch(lead)} className="font-bold text-slate-900 group-hover:text-orange-600 cursor-pointer">{lead.name}</div>
                          <div className="text-xs text-slate-500 font-semibold">{lead.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5"><span className="text-xs font-black text-orange-600">{(calculateLeadScore(lead)).toFixed(1)}/10</span></td>
                    <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                      <button onClick={() => onSelectLeadForLinkedIn?.(lead)} className="p-2 text-slate-400 hover:text-[#0077b5]"><Linkedin size={18} /></button>
                      <button onClick={() => setSelectedLeadId(lead.id)} className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-tight">Strategy</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );

  const renderActionCard = () => (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500 pb-20">
      <div className="space-y-6">
        <button onClick={() => setSelectedLeadId(null)} className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-bold mb-2 group"><ArrowLeft size={18} /> Back to Directory</button>
        {selectedLead && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-black text-xl">{selectedLead.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <h2 onClick={() => handleLeadIdentitySearch(selectedLead)} className="text-2xl font-black text-slate-900 cursor-pointer hover:text-orange-600">{selectedLead.name}</h2>
                    <p className="text-slate-500 font-bold">{selectedLead.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-8 bg-orange-50 border border-orange-100 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-black text-orange-700 uppercase tracking-widest flex items-center gap-2"><Zap size={14} /> Neural Pitch Hook</h4>
                    <button onClick={() => { navigator.clipboard.writeText(generateDynamicPitch(selectedLead, selectedAccount!)); setCopiedScript(true); setTimeout(() => setCopiedScript(false), 2000); }} className="p-2 bg-white text-orange-600 rounded-lg shadow-sm">
                      {copiedScript ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-sm text-orange-900/80 font-medium italic">"{generateDynamicPitch(selectedLead, selectedAccount!)}"</p>
                </div>

                <form onSubmit={handleAddLog} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Engagement Stage</label>
                      <select value={newLog.status} onChange={(e) => setNewLog({ ...newLog, status: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900">
                        {CRM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Follow-up Window</label>
                      <input type="date" value={newLog.nextCallDate} onChange={(e) => setNewLog({ ...newLog, nextCallDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interaction Notes</label>
                      <button type="button" onClick={handlePolish} disabled={isPolishing || !newLog.remarks} className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[10px] font-black uppercase disabled:opacity-50">
                        {isPolishing ? <Sparkles className="animate-spin" size={12} /> : <Sparkles size={12} />}Summarize AI
                      </button>
                    </div>
                    <textarea required value={newLog.remarks} onChange={(e) => setNewLog({ ...newLog, remarks: e.target.value })} placeholder="Document key digital pain points..." className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-700 transition-all" />
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button disabled={isSaving} type="submit" className="flex items-center gap-2 px-10 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">
                      <PlusCircle size={16} />{isSaving ? 'Logging...' : 'Update Cadence'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <div className="pb-20">{selectedLeadId ? renderActionCard() : selectedAccountName ? renderPersonaList() : renderAccountSelection()}</div>;
};

export default SalesCRM;

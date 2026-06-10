
import React from 'react';
import { 
  Users, 
  Mail, 
  Linkedin, 
  Trash2, 
  Building2, 
  Star, 
  Search,
  ArrowRight,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { Lead } from '../types.ts';

interface MyContactsProps {
  contacts: Lead[];
  onRemove: (leadId: string) => void;
  onEmail: (lead: Lead) => void;
  onLinkedIn: (lead: Lead) => void;
  onNavigateToResearcher: (company: string) => void;
}

const MyContacts: React.FC<MyContactsProps> = ({ 
  contacts, 
  onRemove, 
  onEmail, 
  onLinkedIn,
  onNavigateToResearcher
}) => {
  const departments = Array.from(new Set(contacts.map(c => c.department)));

  const handleLeadIdentitySearch = (lead: Lead) => {
    const googleQuery = encodeURIComponent(`"${lead.name}" "${lead.title}" "${lead.company}"`);
    const linkedinQuery = encodeURIComponent(`"${lead.name}" "${lead.title}" "${lead.company}"`);
    
    window.open(`https://www.google.com/search?q=${googleQuery}`, '_blank');
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${linkedinQuery}`, '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-6 bg-orange-600 rounded-full"></div>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Personal Registry</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Contacts</h1>
          <p className="text-slate-500 font-medium">Your curated list of high-priority decision makers.</p>
        </div>
        <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl border-b-4 border-[#0077b5] flex items-center gap-3 shadow-md">
          <UserCheck size={18} className="text-[#0077b5]" />
          <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{contacts.length} Saved Members</span>
        </div>
      </header>

      {contacts.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Users size={48} />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-black text-slate-900">Your Registry is Empty</h3>
            <p className="text-slate-500 mt-2">Use the 👤+ icon in the Persona Researcher or Accounts view to save stakeholders here for quick access.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-4">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                className="bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-orange-600 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-900/20">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 
                        onClick={() => handleLeadIdentitySearch(contact)}
                        className="font-black text-slate-900 text-lg cursor-pointer hover:text-orange-600 hover:underline decoration-orange-200 underline-offset-4 transition-all"
                        title="Audit Identity: Google + LinkedIn Search"
                      >
                        {contact.name}
                      </h3>
                      {contact.relevanceScore >= 9 && <Star size={14} className="text-orange-500 fill-orange-500" />}
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-2">
                      <Briefcase size={12} className="text-orange-600" />
                      {contact.title}
                    </div>
                    <button 
                      onClick={() => onNavigateToResearcher(contact.company)}
                      className="text-[10px] text-[#0077b5] font-black uppercase tracking-tight mt-1 flex items-center gap-1 hover:underline"
                    >
                      <Building2 size={12} />
                      {contact.company}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onEmail(contact)}
                    className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-slate-100"
                    title="Draft Email"
                  >
                    <Mail size={20} />
                  </button>
                  <button 
                    onClick={() => onLinkedIn(contact)}
                    className="p-4 bg-slate-50 text-[#0077b5] rounded-2xl hover:bg-[#0077b5] hover:text-white transition-all shadow-sm border border-slate-100"
                    title="Direct Search on LinkedIn"
                  >
                    <Linkedin size={20} />
                  </button>
                  <div className="w-px h-8 bg-slate-100 mx-2" />
                  <button 
                    onClick={() => onRemove(contact.id)}
                    className="p-4 bg-slate-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100"
                    title="Remove from Contacts"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/30">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6">Audience Distribution</h3>
              <div className="space-y-4">
                {departments.map(dept => {
                  const count = contacts.filter(c => c.department === dept).length;
                  const percentage = (count / contacts.length) * 100;
                  return (
                    <div key={dept} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase">
                        <span>{dept}</span>
                        <span>{count}</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-600" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-orange-50 rounded-2xl text-orange-600">
                <Search size={32} />
              </div>
              <h4 className="font-black text-slate-900">Add More Stakeholders</h4>
              <p className="text-xs text-slate-500 font-medium">Use the persona researcher to find new leads in your target companies.</p>
              <button 
                onClick={() => onNavigateToResearcher('')}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                Go to Researcher <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContacts;

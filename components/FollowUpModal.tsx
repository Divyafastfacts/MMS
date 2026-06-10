
import React from 'react';
import { Calendar, Phone, Mail, X, ArrowRight, BellRing } from 'lucide-react';
import { Lead } from '../types.ts';

interface FollowUpModalProps {
  followUps: { lead: Lead; date: string }[];
  onClose: () => void;
  onNavigateToLead: (lead: Lead) => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ followUps, onClose, onNavigateToLead }) => {
  if (followUps.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-orange-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BellRing size={120} />
          </div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full w-fit">
                <Calendar size={14} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest">Action Required Today</span>
              </div>
              <h2 className="text-3xl font-black">Follow-up Reminders</h2>
              <p className="text-orange-100 font-medium">You have {followUps.length} high-priority interactions scheduled for today.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[50vh] overflow-y-auto">
          <div className="space-y-4">
            {followUps.map(({ lead }, idx) => (
              <div key={idx} className="group bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-orange-500 hover:bg-white transition-all shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 font-black shadow-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{lead.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{lead.title} @ {lead.company}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigateToLead(lead)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-lg text-xs font-black group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all"
                >
                  Log Action <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs transition-all shadow-xl shadow-slate-900/10 active:scale-95"
          >
            Acknowledge All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
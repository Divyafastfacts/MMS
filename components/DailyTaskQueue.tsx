
import React, { useState, useMemo } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Linkedin, 
  Phone, 
  Zap, 
  AlertCircle, 
  ChevronRight,
  Filter,
  Search,
  ArrowUpRight,
  MoreVertical,
  ShieldAlert
} from 'lucide-react';
import { Lead, StepType } from '../types.ts';

interface DailyTaskQueueProps {
  leads: Lead[];
  onExecuteTask: (lead: Lead, type: StepType) => void;
}

const DailyTaskQueue: React.FC<DailyTaskQueueProps> = ({ leads, onExecuteTask }) => {
  const [filter, setFilter] = useState<StepType | 'ALL'>('ALL');

  const queue = useMemo(() => {
    // Simulated Sequence Logic: If lead has no logs, step 1 (SCRUB) is due. 
    // If they have 1 log, step 2 (EMAIL) is due, etc.
    return leads.filter(l => l.status !== 'broken').map(lead => {
      const logsCount = lead.logs?.length || 0;
      let nextStep: StepType = 'SCRUB';
      let priority: 'high' | 'medium' | 'low' = 'medium';

      if (logsCount === 1) nextStep = 'EMAIL';
      if (logsCount === 2) nextStep = 'LINKEDIN';
      if (logsCount >= 3) nextStep = 'CALL';

      if (lead.relevanceScore >= 9) priority = 'high';

      return { lead, nextStep, priority };
    }).filter(item => filter === 'ALL' || item.nextStep === filter);
  }, [leads, filter]);

  const getIcon = (type: StepType) => {
    switch (type) {
      case 'EMAIL': return <Mail size={16} />;
      case 'LINKEDIN': return <Linkedin size={16} />;
      case 'CALL': return <Phone size={16} />;
      case 'SCRUB': return <Zap size={16} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Manager</h1>
          <p className="text-slate-500 font-medium mt-1">
            Real-time execution queue for your active sales cadences and high-priority actions.
          </p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
          {['ALL', 'SCRUB', 'EMAIL', 'LINKEDIN', 'CALL'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === t 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-4">
          {queue.length > 0 ? (
            queue.map(({ lead, nextStep, priority }) => (
              <div 
                key={lead.id} 
                className="group bg-white border border-slate-200 p-6 rounded-[2rem] hover:border-orange-600 hover:shadow-2xl transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                    priority === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {getIcon(nextStep)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-slate-900 text-lg group-hover:text-orange-600 transition-colors">{lead.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        priority === 'high' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{lead.title} • {lead.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="hidden md:block">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Action</div>
                    <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                      <Zap size={14} className="text-orange-600" /> {nextStep} Outreach
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onExecuteTask(lead, nextStep)}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                  >
                    Execute <Play size={14} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center p-12">
              <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
              <h3 className="text-xl font-black text-slate-900">Queue Cleared</h3>
              <p className="text-slate-400 font-medium">All tasks have been processed for today.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/30">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6 flex items-center gap-2">
              <ShieldAlert size={16} /> Integrity Check
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-black">94%</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Response Rate Accuracy</div>
                </div>
                <ArrowUpRight className="text-emerald-400" />
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[10px] font-medium leading-relaxed opacity-80">
                  <span className="text-orange-400 font-black">Optimization Tip:</span> Strategic Cadence #4 (High Turnover Retail) is outperforming technical cadences by 24%. Enroll more leads into #4.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Cadence Health</h3>
            <div className="space-y-4">
              {[
                { name: 'CFO Strategic', val: 80, color: 'bg-orange-600' },
                { name: 'Accounts Operational', val: 45, color: 'bg-amber-500' },
                { name: 'HR Compliance', val: 65, color: 'bg-indigo-600' }
              ].map(c => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase">
                    <span>{c.name}</span>
                    <span>{c.val}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${c.color} h-full transition-all`} style={{ width: `${c.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTaskQueue;

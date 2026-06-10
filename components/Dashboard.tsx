
import React from 'react';
import { 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronRight,
  Zap,
  Database,
  BarChart3,
  Building2,
  Activity,
  ShieldCheck,
  AlertCircle,
  Cpu,
  Truck,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Lead, Task, TeamStats } from '../types.ts';

const performanceData: TeamStats[] = [
  { subsidiary: 'Reliance Retail', winRate: 42, leadsScrubbed: 156, avgResponseTime: '2.4h' },
  { subsidiary: 'Raymond Ltd', winRate: 38, leadsScrubbed: 98, avgResponseTime: '4.1h' },
  { subsidiary: 'Hinduja Group', winRate: 51, leadsScrubbed: 245, avgResponseTime: '1.8h' },
  { subsidiary: 'Adani Ent', winRate: 29, leadsScrubbed: 112, avgResponseTime: '5.2h' },
];

const ASSIGNED_ACCOUNTS = [
  { 
    name: 'Tata Steel Limited', 
    industry: 'Mining & Metals', 
    status: 'Audit In Progress', 
    progress: 68, 
    risk: 'Medium',
    icon: Building2 
  },
  { 
    name: 'JSW Group', 
    industry: 'Steel & Energy', 
    status: 'Critical Verification', 
    progress: 42, 
    risk: 'High',
    icon: Zap 
  },
  { 
    name: 'Hindustan Unilever (HUL)', 
    industry: 'FMCG / Consumer', 
    status: 'Hierarchy Verified', 
    progress: 100, 
    risk: 'Low',
    icon: ShieldCheck 
  },
  { 
    name: 'Larsen & Toubro (L&T)', 
    industry: 'Eng & Construction', 
    status: 'Scrubbing Profiles', 
    progress: 25, 
    risk: 'Medium',
    icon: Activity 
  },
  { 
    name: 'Mahindra & Mahindra', 
    industry: 'Automotive & Agri', 
    status: 'Deep Mapping', 
    progress: 15, 
    risk: 'Medium',
    icon: Truck 
  },
  { 
    name: 'Infosys Limited', 
    industry: 'IT Services', 
    status: 'Node Verified', 
    progress: 95, 
    risk: 'Low',
    icon: Cpu 
  },
  { 
    name: 'ITC Limited', 
    industry: 'Conglomerate', 
    status: 'Update Due', 
    progress: 55, 
    risk: 'High',
    icon: AlertCircle 
  },
  { 
    name: 'Adani Enterprises', 
    industry: 'Ports & Power', 
    status: 'Strategic Scan', 
    progress: 33, 
    risk: 'High',
    icon: Sparkles 
  }
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white border border-slate-200 p-8 rounded-[2rem] hover:shadow-xl hover:border-orange-200 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-8 -mt-8 group-hover:bg-orange-100 transition-colors"></div>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
        <Icon className={color.replace('bg-', 'text-')} size={28} />
      </div>
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(change)}%
      </div>
    </div>
    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
    <p className="text-4xl font-black mt-2 text-slate-900 tracking-tight">{value}</p>
  </div>
);

interface DashboardProps {
  followUps?: { lead: Lead; date: string }[];
  tasks?: Task[];
  onAccountClick?: (companyName: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ followUps = [], tasks = [], onAccountClick }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-6 bg-orange-600 rounded-full"></div>
             <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Enterprise Command Center</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Engine</h1>
          <p className="text-slate-500 font-medium">Monitoring accuracy metrics and strategic account progression.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
              <Database size={18} className="text-orange-600" />
              <div className="flex flex-col text-right">
                 <span className="text-[8px] font-black uppercase opacity-60">Accuracy Integrity</span>
                 <span className="text-xs font-bold text-slate-900">High-Precision Mode</span>
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Audited" value="3,215" change={18} icon={Users} color="bg-orange-600" />
        <StatCard title="Accuracy Level" value="99.8%" change={2} icon={ShieldCheck} color="bg-emerald-600" />
        <StatCard title="Verification Requests" value="142" change={-12} icon={Database} color="bg-orange-600" />
        <StatCard title="Pipeline Value" value="₹5.8 Cr" change={25} icon={TrendingUp} color="bg-orange-700" />
      </div>

      <section className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Building2 size={22} /></div>
            Assigned Neural Accounts
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator Queue: {ASSIGNED_ACCOUNTS.length} Entities</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSIGNED_ACCOUNTS.map((account, idx) => (
            <button 
              key={idx} 
              onClick={() => onAccountClick?.(account.name)}
              className="text-left p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-orange-500 hover:bg-white transition-all group shadow-sm flex flex-col justify-between h-56 w-full"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-orange-600 transition-colors">
                    <account.icon size={20} />
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
                    account.risk === 'High' ? 'bg-rose-50 text-rose-600' : 
                    account.risk === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {account.risk} Risk
                  </div>
                </div>
                <h4 className="font-black text-slate-900 text-lg group-hover:text-orange-600 transition-colors truncate">{account.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mb-4">{account.industry}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                  <span>Audit Depth</span>
                  <span className="text-slate-900">{account.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ${account.progress === 100 ? 'bg-emerald-500' : 'bg-orange-600'}`} 
                    style={{ width: `${account.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${account.progress === 100 ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'}`}></div>
                  <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest truncate">{account.status}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><BarChart3 size={22} /></div>
              Verification Accuracy Metrics
            </h3>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="subsidiary" type="category" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} fontWeight="bold" width={100} />
                  <Tooltip cursor={{ fill: '#fff7ed' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #fed7aa', borderRadius: '16px' }} />
                  <Bar dataKey="winRate" fill="#ea580c" radius={[0, 6, 6, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] shadow-sm h-fit">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
              <Calendar size={22} className="text-orange-600" /> High-Priority
            </h3>
          </div>

          <div className="space-y-6">
            {followUps.length > 0 ? (
              followUps.map(({ lead, date }, idx) => (
                <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-orange-600 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">{lead.hierarchyLevel}</span>
                    <span className="text-[9px] font-black text-slate-400">Due {date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{lead.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-1 mb-4">{lead.company}</p>
                  <button className="w-full py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-900/10">
                    Execute Navigator
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">All Nodes Synchronized</p>
              </div>
            )}
          </div>
          <button className="w-full mt-10 py-4 bg-slate-50 text-slate-500 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-orange-600 transition-all flex items-center justify-center gap-2">
            Audit Full Schedule <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

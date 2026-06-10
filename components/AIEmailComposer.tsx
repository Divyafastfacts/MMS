
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  User, 
  Building2, 
  Terminal, 
  Layout, 
  PenTool,
  History,
  Zap,
  Info,
  ShieldCheck,
  AtSign
} from 'lucide-react';
import { generateSalesEmail } from '../services/geminiService.ts';
import { EmailMode, Lead, ManualEmailContext } from '../types.ts';

interface AIEmailComposerProps {
  selectedLead: Lead | null;
}

const AIEmailComposer: React.FC<AIEmailComposerProps> = ({ selectedLead }) => {
  const [mode, setMode] = useState<EmailMode>(EmailMode.STRATEGIC);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Manual Input State
  const [manualContext, setManualContext] = useState<ManualEmailContext>({
    recipientName: '',
    recipientEmail: '',
    designation: '',
    companyName: '',
    topic: ''
  });

  useEffect(() => {
    if (selectedLead) {
      handleGenerate();
    }
  }, [selectedLead, mode]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const emailText = await generateSalesEmail(selectedLead || manualContext, mode);
      setContent(emailText);
    } catch (error) {
      console.error(error);
      setContent("Neural Engine encountered a timeout. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteOutreach = () => {
    const to = selectedLead ? selectedLead.email : manualContext.recipientEmail;
    const subject = `Discussion: Compliance Automation for ${selectedLead ? selectedLead.company : manualContext.companyName}`;
    const body = content;

    // Use Gmail web compose URL as primary, fallback to mailto if needed
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  const isManualReady = manualContext.recipientName && manualContext.recipientEmail && manualContext.companyName;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-4 bg-[#EA580C] rounded-full"></div>
             <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Outreach Node</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {selectedLead ? 'Strategic Outreach Composer' : 'General Email Drafter'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {selectedLead 
              ? `Generating hyper-personalized content for ${selectedLead.name}.` 
              : 'Draft professional corporate emails for any recipient with Gemini AI.'}
          </p>
        </div>
        
        <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
          {Object.values(EmailMode).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === m 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                  : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Pane */}
        <div className="lg:col-span-4 space-y-8">
          {selectedLead ? (
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-8">
              <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">Entity Context</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm"><User className="text-orange-600" size={20} /></div>
                  <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase">Stakeholder</div>
                    <div className="font-black text-slate-900 text-lg leading-tight">{selectedLead.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{selectedLead.title}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm"><Building2 className="text-slate-400" size={20} /></div>
                  <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase">Company</div>
                    <div className="font-black text-slate-900 text-lg leading-tight">{selectedLead.company}</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                {isGenerating ? <Wand2 className="animate-spin" size={20} /> : <Zap size={20} className="text-orange-500" />}
                {isGenerating ? 'Synthesizing...' : 'Regenerate Strategem'}
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-8">
              <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] border-b border-slate-100 pb-4">Recipient Parameters</h3>
              <div className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                   <input 
                      type="text" 
                      placeholder="e.g. Rajesh Kumar"
                      value={manualContext.recipientName}
                      onChange={(e) => setManualContext({...manualContext, recipientName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-600 transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                   <div className="relative">
                     <AtSign size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                        type="email" 
                        placeholder="e.g. rajesh@tata.com"
                        value={manualContext.recipientEmail}
                        onChange={(e) => setManualContext({...manualContext, recipientEmail: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-600 transition-all"
                     />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                   <input 
                      type="text" 
                      placeholder="e.g. Finance Controller"
                      value={manualContext.designation}
                      onChange={(e) => setManualContext({...manualContext, designation: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-600 transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
                   <input 
                      type="text" 
                      placeholder="e.g. Tata Steel"
                      value={manualContext.companyName}
                      onChange={(e) => setManualContext({...manualContext, companyName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-600 transition-all"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic / Pain Point</label>
                   <textarea 
                      placeholder="e.g. CARO 2020 compliance or Physical Asset Audit"
                      value={manualContext.topic}
                      onChange={(e) => setManualContext({...manualContext, topic: e.target.value})}
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-600 transition-all resize-none"
                   />
                </div>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !isManualReady}
                className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                {isGenerating ? <Wand2 className="animate-spin" size={20} /> : <Zap size={20} className="text-orange-500" />}
                {isGenerating ? 'Drafting...' : 'Generate Neural Draft'}
              </button>
            </div>
          )}

          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles size={100} />
            </div>
            <h4 className="font-black uppercase tracking-[0.2em] text-[10px] mb-4 text-orange-400">Strategy Engine</h4>
            <p className="text-sm font-medium leading-relaxed opacity-90 relative z-10">
              {mode === EmailMode.STRATEGIC && "C-level outreach in the Indian Conglomerate sector is most effective when highlighting CARO 2020 / Auditor risk. Mention 100% automated FAR registers."}
              {mode === EmailMode.OPERATIONAL && "Focus on eliminating the manual effort in TDS reconciliation. Mention 'Last-Mile' ERP connectivity."}
              {mode === EmailMode.TECHNICAL && "CIOs care about node security and SAP/Oracle seamless sync. Highlight the 'Newgen' technology stack."}
            </p>
          </div>
        </div>

        {/* Editor Pane */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] flex flex-col h-[750px] shadow-sm overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <PenTool size={18} className="text-orange-600" />
                 <span className="text-slate-900 font-black text-xs uppercase tracking-[0.2em]">Neural Workspace</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="p-3 text-slate-400 hover:text-orange-600 hover:bg-white rounded-xl transition-all shadow-sm bg-white border border-slate-200"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative p-10">
              {isGenerating && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                        <Wand2 className="animate-spin text-orange-500" size={32} />
                    </div>
                    <span className="text-slate-900 font-black text-xs uppercase tracking-widest animate-pulse">Gemini AI is Writing...</span>
                  </div>
                </div>
              )}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full bg-transparent resize-none outline-none text-slate-700 leading-relaxed font-mono text-sm"
                placeholder="The AI will populate your strategic outreach here. You can manually edit this draft to add a personal touch."
              />
            </div>

            <div className="px-10 py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center bg-slate-50/30 gap-6">
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                  <ShieldCheck size={14} />
                  Compliance Score: 98%
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-500">
                  <Info size={14} />
                  Spam-Safe Pattern
                </div>
              </div>
              <button 
                onClick={handleExecuteOutreach}
                className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform active:scale-95 shadow-xl shadow-orange-900/20"
              >
                <Send size={20} />
                Execute in Gmail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEmailComposer;

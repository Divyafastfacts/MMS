
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  X, 
  Zap,
  Terminal,
  ShieldCheck,
  Building2,
  User,
  ArrowRight
} from 'lucide-react';
import { generateSalesEmail } from '../services/geminiService.ts';
import { EmailMode, Lead } from '../types.ts';

interface EmailComposerModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmailComposerModal: React.FC<EmailComposerModalProps> = ({ lead, isOpen, onClose }) => {
  const [mode, setMode] = useState<EmailMode>(EmailMode.STRATEGIC);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      handleGenerate();
    }
  }, [lead, mode, isOpen]);

  const handleGenerate = async () => {
    if (!lead) return;
    setIsGenerating(true);
    try {
      const emailText = await generateSalesEmail(lead, mode);
      setContent(emailText);
    } catch (error) {
      console.error(error);
      setContent("Failed to generate outreach. Please verify API connection.");
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
    if (!lead) return;
    const to = lead.email;
    const subject = `Discussion: Compliance Automation for ${lead.company}`;
    const body = content;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-500">
        <header className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600 rounded-2xl text-white shadow-lg shadow-orange-900/10">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Email Generator</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Drafting for {lead.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          {/* Mode Switcher */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Persona Strategy</label>
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {Object.values(EmailMode).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    mode === m 
                      ? 'bg-white text-orange-600 shadow-sm border border-orange-100' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Context Banner */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-1 text-orange-600">
                <User size={14} />
                <span className="text-[9px] font-black uppercase">Recipient</span>
              </div>
              <div className="text-sm font-black text-slate-900 truncate">{lead.name}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-1 text-slate-400">
                <Building2 size={14} />
                <span className="text-[9px] font-black uppercase">Company</span>
              </div>
              <div className="text-sm font-black text-slate-900 truncate">{lead.company}</div>
            </div>
          </div>

          {/* Draft Area */}
          <div className="flex flex-col flex-1 h-[400px] border border-slate-200 rounded-[2rem] overflow-hidden relative shadow-inner">
            {isGenerating && (
              <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-900 font-black text-xs uppercase tracking-widest animate-pulse">Gemini AI Synthesizing...</p>
              </div>
            )}
            
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Interactive Workspace</span>
              <button 
                onClick={handleGenerate}
                className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:underline"
              >
                Regenerate
              </button>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-8 text-slate-700 leading-relaxed font-mono text-sm outline-none resize-none bg-transparent"
              placeholder="Drafting workspace..."
            />

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
               <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
                  <ShieldCheck size={14} />
                  GDPR & Spam Compliant
               </div>
               <button 
                  onClick={copyToClipboard}
                  className="p-2 text-slate-400 hover:text-orange-600 hover:bg-white rounded-xl transition-all shadow-sm bg-white"
                >
                  {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
            </div>
          </div>

          {/* Advice */}
          <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles size={64} />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-orange-400">Strategic Guidance</h4>
            <p className="text-xs font-medium leading-relaxed opacity-90 relative z-10">
              {mode === EmailMode.STRATEGIC && "C-level executives in the Indian sector respond best to CARO compliance ROI. Focus on the automated physical verification via mobile app."}
              {mode === EmailMode.OPERATIONAL && "Highlight time savings in TDS reconciliation. Mention the reduction in manual data entry for 26AS/AIS gaps."}
              {mode === EmailMode.TECHNICAL && "Emphasize security and ERP integration (SAP/Oracle). Mention the high node integrity and distributed architecture."}
            </p>
          </div>
        </div>

        <footer className="p-10 border-t border-slate-100 bg-slate-50/50 flex gap-4">
          <button 
            onClick={copyToClipboard}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-orange-600 hover:text-orange-600 transition-all shadow-sm"
          >
            {copied ? 'Copied' : 'Transfer to Clipboard'}
          </button>
          <button 
            onClick={handleExecuteOutreach}
            className="flex-[1.5] flex items-center justify-center gap-3 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-900/20 active:scale-95"
          >
            <Send size={18} />
            Execute in Gmail
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EmailComposerModal;

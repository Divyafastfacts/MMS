
import React, { useState, useEffect } from 'react';
import { Linkedin, X, Copy, Check, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { generateLinkedInMessage } from '../services/geminiService.ts';
import { Lead } from '../types.ts';

interface LinkedInOutreachModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const LinkedInOutreachModal: React.FC<LinkedInOutreachModalProps> = ({ lead, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      handleGenerate();
    }
  }, [lead, isOpen]);

  const handleGenerate = async () => {
    if (!lead) return;
    setIsGenerating(true);
    setMessage('');
    try {
      const msg = await generateLinkedInMessage(lead);
      setMessage(msg);
    } catch (error) {
      setMessage("Could not generate LinkedIn connection request. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        <div className="bg-[#0077b5] p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white rounded-2xl text-[#0077b5] shadow-lg">
              <Linkedin size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">LinkedIn Outreach</h3>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80">Connection Strategem</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-3xl shadow-inner">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-[#0077b5] border border-slate-100 shadow-sm">
              {lead.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <div className="font-black text-slate-900 truncate text-lg">{lead.name}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate">{lead.title} @ {lead.company}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} className="text-blue-500" /> AI Generated Hook
              </label>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="text-[10px] font-black text-[#0077b5] uppercase hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                {isGenerating ? <Loader2 size={10} className="animate-spin" /> : null}
                Regenerate
              </button>
            </div>
            <div className="relative">
              {isGenerating ? (
                <div className="h-36 w-full bg-slate-50 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-[#0077b5]/10 rounded-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#0077b5]" size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Neural Drafting...</span>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl min-h-36 text-sm font-medium text-slate-700 leading-relaxed italic relative">
                  <div className="absolute top-0 right-0 p-3 opacity-10"><Linkedin size={40} /></div>
                  "{message}"
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex gap-4">
            <button 
              onClick={handleCopy}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#0077b5] hover:text-[#0077b5] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              {copied ? 'Copied' : 'Copy Message'}
            </button>
            <button 
              onClick={() => window.open(lead.linkedinUrl, '_blank')}
              className="flex-[1.5] py-4 bg-[#0077b5] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#006396] transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95"
            >
              <ExternalLink size={18} />
              Visit LinkedIn Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInOutreachModal;


import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import AISalesResearcher from './components/AISalesResearcher.tsx';
import AIEmailComposer from './components/AIEmailComposer.tsx';
import SalesCRM from './components/SalesCRM.tsx';
import DailyTaskQueue from './components/DailyTaskQueue.tsx';
import Settings from './components/Settings.tsx';
import ConglomerateAccounts from './components/ConglomerateAccounts.tsx';
import MyContacts from './components/MyContacts.tsx';
import Auth from './components/Auth.tsx';
import EmailComposerModal from './components/EmailComposerModal.tsx';
import LinkedInOutreachModal from './components/LinkedInOutreachModal.tsx';
import { AppView, Lead, CompanyInfo, SavedAccount, User, Task, StepType } from './types.ts';

const generateDummyLeads = (companyName: string): Lead[] => {
  const roles = [
    { title: 'Chief Marketing Officer (CMO)', dept: 'Marketing', tier: 'Tier 1' },
    { title: 'Chief Technology Officer (CTO)', dept: 'Tech', tier: 'Tier 1' },
    { title: 'Chief Product Officer (CPO)', dept: 'Product', tier: 'Tier 1' },
    { title: 'Head of Growth', dept: 'Marketing', tier: 'Tier 2' },
    { title: 'Head of Digital Marketing', dept: 'Marketing', tier: 'Tier 2' },
    { title: 'VP of Engineering', dept: 'Tech', tier: 'Tier 1' },
    { title: 'Head of AI', dept: 'Security', tier: 'Tier 2' },
    { title: 'CISO', dept: 'Security', tier: 'Tier 2' },
    { title: 'Chief Strategy Officer (CSO)', dept: 'Strategy', tier: 'Tier 1' },
    { title: 'Head of Customer Experience (CX)', dept: 'Product', tier: 'Tier 2' },
    { title: 'Product Head (Mobile)', dept: 'Product', tier: 'Tier 2' },
    { title: 'Head of Innovation', dept: 'Strategy', tier: 'Tier 2' },
    { title: 'DPO', dept: 'Security', tier: 'Tier 3' }
  ];

  const firstNames = ['Arjun', 'Priya', 'Siddharth', 'Anjali', 'Vikram', 'Neha', 'Rahul', 'Sonal', 'Karan', 'Meera', 'Aditya', 'Ishani', 'Rohan'];
  const lastNames = ['Sharma', 'Mehta', 'Goel', 'Iyer', 'Kapoor', 'Verma', 'Singh', 'Reddy', 'Chopra', 'Malhotra', 'Bose', 'Gupta', 'Patel'];

  return roles.map((role, idx) => ({
    id: `lead-${companyName.replace(/\s+/g, '-').toLowerCase()}-${idx}`,
    name: `${firstNames[idx % firstNames.length]} ${lastNames[idx % lastNames.length]}`,
    title: role.title,
    company: companyName,
    linkedinUrl: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`"${firstNames[idx % firstNames.length]} ${lastNames[idx % lastNames.length]}" "${role.title}" "${companyName}"`)}`,
    email: `${firstNames[idx % firstNames.length].toLowerCase()}.${lastNames[idx % lastNames.length].toLowerCase()}@${companyName.split(' ')[0].toLowerCase()}.com`,
    status: 'verified',
    department: role.dept,
    relevanceScore: idx < 3 ? 10 : 8,
    hierarchyLevel: role.tier,
    confidenceScore: 9,
    verificationStatus: 'grounded_fact',
    sourceEvidence: `Corporate Directory 2024`,
    logs: []
  }));
};

const NEURAL_ACCOUNTS: SavedAccount[] = [
  {
    ownerId: 'seed-user-1',
    lastUpdated: new Date().toISOString(),
    companyInfo: {
      name: 'Zomato Limited',
      summary: '• Focus on hyper-growth and logistics tech.\n• Complex Product-Led Growth (PLG) requirements.\n• High emphasis on CX and mobile-first innovation.',
      sisterCompanies: ['Blinkit', 'Hyperpure'],
      turnover: '₹7,078 Crore',
      industry: 'Internet & Tech',
      headquarters: 'Gurugram, Haryana',
    },
    leads: generateDummyLeads('Zomato Limited')
  },
  {
    ownerId: 'seed-user-1',
    lastUpdated: new Date().toISOString(),
    companyInfo: {
      name: 'Reliance Jio',
      summary: '• Strategic focus on 5G and digital ecosystem scale.\n• Leading AI/ML transformation in the telecom sector.',
      sisterCompanies: ['Reliance Retail'],
      turnover: '₹95,000 Crore',
      industry: 'Telecom & Tech',
      headquarters: 'Mumbai, Maharashtra',
    },
    leads: generateDummyLeads('Reliance Jio')
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLinkedInLead, setSelectedLinkedInLead] = useState<Lead | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [conglomerateAccounts, setConglomerateAccounts] = useState<SavedAccount[]>([]);
  const [myContacts, setMyContacts] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [externalSearchQuery, setExternalSearchQuery] = useState<string | null>(null);
  const [pendingFollowUps, setPendingFollowUps] = useState<{ lead: Lead; date: string }[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (!user) return;
    const emailKey = user.email.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Load accounts
    const accountStorageKey = `conglomerate_accounts_${emailKey}`;
    const savedAccounts = localStorage.getItem(accountStorageKey);
    if (savedAccounts) setConglomerateAccounts(JSON.parse(savedAccounts));
    else setConglomerateAccounts(NEURAL_ACCOUNTS);

    // Load contacts
    const contactsStorageKey = `my_contacts_${emailKey}`;
    const savedContacts = localStorage.getItem(contactsStorageKey);
    if (savedContacts) setMyContacts(JSON.parse(savedContacts));
  }, [user]);

  const saveMyContacts = (newContacts: Lead[]) => {
    if (!user) return;
    setMyContacts(newContacts);
    const emailKey = user.email.replace(/[^a-zA-Z0-9]/g, '_');
    localStorage.setItem(`my_contacts_${emailKey}`, JSON.stringify(newContacts));
  };

  const handleToggleContact = (lead: Lead) => {
    const exists = myContacts.find(c => c.id === lead.id);
    if (exists) {
      saveMyContacts(myContacts.filter(c => c.id !== lead.id));
    } else {
      saveMyContacts([...myContacts, lead]);
    }
  };

  const handleExecuteTask = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEmailModalOpen(true);
  };

  const handleLinkedInOutreach = (lead: Lead) => {
    const query = encodeURIComponent(`"${lead.name}" "${lead.title}" "${lead.company}"`);
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${query}`, '_blank');
  };

  const handleExecuteQueueTask = (lead: Lead, type: StepType) => {
    if (type === 'EMAIL') {
      handleExecuteTask(lead);
    } else if (type === 'LINKEDIN') {
      handleLinkedInOutreach(lead);
    } else if (type === 'SCRUB') {
      setView(AppView.ACCOUNTS);
    } else if (type === 'CALL') {
      setView(AppView.CRM);
    }
  };

  const handleUpdateAccounts = (updatedAccounts: SavedAccount[]) => {
    if (!user) return;
    const emailKey = user.email.replace(/[^a-zA-Z0-9]/g, '_');
    setConglomerateAccounts(updatedAccounts);
    localStorage.setItem(`conglomerate_accounts_${emailKey}`, JSON.stringify(updatedAccounts));
  };

  const allLeads = useMemo(() => {
    return conglomerateAccounts.flatMap(acc => acc.leads);
  }, [conglomerateAccounts]);

  const handleSetView = (newView: AppView) => {
    if (newView === AppView.COMPOSER) {
      setSelectedLead(null);
    }
    setView(newView);
  };

  const handleDashboardAccountClick = (companyName: string) => {
    setExternalSearchQuery(companyName);
    setView(AppView.ACCOUNTS);
  };

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-inter">
      <Sidebar 
        currentView={view} 
        setView={handleSetView} 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        savedAccounts={conglomerateAccounts}
        contactsCount={myContacts.length}
        onLogout={() => { localStorage.removeItem('current_user'); setUser(null); }}
      />
      
      <main className="flex-1 overflow-y-auto relative flex flex-col items-center bg-slate-100">
        <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-10 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
             <div className="flex flex-col leading-none">
               <div className="flex items-center gap-0">
                 <span className="font-black text-lg tracking-tighter text-[#EA580C]">FAST</span>
                 <span className="font-black text-lg tracking-tighter text-[#EA580C]">/</span>
                 <span className="font-black text-lg tracking-tighter text-black">FACTS</span>
               </div>
               <div className="text-[7px] font-black tracking-[0.2em] mt-0.5">
                 <span className="text-black uppercase">Powered by </span>
                 <span className="text-[#EA580C] uppercase">Newgen</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-5 pl-8 border-l border-slate-200">
              <div className="text-right">
                <div className="text-xs font-black text-slate-900">{user.name}</div>
                <div className="text-[8px] text-[#EA580C] font-black uppercase tracking-[0.2em]">Node Operator</div>
              </div>
              <img src={`https://picsum.photos/seed/${user.id}/40/40`} className="w-9 h-9 rounded-xl border border-slate-200" alt="Profile" />
            </div>
          </div>
        </header>

        <div className="flex-1 w-full overflow-y-auto bg-slate-50">
          <div className="p-10 pb-20 max-w-[1600px] mx-auto flex flex-col gap-10">
            {view === AppView.DASHBOARD && <Dashboard followUps={pendingFollowUps} tasks={tasks} onAccountClick={handleDashboardAccountClick} />}
            {view === AppView.TASKS && <DailyTaskQueue leads={allLeads} onExecuteTask={handleExecuteQueueTask} />}
            {view === AppView.RESEARCHER && (
              <AISalesResearcher 
                onSelectLeadForEmail={handleExecuteTask}
                onSelectLeadForLinkedIn={handleLinkedInOutreach}
                onToggleContact={handleToggleContact}
                savedContactIds={myContacts.map(c => c.id)}
                onSearchSuccess={(info, leads) => handleUpdateAccounts([...conglomerateAccounts, { ownerId: user.id, companyInfo: info, leads, lastUpdated: new Date().toISOString() }])} 
              />
            )}
            {view === AppView.ACCOUNTS && (
              <ConglomerateAccounts 
                accounts={conglomerateAccounts} 
                onViewAccount={setExternalSearchQuery} 
                onSelectLeadForEmail={handleExecuteTask}
                onSelectLeadForLinkedIn={handleLinkedInOutreach}
                onToggleContact={handleToggleContact}
                savedContactIds={myContacts.map(c => c.id)}
                onUpdateAccounts={handleUpdateAccounts}
                externalQuery={externalSearchQuery}
                clearExternalQuery={() => setExternalSearchQuery(null)}
              />
            )}
            {view === AppView.MY_CONTACTS && (
              <MyContacts 
                contacts={myContacts}
                onRemove={(id) => saveMyContacts(myContacts.filter(c => c.id !== id))}
                onEmail={handleExecuteTask}
                onLinkedIn={handleLinkedInOutreach}
                onNavigateToResearcher={(comp) => {
                   setExternalSearchQuery(comp);
                   setView(AppView.RESEARCHER);
                }}
              />
            )}
            {view === AppView.CRM && (
              <SalesCRM 
                accounts={conglomerateAccounts} 
                onUpdateAccounts={handleUpdateAccounts} 
                onSelectLeadForEmail={handleExecuteTask}
                onSelectLeadForLinkedIn={handleLinkedInOutreach}
              />
            )}
            {view === AppView.COMPOSER && <AIEmailComposer selectedLead={selectedLead} />}
            {view === AppView.SETTINGS && <Settings />}
          </div>
        </div>
      </main>

      {/* Global Outreach Modals */}
      <EmailComposerModal 
        isOpen={isEmailModalOpen} 
        lead={selectedLead} 
        onClose={() => setIsEmailModalOpen(false)} 
      />
      <LinkedInOutreachModal
        isOpen={isLinkedInModalOpen}
        lead={selectedLinkedInLead}
        onClose={() => setIsLinkedInModalOpen(false)}
      />
    </div>
  );
};

export default App;

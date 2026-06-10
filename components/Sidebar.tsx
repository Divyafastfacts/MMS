
import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  PenTool, 
  CheckSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  Database,
  Contact
} from 'lucide-react';
import { AppView, SavedAccount } from '../types.ts';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  savedAccounts?: SavedAccount[];
  contactsCount?: number;
  onLogout?: () => void;
}

const FastFactsLogo = ({ collapsed }: { collapsed: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`p-2 bg-white rounded-xl shadow-xl flex items-center justify-center ${collapsed ? 'w-12 h-12' : 'w-auto h-auto'}`}>
      <div className="flex flex-col">
        <div className="flex items-center gap-0 leading-none">
          <span className="font-black text-xl tracking-tighter text-[#EA580C]">FAST</span>
          <span className="font-black text-xl tracking-tighter text-[#EA580C]">/</span>
          <span className="font-black text-xl tracking-tighter text-black">FACTS</span>
        </div>
        {!collapsed && (
          <div className="text-[8px] font-bold tracking-[0.15em] mt-0.5 leading-none whitespace-nowrap">
            <span className="text-black uppercase">Powered by </span>
            <span className="text-[#EA580C] uppercase">Newgen</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  isCollapsed, 
  setIsCollapsed,
  contactsCount = 0,
  onLogout
}) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.RESEARCHER, label: 'Persona researcher', icon: Search },
    { id: AppView.ACCOUNTS, label: 'Saved Search', icon: Building2 },
    { id: AppView.MY_CONTACTS, label: 'My Contacts', icon: Contact, badge: contactsCount },
    { id: AppView.CRM, label: 'Sales CRM', icon: Database },
    { id: AppView.COMPOSER, label: 'AI Composer', icon: PenTool },
    { id: AppView.TASKS, label: 'Task Manager', icon: CheckSquare },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div 
      className={`h-screen bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-24' : 'w-72'
      }`}
    >
      <div className="p-6 flex items-center justify-between border-b border-slate-900/50 mb-4">
        <FastFactsLogo collapsed={isCollapsed} />
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all group relative ${
              currentView === item.id 
                ? 'bg-[#EA580C] text-white shadow-lg shadow-orange-950/50' 
                : 'text-slate-500 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <item.icon 
              size={20} 
              strokeWidth={currentView === item.id ? 2.5 : 2} 
              className={currentView === item.id ? 'text-white' : 'group-hover:text-white transition-colors'}
            />
            {!isCollapsed && (
              <div className="flex-1 flex justify-between items-center">
                <span className={`font-bold text-sm tracking-tight ${currentView === item.id ? 'text-white' : ''}`}>
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    currentView === item.id ? 'bg-white text-orange-600' : 'bg-[#EA580C] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            )}
            {isCollapsed && item.badge !== undefined && item.badge > 0 && (
               <div className="absolute top-2 right-2 w-4 h-4 bg-orange-600 rounded-full border-2 border-slate-950 flex items-center justify-center">
                  <span className="text-[7px] font-black text-white">{item.badge}</span>
               </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-900">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-3 text-slate-600 hover:bg-rose-950/30 hover:text-rose-500 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span className="font-bold text-sm">Terminate Session</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


import React, { useState } from 'react';
import { Plus, MoreVertical, Calendar, MessageSquare, GripVertical } from 'lucide-react';
import { Task } from '../types.ts';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Follow up with CFO @ Tesla', description: 'Regarding eTDS compliance demo', status: 'todo', priority: 'high', dueDate: '2024-06-15' },
    { id: '2', title: 'Prepare Technical RFP', description: 'For Microsoft Finance team', status: 'in-progress', priority: 'medium', dueDate: '2024-06-18' },
    { id: '3', title: 'Send Payroll Case Study', description: 'Requested by HR Manager @ Apple', status: 'done', priority: 'low', dueDate: '2024-06-10' },
  ]);

  const columns = [
    { id: 'todo', title: 'Open Pipeline', color: 'bg-orange-600' },
    { id: 'in-progress', title: 'Active Negotiation', color: 'bg-amber-600' },
    { id: 'done', title: 'Deal Closed', color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Task Manager</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your follow-up pipeline and sales tasks.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black transition-all shadow-lg shadow-orange-900/10">
          <Plus size={20} strokeWidth={3} />
          Add Prospect
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map(col => (
          <div key={col.id} className="bg-slate-100/50 p-4 rounded-3xl border border-slate-200/50 flex flex-col gap-4 h-[750px]">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-slate-800 flex items-center gap-3 text-sm uppercase tracking-widest">
                <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                {col.title}
                <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-black">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </h3>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1">
              {tasks
                .filter(t => t.status === col.id)
                .map(task => (
                  <div 
                    key={task.id} 
                    className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-orange-200 hover:shadow-xl hover:shadow-orange-900/5 transition-all group cursor-grab active:cursor-grabbing shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg ${
                        task.priority === 'high' ? 'bg-rose-50 text-rose-600' : 
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <GripVertical className="text-slate-300 group-hover:text-orange-300 transition-colors" size={16} />
                    </div>
                    
                    <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-orange-600 transition-colors">{task.title}</h4>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{task.description}</p>
                    
                    <div className="flex items-center justify-between text-[11px] font-black text-slate-400 border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                        <Calendar size={14} className="text-orange-600" />
                        {task.dueDate}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 hover:text-orange-600 cursor-pointer transition-colors">
                          <MessageSquare size={14} />
                          2
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
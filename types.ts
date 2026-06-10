
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  RESEARCHER = 'RESEARCHER',
  ACCOUNTS = 'ACCOUNTS',
  COMPOSER = 'COMPOSER',
  NAVIGATOR = 'NAVIGATOR',
  CRM = 'CRM',
  TASKS = 'TASKS',
  SETTINGS = 'SETTINGS',
  MY_CONTACTS = 'MY_CONTACTS'
}

export enum EmailMode {
  STRATEGIC = 'STRATEGIC',
  OPERATIONAL = 'OPERATIONAL',
  TECHNICAL = 'TECHNICAL'
}

export type StepType = 'EMAIL' | 'LINKEDIN' | 'CALL' | 'SCRUB';

export interface InteractionLog {
  id: string;
  status: string;
  remarks: string;
  timestamp: string;
  nextCallDate?: string;
}

export interface Lead {
  id: string;
  ownerId?: string;
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  email: string;
  phone?: string;
  status: 'verified' | 'broken' | 'pending';
  department: string;
  relevanceScore: number;
  hierarchyLevel: string;
  logs?: InteractionLog[];
  calculatedScore?: number;
  isEnriched?: boolean;
  confidenceScore?: number; // 0-10 scale
  sourceEvidence?: string;   // snippet or URL where name was found
  verificationStatus?: 'neural_prediction' | 'grounded_fact';
  booleanQueryUsed?: string; // Boolean query executed for this lead
}

export interface ManualEmailContext {
  recipientName: string;
  recipientEmail: string;
  designation: string;
  companyName: string;
  topic: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface CompanyInfo {
  name: string;
  domain?: string; // Official corporate domain
  summary: string;
  sisterCompanies: string[];
  turnover: string;
  industry: string;
  headquarters: string;
  groundingSources?: GroundingSource[];
}

export interface SavedAccount {
  ownerId: string;
  companyInfo: CompanyInfo;
  leads: Lead[];
  lastUpdated: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  linkedLeadId?: string;
  type?: StepType;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'manager';
  password?: string;
}

export interface TeamStats {
  subsidiary: string;
  winRate: number;
  leadsScrubbed: number;
  avgResponseTime: string;
}

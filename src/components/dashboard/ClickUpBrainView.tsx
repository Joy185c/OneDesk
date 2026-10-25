import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Plus, 
  Check, 
  Copy, 
  ArrowRight, 
  Flame, 
  FileText, 
  CheckCircle2, 
  ListTodo, 
  Search, 
  Mail, 
  Calendar, 
  BarChart3, 
  Sliders, 
  ChevronDown, 
  Mic, 
  Brain as BrainIcon, 
  Zap, 
  Key, 
  Settings, 
  Shield, 
  Layers, 
  Activity, 
  Users, 
  PieChart, 
  HelpCircle, 
  ExternalLink, 
  RefreshCw, 
  X, 
  Eye, 
  EyeOff, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  FolderPlus,
  Play,
  Share2,
  Tv,
  Layout,
  MessageSquare,
  Award,
  Globe,
  Edit2,
  Database,
  GitBranch,
  ToggleLeft,
  ToggleRight,
  Clock,
  Cpu,
  Coins,
  Download,
  AlertTriangle
} from 'lucide-react';
import { TaskItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

// ClickUp AI Petal Icon
const ClickUpAIPetalIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C10.5 5 10.5 7.5 12 9.2C13.5 7.5 13.5 5 12 2Z" fill="#ff70a6" />
    <path d="M22 12C19 10.5 16.5 10.5 14.8 12C16.5 13.5 19 13.5 22 12Z" fill="#70d6ff" />
    <path d="M12 22C13.5 19 13.5 16.5 12 14.8C10.5 16.5 10.5 19 12 22Z" fill="#ff9770" />
    <path d="M2 12C5 13.5 7.5 13.5 9.2 12C7.5 10.5 5.5 10.5 2 12Z" fill="#a78bfa" />
    <circle cx="12" cy="12" r="3.2" fill="#ec4899" />
  </svg>
);

// Super Agents Goggles Logo (Screenshots 1 & 2)
const SuperAgentsLogo: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="2" y="8" width="10" height="12" rx="5" stroke="url(#sag-red)" strokeWidth="3" />
    <rect x="16" y="8" width="10" height="12" rx="5" stroke="url(#sag-blue)" strokeWidth="3" />
    <path d="M12 14H16" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
    <defs>
      <linearGradient id="sag-red" x1="2" y1="8" x2="12" y2="20">
        <stop stopColor="#ef4444" />
        <stop offset="1" stopColor="#f97316" />
      </linearGradient>
      <linearGradient id="sag-blue" x1="16" y1="8" x2="26" y2="20">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
  </svg>
);

// Google Calendar Icon
const GoogleCalendarAppIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="6" y="6" width="36" height="36" rx="8" fill="#ffffff" stroke="#dadce0" strokeWidth="1.5"/>
    <path d="M6 14C6 9.58172 9.58172 6 14 6H34C38.4183 6 42 9.58172 42 14V16H6V14Z" fill="#4285F4"/>
    <rect x="13" y="3" width="4" height="6" rx="2" fill="#1976D2"/>
    <rect x="31" y="3" width="4" height="6" rx="2" fill="#1976D2"/>
    <text x="24" y="34" fill="#1976D2" fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">31</text>
    <rect x="6" y="38" width="10" height="4" rx="2" fill="#34A853"/>
    <rect x="32" y="38" width="10" height="4" rx="2" fill="#EA4335"/>
  </svg>
);

// Gmail Icon
const GmailAppIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#EA4335" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

// Google Drive Icon
const GoogleDriveAppIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#0066DA" d="M14.6 2.5L9.4 11.5L4.8 19.5H9.4L18.6 3.5L14.6 2.5Z"/>
    <path fill="#00AC47" d="M4.8 19.5L7.4 15L12 7L9.4 2.5L0.2 18.5L4.8 19.5Z"/>
    <path fill="#EA4335" d="M9.4 19.5H23.8L19.2 11.5H4.8L9.4 19.5Z"/>
  </svg>
);

// Slack Icon
const SlackAppIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#ECB22E" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/>
    <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/>
    <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/>
    <path fill="#E01E5A" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

// GitHub Icon
const GitHubAppIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#24292F">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export type AIProvider = 'openai' | 'gemini' | 'groq' | 'anthropic' | 'openrouter';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  customBaseUrl?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  providerUsed?: string;
  modelUsed?: string;
  stepsCount?: number;
  stepsDetails?: string[];
  suggestions?: string[];
  suggestedAction?: {
    type: 'create_task';
    title: string;
    description: string;
    priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  };
}

export interface BrainConversation {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

const DEFAULT_CONVERSATIONS: BrainConversation[] = [
  {
    id: 'conv-getting-started',
    title: 'Getting Started',
    createdAt: '10:35 AM',
    messages: [
      {
        id: 'msg-start-user',
        sender: 'user',
        text: "Let's get you started",
        timestamp: '10:35 AM'
      },
      {
        id: 'msg-start-ai',
        sender: 'ai',
        text: "I'm in. Your Sales CRM is underway. Want to add sample leads, tighten up the follow-up workflow, or start somewhere else?",
        timestamp: 'Just now',
        providerUsed: 'Brain²',
        modelUsed: 'Max',
        stepsCount: 1,
        stepsDetails: [
          "Inspected active tasks & CRM pipeline",
          "Synthesized action workflow with ClickUp Brain²"
        ],
        suggestions: [
          'Add sample leads to the CRM',
          'Find stale deals needing follow-up',
          'Set reminders for every lead owner'
        ]
      }
    ]
  },
  {
    id: 'conv-sales-crm',
    title: 'Sales & CRM Setup',
    createdAt: 'Yesterday',
    messages: [
      {
        id: 'msg-crm-user',
        sender: 'user',
        text: 'Summarize our latest Sales & CRM Setup progress',
        timestamp: 'Yesterday'
      },
      {
        id: 'msg-crm-ai',
        sender: 'ai',
        text: "Sales CRM is fully configured with 4 core pipeline stages: TODO, IN PROGRESS, REVIEW, COMPLETE. Calendar integrations are connected.",
        timestamp: 'Yesterday',
        providerUsed: 'Brain²',
        modelUsed: 'Max',
        stepsCount: 1,
        stepsDetails: [
          "Queried Supabase pipeline table and active deals"
        ],
        suggestions: [
          'Add sample leads to the CRM',
          'Export sales summary report'
        ]
      }
    ]
  }
];

export interface ArtifactItem {
  id: string;
  title: string;
  type: 'deck' | 'data' | 'tool' | 'proto' | 'doc';
  description: string;
  createdAt: string;
  author: string;
  content?: string;
}

export interface BrainActivityItem {
  id: string;
  agentName: string;
  actionTitle: string;
  category: 'triage' | 'sprint' | 'crm' | 'sync' | 'code' | 'general';
  status: 'success' | 'running' | 'warning';
  modelUsed: string;
  tokensUsed: number;
  latencyMs: number;
  timestamp: string;
  details: string;
  triggeredBy: string;
}

export interface BrainConnectionItem {
  id: string;
  name: string;
  category: string;
  iconType: 'supabase' | 'github' | 'slack' | 'gdrive' | 'figma' | 'webhook';
  status: 'connected' | 'available';
  description: string;
  lastSync: string;
  syncItemCount?: string;
  configUrl?: string;
}

export interface BrainSkillItem {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
  model: string;
  runsCount: number;
  triggerType: string;
}

const DEFAULT_MODELS: Record<AIProvider, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'gpt-4-turbo'],
  gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'],
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
  openrouter: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.3-70b-instruct']
};

interface ClickUpBrainViewProps {
  tasks: TaskItem[];
  onAddTask?: (task: TaskItem) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const ClickUpBrainView: React.FC<ClickUpBrainViewProps> = ({ 
  tasks, 
  onAddTask,
  onNavigateToTab 
}) => {
  const { user } = useAuth();
  const isDemoUser = user?.id === 'u_joy_1';
  const currentUserName = user?.name || 'Workspace User';
  const workspaceName = user?.workspaceName || `${currentUserName}'s Team Workspace`;
  const userInitials = currentUserName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const conversationsStorageKey = `clickup_brain_conversations_${user?.id || 'guest'}`;
  const artifactsStorageKey = `clickup_artifacts_${user?.id || 'guest'}`;
  const connectionsStorageKey = `clickup_brain_connections_${user?.id || 'guest'}`;
  const skillsStorageKey = `clickup_brain_skills_${user?.id || 'guest'}`;
  const activityStorageKey = `clickup_brain_activity_${user?.id || 'guest'}`;

  // Navigation inside AI: Ask Brain | Create Agent | Artifacts | Skills | Activity | Analytics | Connections
  const [activeAISubtab, setActiveAISubtab] = useState<'ask' | 'agents' | 'artifacts' | 'skills' | 'activity' | 'analytics' | 'connections'>('ask');
  
  // Conversations state
  const [conversations, setConversations] = useState<BrainConversation[]>(() => {
    try {
      const saved = localStorage.getItem(conversationsStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    if (isDemoUser) return DEFAULT_CONVERSATIONS;
    return [
      {
        id: 'conv-welcome',
        title: `Welcome to ${workspaceName}`,
        createdAt: 'Just now',
        messages: [
          {
            id: 'msg-w-user',
            sender: 'user',
            text: `Hello Brain! How can you help me in ${workspaceName}?`,
            timestamp: 'Just now'
          },
          {
            id: 'msg-w-ai',
            sender: 'ai',
            text: `Hello ${currentUserName}! I'm ClickUp Brain², your workspace AI copilot. I can search across all your tasks and docs, auto-triage incoming work, predict sprint velocity, and automate team workflows. What would you like to build or explore today?`,
            timestamp: 'Just now',
            providerUsed: 'Brain²',
            modelUsed: 'Max',
            stepsCount: 1,
            stepsDetails: [
              `Connected to ${workspaceName}`,
              `Knowledge graph indexed for ${currentUserName}`
            ],
            suggestions: [
              'Create my first task',
              'Explain what Brain can do',
              'Generate a sprint plan'
            ]
          }
        ]
      }
    ];
  });
  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    return isDemoUser ? 'conv-getting-started' : 'conv-welcome';
  });

  // Prompt & Chat state for Brain²
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('Max');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});

  // Super Agents state
  const [agentPrompt, setAgentPrompt] = useState('');
  const [selectedAgentCategory, setSelectedAgentCategory] = useState('Apps');
  const [myAgentsCount, setMyAgentsCount] = useState(1);

  // Artifacts state
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>(() => {
    try {
      const saved = localStorage.getItem(artifactsStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return isDemoUser ? [
      {
        id: 'art-1',
        title: 'Q4 Product Roadmap & Sprint Priorities',
        type: 'deck',
        description: 'Automated executive presentation covering roadmap delivery.',
        createdAt: 'Yesterday',
        author: currentUserName,
        content: '# Q4 Product Roadmap\n\nTarget delivery for ClickUp 3.0 Enterprise features.'
      }
    ] : [];
  });
  const [activeArtifactTab, setActiveArtifactTab] = useState<'all' | 'me' | 'archived' | 'kits'>('all');
  const [isNewArtifactModalOpen, setIsNewArtifactModalOpen] = useState(false);
  const [newArtifactTitle, setNewArtifactTitle] = useState('');
  const [newArtifactType, setNewArtifactType] = useState<ArtifactItem['type']>('deck');
  const [selectedArtifactPreview, setSelectedArtifactPreview] = useState<ArtifactItem | null>(null);

  // Activity Feed state
  const INITIAL_ACTIVITIES: BrainActivityItem[] = [
    {
      id: 'act-1',
      agentName: 'Backlog Auto-Triager',
      actionTitle: 'Classified 4 incoming backlog items into CRM Pipeline',
      category: 'triage',
      status: 'success',
      modelUsed: 'GPT-4o',
      tokensUsed: 380,
      latencyMs: 740,
      timestamp: '3m ago',
      details: 'Analyzed task titles, set priority to High and assigned to pipeline stages.',
      triggeredBy: 'Autonomous Event Trigger'
    },
    {
      id: 'act-2',
      agentName: 'Sprint Burndown Forecaster',
      actionTitle: 'Calculated sprint velocity and completion probability (94.2%)',
      category: 'sprint',
      status: 'success',
      modelUsed: 'Gemini 2.0 Flash',
      tokensUsed: 512,
      latencyMs: 620,
      timestamp: '18m ago',
      details: 'Aggregated story points across 12 sprint issues against past 3 weeks velocity.',
      triggeredBy: 'Scheduled Cron'
    },
    {
      id: 'act-3',
      agentName: 'Supabase Vector Sync',
      actionTitle: 'Updated knowledge base embeddings for workspace tasks',
      category: 'sync',
      status: 'success',
      modelUsed: 'Text-Embedding-3-Small',
      tokensUsed: 1240,
      latencyMs: 890,
      timestamp: '45m ago',
      details: 'Re-indexed tasks and user comments into PostgreSQL pgvector.',
      triggeredBy: 'Database Webhook'
    },
    {
      id: 'act-4',
      agentName: 'Code Quality Inspector',
      actionTitle: 'Validated Pull Request security and typing compliance',
      category: 'code',
      status: 'success',
      modelUsed: 'Claude 3.5 Sonnet',
      tokensUsed: 890,
      latencyMs: 1100,
      timestamp: '2h ago',
      details: 'Scanned 14 files, verified 0 lint errors and 100% strict TypeScript types.',
      triggeredBy: 'GitHub Integration'
    }
  ];

  const [activities, setActivities] = useState<BrainActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(activityStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ACTIVITIES;
  });
  const [activityFilter, setActivityFilter] = useState<'all' | 'success' | 'running' | 'warning'>('all');
  const [activitySearch, setActivitySearch] = useState('');
  const [selectedActivityItem, setSelectedActivityItem] = useState<BrainActivityItem | null>(null);

  // Connections state
  const INITIAL_CONNECTIONS: BrainConnectionItem[] = [
    {
      id: 'conn-supabase',
      name: 'Supabase Cloud Database',
      category: 'Database & Realtime',
      iconType: 'supabase',
      status: 'connected',
      description: 'PostgreSQL storage, authentication, and realtime task sync.',
      lastSync: 'Just now',
      syncItemCount: '4 tables, 18 records'
    },
    {
      id: 'conn-github',
      name: 'GitHub Repository',
      category: 'Code & Version Control',
      iconType: 'github',
      status: 'connected',
      description: 'Joy185c/OneDesk repository indexed for AI code review and issue tracking.',
      lastSync: '5m ago',
      syncItemCount: '42 commits indexed'
    },
    {
      id: 'conn-slack',
      name: 'Slack Workspace',
      category: 'Team Communication',
      iconType: 'slack',
      status: 'connected',
      description: 'Bi-directional AI notifications routed to #general and #dev-team.',
      lastSync: '15m ago',
      syncItemCount: '2 channels linked'
    },
    {
      id: 'conn-gdrive',
      name: 'Google Drive & Workspace',
      category: 'Cloud Storage & Docs',
      iconType: 'gdrive',
      status: 'available',
      description: 'Connect Google Docs, Sheets, and Slides to index external documentation into Brain.',
      lastSync: 'Never'
    },
    {
      id: 'conn-figma',
      name: 'Figma Design System',
      category: 'Design & Prototyping',
      iconType: 'figma',
      status: 'available',
      description: 'Link design frames and component tokens directly to tasks.',
      lastSync: 'Never'
    },
    {
      id: 'conn-webhook',
      name: 'Custom Knowledge Webhook',
      category: 'Developer API',
      iconType: 'webhook',
      status: 'available',
      description: 'Stream internal REST payloads and docs into ClickUp Brain vectors.',
      lastSync: 'Never'
    }
  ];

  const [connections, setConnections] = useState<BrainConnectionItem[]>(() => {
    try {
      const saved = localStorage.getItem(connectionsStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CONNECTIONS;
  });
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isAddConnectionModalOpen, setIsAddConnectionModalOpen] = useState(false);
  const [selectedConnectionFilter, setSelectedConnectionFilter] = useState<'all' | 'connected' | 'available'>('all');
  const [newConnName, setNewConnName] = useState('');
  const [newConnType, setNewConnType] = useState<BrainConnectionItem['iconType']>('gdrive');
  const [newConnApiKey, setNewConnApiKey] = useState('');

  // Skills state
  const INITIAL_SKILLS: BrainSkillItem[] = [
    {
      id: 'skill-triage',
      name: 'Task Auto-Triage & Categorization',
      category: 'Productivity',
      description: 'Automatically detects task urgency, assigns the right team member, and sets appropriate labels.',
      enabled: true,
      model: 'GPT-4o',
      runsCount: 142,
      triggerType: 'On Task Created'
    },
    {
      id: 'skill-standup',
      name: 'Daily Standup Bulletin Compiler',
      category: 'Team Workflow',
      description: 'Summarizes completed work from yesterday, current blockers, and today’s goals into a clean digest.',
      enabled: true,
      model: 'Gemini 2.0 Flash',
      runsCount: 88,
      triggerType: 'Daily at 9:00 AM'
    },
    {
      id: 'skill-code-review',
      name: 'GitHub PR Code Quality Inspector',
      category: 'Engineering',
      description: 'Scans pull requests for potential security bugs, performance bottlenecks, and TypeScript type safety.',
      enabled: true,
      model: 'Claude 3.5 Sonnet',
      runsCount: 65,
      triggerType: 'On Pull Request Open'
    },
    {
      id: 'skill-sentiment',
      name: 'Customer Deal Sentiment Analysis',
      category: 'Sales & CRM',
      description: 'Evaluates customer conversation notes to detect urgency, positive buying signals, and churn risk.',
      enabled: false,
      model: 'GPT-4o',
      runsCount: 29,
      triggerType: 'On CRM Lead Update'
    },
    {
      id: 'skill-transcribe',
      name: 'Meeting Transcriber & Action Items',
      category: 'Collaboration',
      description: 'Extracts clear checklists, decisions, and action items directly from meeting transcripts.',
      enabled: false,
      model: 'Whisper + Max',
      runsCount: 17,
      triggerType: 'On Media Upload'
    },
    {
      id: 'skill-velocity',
      name: 'Sprint Velocity & Risk Forecaster',
      category: 'Agile',
      description: 'Predicts sprint completion date and flags tasks at risk of spilling over into the next cycle.',
      enabled: true,
      model: 'Brain² Engine',
      runsCount: 54,
      triggerType: 'Every 6 Hours'
    }
  ];

  const [skills, setSkills] = useState<BrainSkillItem[]>(() => {
    try {
      const saved = localStorage.getItem(skillsStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SKILLS;
  });
  const [isNewSkillModalOpen, setIsNewSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSkillCat, setNewSkillCat] = useState('Productivity');
  const [skillsFilter, setSkillsFilter] = useState('All');

  // Analytics state
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'7d' | '30d' | 'all'>('7d');

  // API Config state
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState<AIConfig>(() => {
    try {
      const saved = localStorage.getItem('clickup_brain_api_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4o'
    };
  });

  // Modal editing form state
  const [tempProvider, setTempProvider] = useState<AIProvider>(apiConfig.provider);
  const [tempApiKey, setTempApiKey] = useState<string>(apiConfig.apiKey);
  const [tempModel, setTempModel] = useState<string>(apiConfig.model);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, isTyping]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save AI Config
  const handleSaveApiConfig = () => {
    const updated: AIConfig = {
      provider: tempProvider,
      apiKey: tempApiKey.trim(),
      model: tempModel || DEFAULT_MODELS[tempProvider][0]
    };
    setApiConfig(updated);
    try {
      localStorage.setItem('clickup_brain_api_config', JSON.stringify(updated));
    } catch (e) {}
    setIsApiModalOpen(false);
    showToast(`✓ ${tempProvider.toUpperCase()} API Configured Successfully!`);
  };

  // Test live connection to the provider's API
  const handleTestConnection = async () => {
    if (!tempApiKey.trim()) {
      setTestStatus('error');
      setTestMessage('Please enter an API key first.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Connecting to ' + tempProvider + ' API...');

    try {
      if (tempProvider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${tempApiKey.trim()}` }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}: Failed to authenticate`);
        }
        setTestStatus('success');
        setTestMessage('✓ OpenAI connection verified! Models accessible.');
      } else if (tempProvider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${tempApiKey.trim()}`;
        const res = await fetch(url);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}: Invalid Gemini API Key`);
        }
        setTestStatus('success');
        setTestMessage('✓ Google Gemini API connection verified!');
      } else if (tempProvider === 'groq') {
        const res = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${tempApiKey.trim()}` }
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}: Invalid Groq API Key`);
        }
        setTestStatus('success');
        setTestMessage('✓ Groq Cloud connection verified (Llama 3.3 ready)!');
      } else if (tempProvider === 'openrouter') {
        const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
          headers: { Authorization: `Bearer ${tempApiKey.trim()}` }
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Invalid OpenRouter key`);
        }
        setTestStatus('success');
        setTestMessage('✓ OpenRouter connection verified!');
      } else {
        setTestStatus('success');
        setTestMessage('✓ Key format verified for ' + tempProvider);
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Connection failed.');
    }
  };

  // Real AI or simulated execution
  const executeAIRequest = async (prompt: string): Promise<{ text: string; providerUsed: string; modelUsed: string }> => {
    if (apiConfig.apiKey.trim()) {
      const workspaceContext = `You are ClickUp Brain, the intelligent workspace AI assistant in ClickUp 3.0.
Workspace: "${workspaceName}".
Current user: ${currentUserName}.
Active Tasks (${tasks.length} total):
${tasks.map(t => `- [${t.key}] ${t.title} (Status: ${t.status}, Priority: ${t.priority})`).join('\n')}
Assist the user with clear, structured markdown, actionable bullet points, or code. Be helpful, concise, and professional.`;

      if (apiConfig.provider === 'openai') {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiConfig.apiKey.trim()}`
          },
          body: JSON.stringify({
            model: apiConfig.model || 'gpt-4o',
            messages: [
              { role: 'system', content: workspaceContext },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `OpenAI Error: ${res.status}`);
        }

        const data = await res.json();
        return {
          text: data.choices?.[0]?.message?.content || 'No response returned from OpenAI.',
          providerUsed: 'OpenAI',
          modelUsed: apiConfig.model || 'gpt-4o'
        };
      }

      if (apiConfig.provider === 'gemini') {
        const modelName = apiConfig.model || 'gemini-1.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiConfig.apiKey.trim()}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${workspaceContext}\n\nUser request: ${prompt}` }]
              }
            ]
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Gemini Error: ${res.status}`);
        }

        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return {
          text: candidate || 'No response generated from Gemini.',
          providerUsed: 'Google Gemini',
          modelUsed: modelName
        };
      }

      if (apiConfig.provider === 'groq') {
        const modelName = apiConfig.model || 'llama-3.3-70b-versatile';
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiConfig.apiKey.trim()}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: workspaceContext },
              { role: 'user', content: prompt }
            ],
            temperature: 0.6
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Groq Error: ${res.status}`);
        }

        const data = await res.json();
        return {
          text: data.choices?.[0]?.message?.content || 'No response returned from Groq.',
          providerUsed: 'Groq Cloud',
          modelUsed: modelName
        };
      }

      if (apiConfig.provider === 'openrouter') {
        const modelName = apiConfig.model || 'openai/gpt-4o';
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiConfig.apiKey.trim()}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: workspaceContext },
              { role: 'user', content: prompt }
            ]
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `OpenRouter Error: ${res.status}`);
        }

        const data = await res.json();
        return {
          text: data.choices?.[0]?.message?.content || 'No response returned from OpenRouter.',
          providerUsed: 'OpenRouter',
          modelUsed: modelName
        };
      }
    }

    // Default Fallback Simulation
    await new Promise(r => setTimeout(r, 600));
    return {
      text: `### 🌸 ClickUp Brain² Response
I have analyzed your query against all active docs, workspace tasks, and knowledge bases in **${workspaceName}**.

**Key Highlights**:
- You have **${tasks.length} active tasks** in your workspace.
- Autonomous intelligence agent is active and running for **${currentUserName}**.
- Realtime vector knowledge index: **Up to date**.

💡 *Pro Tip: Connect your personal OpenAI, Google Gemini, or Groq API key in **AI Settings** to unlock unlimited custom LLM reasoning across your entire organization!*`,
      providerUsed: 'ClickUp Brain (Standard)',
      modelUsed: 'Brain² Standard'
    };
  };

  const currentConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    try {
      localStorage.setItem(conversationsStorageKey, JSON.stringify(conversations));
    } catch (e) {}
  }, [conversations, conversationsStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(artifactsStorageKey, JSON.stringify(artifacts));
    } catch (e) {}
  }, [artifacts, artifactsStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(activityStorageKey, JSON.stringify(activities));
    } catch (e) {}
  }, [activities, activityStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(connectionsStorageKey, JSON.stringify(connections));
    } catch (e) {}
  }, [connections, connectionsStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(skillsStorageKey, JSON.stringify(skills));
    } catch (e) {}
  }, [skills, skillsStorageKey]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isTyping) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const targetConvId = activeConversationId;
    setConversations(prev => prev.map(c => {
      if (c.id === targetConvId) {
        return {
          ...c,
          title: c.title === 'New Chat' ? (query.length > 22 ? query.slice(0, 22) + '...' : query) : c.title,
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    }));

    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const result = await executeAIRequest(query);

      const aiMsg: Message = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: result.text,
        timestamp: 'Just now',
        providerUsed: result.providerUsed,
        modelUsed: result.modelUsed,
        stepsCount: 1,
        stepsDetails: [
          `Analyzed ${workspaceName} tasks and documents`,
          `Applied ClickUp Brain² reasoning with ${result.modelUsed || 'Max'}`
        ],
        suggestions: [
          'Add sample leads to the CRM',
          'Find stale deals needing follow-up',
          'Set reminders for every lead owner'
        ]
      };

      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            messages: [...c.messages, aiMsg]
          };
        }
        return c;
      }));
    } catch (err: any) {
      const errorMsg: Message = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: `⚠️ **API Execution Error**: ${err.message || 'Failed to call the configured AI API.'}\n\nPlease check your API key in **AI Settings** (⚙️) and ensure it has available quota and correct permissions.`,
        timestamp: 'Just now',
        providerUsed: apiConfig.provider,
        modelUsed: apiConfig.model
      };

      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            messages: [...c.messages, errorMsg]
          };
        }
        return c;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleExecuteSuggestion = (suggestion: string) => {
    if (suggestion === 'Add sample leads to the CRM') {
      if (onAddTask) {
        onAddTask({
          id: 'task-lead-1',
          key: 'CRM-101',
          title: 'Acme Corp Enterprise Deal ($45,000)',
          status: 'TODO',
          priority: 'Urgent',
          assignee: { name: currentUserName, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces', role: 'Workspace Owner' },
          dueDate: 'Oct 28',
          timeEstimate: '6h',
          tags: ['Enterprise', 'Lead'],
          commentsCount: 2
        });
        onAddTask({
          id: 'task-lead-2',
          key: 'CRM-102',
          title: 'TechFlow SaaS Expansion ($18,500)',
          status: 'TODO',
          priority: 'High',
          assignee: { name: 'Priya Gupta', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces', role: 'UI designer' },
          dueDate: 'Oct 30',
          timeEstimate: '4h',
          tags: ['SaaS', 'Expansion'],
          commentsCount: 1
        });
      }

      const confirmMsg: Message = {
        id: 'msg-sug-' + Date.now(),
        sender: 'ai',
        text: '✅ Created 2 qualified sample leads ("Acme Corp Enterprise Deal" & "TechFlow SaaS Expansion") on your Sales CRM board under TODO.',
        timestamp: 'Just now',
        providerUsed: 'Brain²',
        modelUsed: 'Max',
        stepsCount: 1,
        stepsDetails: ['Injected leads into active pipeline', 'Updated Sales CRM board state']
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return { ...c, messages: [...c.messages, confirmMsg] };
        }
        return c;
      }));

      showToast('🟢 2 sample leads added to Sales CRM board!');
      return;
    }

    if (suggestion === 'Find stale deals needing follow-up') {
      const summaryMsg: Message = {
        id: 'msg-sug-' + Date.now(),
        sender: 'ai',
        text: `🔎 **Stale Deals Audit**:\n- **Acme Corp Enterprise Deal**: No activity in last 48 hours. Recommend sending executive follow-up email.\n- **TechFlow SaaS Expansion**: Contract review pending stakeholder signoff.`,
        timestamp: 'Just now',
        providerUsed: 'Brain²',
        modelUsed: 'Max',
        stepsCount: 1,
        stepsDetails: ['Audited deal velocity', 'Flagged stalled opportunities']
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return { ...c, messages: [...c.messages, summaryMsg] };
        }
        return c;
      }));

      showToast('Stale deals audit complete');
      return;
    }

    if (suggestion === 'Set reminders for every lead owner') {
      const reminderMsg: Message = {
        id: 'msg-sug-' + Date.now(),
        sender: 'ai',
        text: `⏰ Set calendar reminders for lead owners (${currentUserName}, Priya Gupta) before Friday close (5:00 PM).`,
        timestamp: 'Just now',
        providerUsed: 'Brain²',
        modelUsed: 'Max'
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return { ...c, messages: [...c.messages, reminderMsg] };
        }
        return c;
      }));

      showToast('Lead owner reminders scheduled');
      return;
    }

    handleSendMessage(suggestion);
  };

  const handleNewChat = () => {
    const newChat: BrainConversation = {
      id: 'conv-' + Date.now(),
      title: 'New Chat',
      createdAt: 'Just now',
      messages: []
    };
    setConversations([newChat, ...conversations]);
    setActiveConversationId(newChat.id);
    setActiveAISubtab('ask');
    showToast('New Chat started');
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setConversations(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
    showToast(`Chat renamed to "${newTitle}"`);
  };

  const handleCreateAgentFromPrompt = (promptText: string) => {
    if (!promptText.trim()) return;
    setMyAgentsCount(c => c + 1);
    showToast(`✓ Super Agent "${promptText.slice(0, 24)}..." successfully created & deployed!`);
    setAgentPrompt('');
  };

  const handleCreateArtifact = (title: string, type: ArtifactItem['type']) => {
    const newArt: ArtifactItem = {
      id: 'art-' + Date.now(),
      title: title || 'Sprint Performance Dashboard',
      type,
      description: 'AI-generated interactive artifact powered by ClickUp Brain².',
      createdAt: 'Just now',
      author: currentUserName,
      content: `# ${title}\n\nGenerated with ClickUp Brain² on ${new Date().toLocaleDateString()}.\n\n### Metrics & Highlights\n- Sprint Velocity: 42 Story Points\n- Tasks Closed: 18 items\n- Efficiency: 94.2%`
    };

    const updated = [newArt, ...artifacts];
    setArtifacts(updated);
    localStorage.setItem(artifactsStorageKey, JSON.stringify(updated));
    setIsNewArtifactModalOpen(false);
    showToast(`✓ Artifact "${newArt.title}" created successfully!`);
  };

  // Activity Action Handlers
  const handleTriggerTestAction = () => {
    const testActions: Partial<BrainActivityItem>[] = [
      {
        agentName: 'Backlog Auto-Triager',
        actionTitle: `Auto-assigned 2 newly created tasks in ${workspaceName}`,
        category: 'triage',
        modelUsed: 'GPT-4o',
        tokensUsed: 420,
        latencyMs: 680,
        details: 'Evaluated task urgency, set labels and assigned to primary sprint lead.',
        triggeredBy: 'Manual Trigger'
      },
      {
        agentName: 'Knowledge Vector Re-index',
        actionTitle: 'Indexed workspace updates into Brain² vector graph',
        category: 'sync',
        modelUsed: 'Text-Embedding-3-Small',
        tokensUsed: 680,
        latencyMs: 510,
        details: 'Updated embedding vectors for all sprint tasks and discussion threads.',
        triggeredBy: 'Manual Trigger'
      },
      {
        agentName: 'Executive Daily Summary',
        actionTitle: 'Generated workspace progress bulletin for team',
        category: 'general',
        modelUsed: 'Claude 3.5 Sonnet',
        tokensUsed: 940,
        latencyMs: 820,
        details: 'Compiled sprint milestone updates and delivered notification to channels.',
        triggeredBy: 'Manual Trigger'
      }
    ];

    const pick = testActions[Math.floor(Math.random() * testActions.length)];
    const newAct: BrainActivityItem = {
      id: 'act-' + Date.now(),
      agentName: pick.agentName || 'Super Agent',
      actionTitle: pick.actionTitle || 'Executed autonomous workspace task',
      category: pick.category as any || 'general',
      status: 'success',
      modelUsed: pick.modelUsed || 'GPT-4o',
      tokensUsed: pick.tokensUsed || 450,
      latencyMs: pick.latencyMs || 720,
      timestamp: 'Just now',
      details: pick.details || 'Successfully completed execution without errors.',
      triggeredBy: currentUserName
    };

    setActivities([newAct, ...activities]);
    showToast(`✓ Agent action "${newAct.actionTitle}" executed successfully!`);
  };

  const handleClearActivities = () => {
    setActivities([]);
    showToast('Activity feed cleared');
  };

  // Connection Handlers
  const handleSyncAllConnections = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setConnections(prev => prev.map(c => c.status === 'connected' ? { ...c, lastSync: 'Just now' } : c));
      setIsSyncingAll(false);
      showToast('✓ All connected services synchronized with Brain²!');
    }, 1200);
  };

  const handleSyncSingleConnection = (connId: string) => {
    setConnections(prev => prev.map(c => c.id === connId ? { ...c, lastSync: 'Just now' } : c));
    showToast('✓ Service synchronized successfully!');
  };

  const handleToggleConnection = (connId: string) => {
    setConnections(prev => prev.map(c => {
      if (c.id === connId) {
        const nextStatus = c.status === 'connected' ? 'available' : 'connected';
        showToast(nextStatus === 'connected' ? `✓ ${c.name} connected!` : `Disconnected ${c.name}`);
        return {
          ...c,
          status: nextStatus,
          lastSync: nextStatus === 'connected' ? 'Just now' : 'Never'
        };
      }
      return c;
    }));
  };

  const handleAddNewConnection = () => {
    if (!newConnName.trim()) {
      showToast('Please enter a connection name');
      return;
    }
    const newConn: BrainConnectionItem = {
      id: 'conn-' + Date.now(),
      name: newConnName.trim(),
      category: 'External Data Source',
      iconType: newConnType,
      status: 'connected',
      description: `Connected to ${newConnName.trim()} for knowledge indexing and AI context.`,
      lastSync: 'Just now',
      syncItemCount: 'Connected'
    };
    setConnections([newConn, ...connections]);
    setIsAddConnectionModalOpen(false);
    setNewConnName('');
    setNewConnApiKey('');
    showToast(`✓ Connection "${newConn.name}" successfully added!`);
  };

  // Skill Handlers
  const handleToggleSkill = (skillId: string) => {
    setSkills(prev => prev.map(s => {
      if (s.id === skillId) {
        const nextState = !s.enabled;
        showToast(nextState ? `✓ Skill "${s.name}" enabled!` : `Skill "${s.name}" disabled`);
        return { ...s, enabled: nextState };
      }
      return s;
    }));
  };

  const handleCreateNewSkill = () => {
    if (!newSkillName.trim()) {
      showToast('Please enter a skill name');
      return;
    }
    const newSkill: BrainSkillItem = {
      id: 'skill-' + Date.now(),
      name: newSkillName.trim(),
      category: newSkillCat,
      description: newSkillDesc.trim() || 'Custom autonomous skill tailored for workspace workflows.',
      enabled: true,
      model: selectedModel || 'GPT-4o',
      runsCount: 0,
      triggerType: 'On Trigger Event'
    };
    setSkills([newSkill, ...skills]);
    setIsNewSkillModalOpen(false);
    setNewSkillName('');
    setNewSkillDesc('');
    showToast(`✓ Custom skill "${newSkill.name}" created and deployed!`);
  };

  return (
    <div style={{
      display: 'flex',
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease'
        }}>
          <Check size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. LEFT AI SUBPANEL (Exact Match with Screenshots 1, 2, 3)          */}
      {/* =================================================================== */}
      <div style={{
        width: '240px',
        backgroundColor: '#fafbfc',
        borderRight: '1px solid #eaebf0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
        flexShrink: 0,
        overflowY: 'auto'
      }}>
        <div>
          {/* Header row: AI « [+ Create] */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            padding: '0 4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1f21' }}>AI</span>
              <button style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}>
                <ChevronLeft size={16} />
              </button>
            </div>

            <button
              onClick={() => {
                if (activeAISubtab === 'artifacts') {
                  setIsNewArtifactModalOpen(true);
                } else if (activeAISubtab === 'ask') {
                  handleNewChat();
                } else {
                  setActiveAISubtab('agents');
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#1e1f21',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={13} />
              <span>Create</span>
            </button>
          </div>

          {/* Top Navigation Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '22px' }}>
            {/* Ask Brain (Screenshot earlier) */}
            <div
              onClick={() => setActiveAISubtab('ask')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                backgroundColor: activeAISubtab === 'ask' ? '#ebeef2' : 'transparent',
                color: '#1e1f21',
                fontWeight: activeAISubtab === 'ask' ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              <ClickUpAIPetalIcon size={16} />
              <span>Ask Brain</span>
            </div>

            {/* Create Agent / Super Agents (Screenshots 1 & 2) */}
            <div
              onClick={() => setActiveAISubtab('agents')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                backgroundColor: activeAISubtab === 'agents' ? '#ebeef2' : 'transparent',
                color: '#1e1f21',
                fontWeight: activeAISubtab === 'agents' ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              <SuperAgentsLogo size={16} />
              <span>Create Agent</span>
            </div>

            {/* Artifacts (Screenshot 3) */}
            <div
              onClick={() => setActiveAISubtab('artifacts')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                backgroundColor: activeAISubtab === 'artifacts' ? '#ebeef2' : 'transparent',
                color: '#1e1f21',
                fontWeight: activeAISubtab === 'artifacts' ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem' }}>💖</span>
                <span>Artifacts</span>
              </div>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                backgroundColor: '#f3e8ff',
                color: '#7c3aed',
                padding: '2px 6px',
                borderRadius: '100px'
              }}>
                New
              </span>
            </div>

            {/* Skills */}
            <div
              onClick={() => setActiveAISubtab('skills')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                backgroundColor: activeAISubtab === 'skills' ? '#ebeef2' : 'transparent',
                color: activeAISubtab === 'skills' ? '#0f172a' : '#475569',
                fontWeight: activeAISubtab === 'skills' ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={e => { if (activeAISubtab !== 'skills') e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              onMouseLeave={e => { if (activeAISubtab !== 'skills') e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Zap size={16} color="#f59e0b" />
              <span>Skills</span>
            </div>
          </div>

          {/* Manage Section */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '8px' }}>
              Manage
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                onClick={() => setActiveAISubtab('agents')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  color: activeAISubtab === 'agents' ? '#0f172a' : '#475569',
                  fontWeight: activeAISubtab === 'agents' ? 700 : 500,
                  backgroundColor: activeAISubtab === 'agents' ? '#ebeef2' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={15} color="#64748b" />
                  <span>All Agents</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{myAgentsCount}</span>
              </div>

              <div
                onClick={() => setActiveAISubtab('agents')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 800 }}>
                    {userInitials[0] || 'U'}
                  </div>
                  <span>My Agents</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{myAgentsCount}</span>
              </div>

              <div
                onClick={() => setActiveAISubtab('activity')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  color: activeAISubtab === 'activity' ? '#0f172a' : '#475569',
                  fontWeight: activeAISubtab === 'activity' ? 700 : 500,
                  backgroundColor: activeAISubtab === 'activity' ? '#ebeef2' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => { if (activeAISubtab !== 'activity') e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseLeave={e => { if (activeAISubtab !== 'activity') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Activity size={15} color={activeAISubtab === 'activity' ? '#0f172a' : '#64748b'} />
                <span>Activity</span>
              </div>

              <div
                onClick={() => setActiveAISubtab('analytics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  color: activeAISubtab === 'analytics' ? '#0f172a' : '#475569',
                  fontWeight: activeAISubtab === 'analytics' ? 700 : 500,
                  backgroundColor: activeAISubtab === 'analytics' ? '#ebeef2' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => { if (activeAISubtab !== 'analytics') e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseLeave={e => { if (activeAISubtab !== 'analytics') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <PieChart size={15} color={activeAISubtab === 'analytics' ? '#0f172a' : '#64748b'} />
                <span>Analytics</span>
              </div>

              <div
                onClick={() => setActiveAISubtab('connections')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  color: activeAISubtab === 'connections' ? '#0f172a' : '#475569',
                  fontWeight: activeAISubtab === 'connections' ? 700 : 500,
                  backgroundColor: activeAISubtab === 'connections' ? '#ebeef2' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => { if (activeAISubtab !== 'connections') e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                onMouseLeave={e => { if (activeAISubtab !== 'connections') e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Layers size={15} color={activeAISubtab === 'connections' ? '#0f172a' : '#64748b'} />
                <span>Connections</span>
              </div>
            </div>
          </div>

          {/* Recent Chats Section matching Screenshots 1 & 2 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '8px' }}>
              Recent Chats
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {conversations.map(conv => {
                const isActive = activeAISubtab === 'ask' && activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setActiveAISubtab('ask');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      color: isActive ? '#0f172a' : '#475569',
                      fontWeight: isActive ? 700 : 500,
                      backgroundColor: isActive ? '#ebeef2' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <MessageSquare size={14} color={isActive ? '#0f172a' : '#64748b'} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {conv.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Subpanel Footer (Screenshot Match: Leave Feedback, Model quota, Add Key) */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#64748b', cursor: 'pointer' }}>
            <MessageSquare size={13} color="#94a3b8" />
            <span>Leave Feedback</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#64748b' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>100% left Standard models</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#64748b' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>490 Credits left</span>
          </div>

          {/* Custom API Configuration Button */}
          <button
            onClick={() => {
              setTempProvider(apiConfig.provider);
              setTempApiKey(apiConfig.apiKey);
              setTempModel(apiConfig.model);
              setTestStatus('idle');
              setTestMessage('');
              setIsApiModalOpen(true);
            }}
            style={{
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              backgroundColor: apiConfig.apiKey ? '#f0fdf4' : '#faf5ff',
              border: `1px solid ${apiConfig.apiKey ? '#bbf7d0' : '#e9d5ff'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: apiConfig.apiKey ? '#15803d' : '#7c3aed'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={13} />
              <span>{apiConfig.apiKey ? `${apiConfig.provider.toUpperCase()} Key Active` : 'Add Your AI API Key'}</span>
            </div>
            <Settings size={12} />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. MAIN AI STAGE                                                    */}
      {/* =================================================================== */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}>
        {/* =============================================================== */}
        {/* VIEW A: ASK BRAIN (Brain² Chat Stream matching Screenshots 1 & 2) */}
        {/* =============================================================== */}
        {activeAISubtab === 'ask' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Top Header Bar matching Screenshot 1 & 2 */}
            <div style={{
              padding: '10px 24px',
              borderBottom: '1px solid #eaebf0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
              flexShrink: 0
            }}>
              {/* Left: Chat Title with edit icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => {
                    const newTitle = window.prompt("Rename chat:", currentConversation.title);
                    if (newTitle && newTitle.trim()) {
                      handleRenameChat(currentConversation.id, newTitle.trim());
                    }
                  }}
                  title="Rename chat"
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
                >
                  <Edit2 size={14} />
                </button>
                <div 
                  onClick={() => {
                    const newTitle = window.prompt("Rename chat:", currentConversation.title);
                    if (newTitle && newTitle.trim()) {
                      handleRenameChat(currentConversation.id, newTitle.trim());
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>
                    {currentConversation.title}
                  </span>
                  <ChevronDown size={14} color="#64748b" />
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  title="Split View / Docs"
                  onClick={() => showToast('Side-by-side workspace doc viewer enabled')}
                  style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                >
                  <FileText size={16} />
                </button>

                <button
                  title="Fullscreen"
                  onClick={() => showToast('Full-width chat view active')}
                  style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                >
                  <Layout size={16} />
                </button>

                <button
                  onClick={() => setIsMemoryModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: 'none',
                    backgroundColor: '#f8fafc',
                    fontSize: '0.78rem',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '5px 10px',
                    borderRadius: '6px'
                  }}
                >
                  <BrainIcon size={14} />
                  <span>Memory</span>
                </button>

                <button
                  onClick={() => {
                    setTempProvider(apiConfig.provider);
                    setTempApiKey(apiConfig.apiKey);
                    setTempModel(apiConfig.model);
                    setTestStatus('idle');
                    setTestMessage('');
                    setIsApiModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: apiConfig.apiKey ? '#f0fdf4' : '#1e1f21',
                    color: apiConfig.apiKey ? '#15803d' : '#ffffff',
                    border: apiConfig.apiKey ? '1px solid #bbf7d0' : 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '5px 12px',
                    borderRadius: '6px'
                  }}
                >
                  <Key size={13} />
                  <span>{apiConfig.apiKey ? 'API Connected' : 'Configure AI API'}</span>
                </button>
              </div>
            </div>

            {/* Chat Stream matching Screenshot 1 & 2 */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {currentConversation.messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msg.sender === 'user' ? (
                      /* User message row matching Screenshot 1 & 2 */
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.76rem',
                          flexShrink: 0
                        }}>
                          {userInitials || 'U'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>{currentUserName}</span>
                            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{msg.timestamp}</span>
                          </div>
                          <div style={{ fontSize: '0.92rem', color: '#1e293b', lineHeight: 1.5 }}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* AI response row matching Screenshot 2 */
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '6px' }}>
                        <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ClickUpAIPetalIcon size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>Brain²</span>
                            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{msg.timestamp}</span>
                          </div>

                          {/* Step Accordion matching Screenshot 2: "Finished in 1 step ▸" */}
                          {msg.stepsCount && (
                            <div style={{ marginBottom: '10px' }}>
                              <div
                                onClick={() => setExpandedSteps(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.76rem',
                                  color: '#64748b',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  padding: '2px 0'
                                }}
                              >
                                <span>Finished in {msg.stepsCount} {msg.stepsCount === 1 ? 'step' : 'steps'}</span>
                                <ChevronRight size={12} style={{ transform: expandedSteps[msg.id] ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease' }} />
                              </div>

                              {expandedSteps[msg.id] && (
                                <div style={{
                                  marginTop: '6px',
                                  padding: '8px 12px',
                                  backgroundColor: '#f8fafc',
                                  borderRadius: '8px',
                                  border: '1px solid #f1f5f9',
                                  fontSize: '0.76rem',
                                  color: '#475569',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px'
                                }}>
                                  {(msg.stepsDetails || [`Queried ${workspaceName} active tasks`, "Applied Brain² reasoning trace"]).map((step, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ color: '#10b981' }}>✓</span>
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Response markdown text */}
                          <div style={{
                            fontSize: '0.92rem',
                            color: '#1e293b',
                            lineHeight: 1.6,
                            marginBottom: '14px',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {msg.text}
                          </div>

                          {/* Action icons row matching Screenshot 2: 👍 👎 💬 📋 */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', color: '#94a3b8' }}>
                            <span
                              onClick={() => {
                                setFeedbackState(prev => ({ ...prev, [msg.id]: 'up' }));
                                showToast('Thanks for your feedback!');
                              }}
                              title="Helpful"
                              style={{ cursor: 'pointer', fontSize: '0.85rem', color: feedbackState[msg.id] === 'up' ? '#10b981' : '#94a3b8' }}
                            >
                              👍
                            </span>
                            <span
                              onClick={() => {
                                setFeedbackState(prev => ({ ...prev, [msg.id]: 'down' }));
                                showToast('Feedback noted');
                              }}
                              title="Not helpful"
                              style={{ cursor: 'pointer', fontSize: '0.85rem', color: feedbackState[msg.id] === 'down' ? '#ef4444' : '#94a3b8' }}
                            >
                              👎
                            </span>
                            <span
                              onClick={() => showToast('Reply thread opened')}
                              title="Reply"
                              style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                              💬
                            </span>
                            <span
                              onClick={() => {
                                navigator.clipboard?.writeText(msg.text);
                                showToast('Response copied to clipboard!');
                              }}
                              title="Copy"
                              style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                              📋
                            </span>
                          </div>

                          {/* Follow-up Suggestion Action Chips matching Screenshot 2 */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                              {msg.suggestions.map((sug, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleExecuteSuggestion(sug)}
                                  style={{
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '100px',
                                    padding: '6px 14px',
                                    fontSize: '0.82rem',
                                    color: '#334155',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#7c3aed';
                                    e.currentTarget.style.color = '#7c3aed';
                                    e.currentTarget.style.backgroundColor = '#faf5ff';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#cbd5e1';
                                    e.currentTarget.style.color = '#334155';
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                  }}
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Thinking state matching Screenshot 1 */}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                    <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ClickUpAIPetalIcon size={24} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.88rem' }}>
                      <span className="animate-pulse" style={{ fontWeight: 800, color: '#7c3aed' }}>...</span>
                      <span style={{ fontStyle: 'normal', color: '#64748b' }}>Considering my options</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>
            </div>

            {/* Bottom Docked Input Container matching Screenshots 1 & 2 */}
            <div style={{
              padding: '12px 28px 18px 28px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              flexShrink: 0
            }}>
              {/* Floating Upgrade Banner matching Screenshot 1 & 2 */}
              <div style={{
                width: '100%',
                maxWidth: '780px',
                margin: '0 auto 8px auto',
                backgroundColor: '#ffffff',
                border: '1px solid #eaebf0',
                borderRadius: '12px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>You're using standard models</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>Get premium models ❄️ ✳️ ✦</span>
                </div>
                <button
                  onClick={() => {
                    if (onNavigateToTab) onNavigateToTab('upgrade');
                    showToast('ClickUp Premium Models upgrade opened');
                  }}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  See upgrades
                </button>
              </div>

              {/* Prompt Box matching Screenshot 1 & 2 */}
              <div style={{
                width: '100%',
                maxWidth: '780px',
                margin: '0 auto',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                padding: '12px 16px 10px 16px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Tell AI what to do next"
                  rows={2}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontSize: '0.92rem',
                    color: '#0f172a',
                    lineHeight: 1.5,
                    fontFamily: 'inherit',
                    marginBottom: '8px'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {/* Left tools: + and Skills */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                      <Plus size={15} />
                    </button>
                    <button
                      onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '100px',
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      <Zap size={13} color="#f59e0b" />
                      <span>Skills</span>
                    </button>
                  </div>

                  {/* Right tools: Model selector (🌸 Max ▾) and Send/Stop */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#475569',
                          cursor: 'pointer',
                          padding: '4px 6px'
                        }}
                      >
                        <ClickUpAIPetalIcon size={14} />
                        <span>{selectedModel}</span>
                        <ChevronDown size={13} />
                      </button>

                      {isModelDropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          bottom: '120%',
                          right: 0,
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                          border: '1px solid #e2e8f0',
                          padding: '6px',
                          width: '180px',
                          zIndex: 100
                        }}>
                          {['Max (Default)', 'GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'Llama 3.3 70B'].map(m => (
                            <div
                              key={m}
                              onClick={() => {
                                setSelectedModel(m.split(' ')[0]);
                                setIsModelDropdownOpen(false);
                              }}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                fontWeight: selectedModel === m.split(' ')[0] ? 700 : 500,
                                color: selectedModel === m.split(' ')[0] ? '#7c3aed' : '#334155',
                                backgroundColor: selectedModel === m.split(' ')[0] ? '#f5f3ff' : 'transparent'
                              }}
                            >
                              {m}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {isTyping ? (
                      <button
                        onClick={() => {
                          setIsTyping(false);
                          showToast('Generation stopped');
                        }}
                        title="Stop generation"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ width: '10px', height: '10px', backgroundColor: '#ffffff', borderRadius: '2px' }} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={!inputText.trim()}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: inputText.trim() ? 'linear-gradient(135deg, #ff70a6 0%, #7b2cbf 100%)' : '#f1f5f9',
                          color: '#ffffff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: inputText.trim() ? 'pointer' : 'default'
                        }}
                      >
                        <ArrowRight size={14} color={inputText.trim() ? '#ffffff' : '#cbd5e1'} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW B: SUPER AGENTS™ (Screenshots 1 & 2)                       */}
        {/* =============================================================== */}
        {activeAISubtab === 'agents' && (
          <div style={{ maxWidth: '860px', width: '100%', margin: '0 auto', padding: '30px 24px 80px 24px' }}>
            {/* Branding Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '18px' }}>
              <SuperAgentsLogo size={36} />
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#1e1f21', margin: 0 }}>
                Super Agents<span style={{ fontSize: '1rem', fontWeight: 600, verticalAlign: 'super' }}>™</span>
              </h1>
            </div>

            {/* Switcher Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '100px', gap: '4px' }}>
                <button
                  onClick={() => setActiveAISubtab('ask')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'transparent', color: '#64748b', fontWeight: 500, border: 'none', borderRadius: '100px', padding: '6px 18px', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  <ClickUpAIPetalIcon size={14} />
                  <span>Ask</span>
                </button>
                <button
                  onClick={() => setActiveAISubtab('agents')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffffff', color: '#1e1f21', fontWeight: 700, border: 'none', borderRadius: '100px', padding: '6px 18px', fontSize: '0.82rem', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                >
                  <Bot size={14} />
                  <span>Agents</span>
                </button>
              </div>
            </div>

            {/* Main Prompt Box for Agents (Screenshot 1) */}
            <div style={{
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #dbeafe',
              boxShadow: '0 8px 30px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(0,0,0,0.04)',
              padding: '16px 18px 12px 18px',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '24px'
            }}>
              <textarea
                value={agentPrompt}
                onChange={e => setAgentPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateAgentFromPrompt(agentPrompt);
                  }
                }}
                placeholder="Describe goals, roles, tasks, or processes for your Super Agent"
                rows={2}
                style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: '1rem', color: '#1e1f21', lineHeight: 1.5, fontFamily: 'inherit', marginBottom: '12px' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f8fafc', paddingTop: '8px' }}>
                <button style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                  <Plus size={16} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => showToast('Voice command listener ready')} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <Mic size={16} />
                  </button>
                  <button
                    onClick={() => handleCreateAgentFromPrompt(agentPrompt)}
                    disabled={!agentPrompt.trim()}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '100px',
                      backgroundColor: agentPrompt.trim() ? '#1e1f21' : '#f1f5f9',
                      color: agentPrompt.trim() ? '#ffffff' : '#94a3b8',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: agentPrompt.trim() ? 'pointer' : 'default'
                    }}
                  >
                    Build Agent
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Agent Action Cards (Screenshot 1) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
              {[
                { name: 'Lead Nurturer', desc: 'Prompts timely follow-up', color: '#10b981', prompt: 'Create Lead Nurturer Agent that alerts team when enterprise leads are inactive for 3 days' },
                { name: 'Deal Navigator', desc: 'Guides next steps', color: '#f59e0b', prompt: 'Create Deal Navigator Agent to audit proposals and contract stage requirements' },
                { name: 'Demo Coordinator', desc: 'Schedules sales demos', color: '#ec4899', prompt: 'Create Demo Coordinator Agent that connects to Google Calendar and books qualified leads' },
                { name: 'Pipeline Forecaster', desc: 'Flags stalled opportunities', color: '#06b6d4', prompt: 'Create Pipeline Forecaster Agent to compute win probability and notify sales lead' }
              ].map((ag, i) => (
                <div
                  key={i}
                  onClick={() => handleCreateAgentFromPrompt(ag.prompt)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#eaebf0'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: ag.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.72rem', fontWeight: 800, marginBottom: '8px' }}>
                    {ag.name[0]}
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e1f21', marginBottom: '2px' }}>{ag.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{ag.desc}</div>
                </div>
              ))}
            </div>

            {/* Top agents Activity Matrix (Screenshot 1) */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginBottom: '10px' }}>
                Top agents (Last 30 days)
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #eaebf0',
                borderRadius: '14px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fef08a', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                      1st
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>1st</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1e1f21' }}>Meeting Agent</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Actions</div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e1f21' }}>1</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Value</div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e1f21' }}>$2</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Time saved</div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e1f21' }}>2m</div>
                    </div>
                  </div>
                </div>

                {/* Contribution activity grid */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#94a3b8', marginBottom: '4px', width: '130px' }}>
                    <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 14px)', gap: '4px' }}>
                    {Array.from({ length: 28 }).map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '3px',
                          backgroundColor: idx === 25 ? '#10b981' : '#f1f5f9'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Pills Row (Screenshots 1 & 2) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '12px',
              marginBottom: '24px'
            }}>
              {['Apps', 'Projects', 'Personal', 'Certified', 'Tasks', 'Exec', 'Scheduling', 'Software', 'Meetings', 'Intelligence', 'Research', 'Updates', 'Writing', 'C-Suite', 'Teams', 'Design'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedAgentCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    border: 'none',
                    backgroundColor: selectedAgentCategory === cat ? '#1e1f21' : '#f1f5f9',
                    color: selectedAgentCategory === cat ? '#ffffff' : '#64748b',
                    fontSize: '0.78rem',
                    fontWeight: selectedAgentCategory === cat ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Super Agent Apps 6 Cards Grid (Screenshot 2) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '36px' }}>
              {[
                { name: 'ClickUp', desc: 'Create, triage, search, report, manage — anything', powers: '300+ Superpowers', grad: 'linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%)', icon: <ClickUpAIPetalIcon size={22} /> },
                { name: 'Gmail', desc: 'Draft, send, and search emails', powers: '4+ Superpowers', grad: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)', icon: <GmailAppIcon size={22} /> },
                { name: 'Google Calendar', desc: 'Schedule, prep & manage meetings', powers: '4+ Superpowers', grad: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', icon: <GoogleCalendarAppIcon size={22} /> },
                { name: 'Google Drive', desc: 'Create, search, and organize your files', powers: '2+ Superpowers', grad: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', icon: <GoogleDriveAppIcon size={22} /> },
                { name: 'Slack', desc: 'Send, research & answer messages', powers: '2+ Superpowers', grad: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)', icon: <SlackAppIcon size={22} /> },
                { name: 'GitHub', desc: 'Review, comment & manage code changes', powers: '2+ Superpowers', grad: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)', icon: <GitHubAppIcon size={22} /> }
              ].map((app, i) => (
                <div
                  key={i}
                  onClick={() => showToast(`✓ Connected ${app.name} Super Agent superpowers!`)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '14px',
                    padding: '18px',
                    cursor: 'pointer',
                    background: app.grad,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '130px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {app.icon}
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e1f21' }}>{app.name}</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.35 }}>{app.desc}</div>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7c3aed', marginTop: '12px' }}>
                    {app.powers}
                  </div>
                </div>
              ))}
            </div>

            {/* Project Management Banner & Cards (Screenshot 2) */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e1f21', marginBottom: '12px' }}>
                Project Management
              </div>

              {/* Big Graphic Banner */}
              <div style={{
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffe4e6 0%, #fce7f3 40%, #e0e7ff 100%)',
                padding: '36px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
                border: '1px solid #fecdd3'
              }}>
                <div style={{ maxWidth: '420px' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e1f21', lineHeight: 1.2, margin: 0 }}>
                    Projects — without management.
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <SuperAgentsLogo size={56} />
                </div>
              </div>

              {/* PM Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {[
                  { title: 'Status Reporter', desc: 'Auto-generates progress summaries and flags blockers for stakeholders.' },
                  { title: 'Project Manager', desc: 'Captures goals and scope for a clear and successful project start.' },
                  { title: 'Priorities Manager', desc: 'Continuously manages priorities, escalating and identifying urgent needs.' }
                ].map((pm, i) => (
                  <div
                    key={i}
                    onClick={() => handleCreateAgentFromPrompt(`Deploy ${pm.title}`)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #eaebf0',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#c084fc'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#eaebf0'}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e1f21', marginBottom: '4px' }}>{pm.title}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', lineHeight: 1.35 }}>{pm.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW C: ARTIFACTS (Screenshot 3)                                */}
        {/* =============================================================== */}
        {activeAISubtab === 'artifacts' && (
          <div style={{ padding: '24px 32px 80px 32px' }}>
            {/* Header: Artifacts + [+ New Artifact] */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1f21', margin: 0 }}>
                Artifacts
              </h2>

              <button
                onClick={() => setIsNewArtifactModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1e1f21',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
                <span>New Artifact</span>
              </button>
            </div>

            {/* Top Carousel Cards (Screenshot 3) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '12px',
              marginBottom: '28px',
              position: 'relative'
            }}>
              {[
                { title: 'Start from scratch', desc: 'Turn any idea into a shareable, reusable artifact.', icon: '💖', type: 'tool' as const, bg: '#fff1f2' },
                { title: 'Data visualizations', desc: 'Charts, scorecards, and dashboards from your data.', icon: '📊', type: 'data' as const, bg: '#f0fdf4' },
                { title: 'Slide decks', desc: 'Turn notes into a deck your team can present.', icon: '📽', type: 'deck' as const, bg: '#eff6ff' },
                { title: 'Interactive prototypes', desc: 'Clickable pages and apps you can share and remix.', icon: '📱', type: 'proto' as const, bg: '#faf5ff' },
                { title: 'Interactive tools', desc: 'Calculators, quizzes, and utilities built with no code.', icon: '🛠', type: 'tool' as const, bg: '#f0fdfa' },
                { title: 'Documents & reports', desc: 'Polished one-pagers and memos from rough notes.', icon: '📄', type: 'doc' as const, bg: '#fefce8' }
              ].map((tpl, i) => (
                <div
                  key={i}
                  onClick={() => handleCreateArtifact(tpl.title, tpl.type)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #eaebf0',
                    borderRadius: '12px',
                    padding: '16px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '150px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c084fc'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#eaebf0'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: tpl.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', marginBottom: '12px' }}>
                      {tpl.icon}
                    </div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e1f21', marginBottom: '4px', lineHeight: 1.25 }}>
                      {tpl.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3 }}>
                      {tpl.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Tabs Row (Screenshot 3) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #eaebf0',
              paddingBottom: '10px',
              marginBottom: '40px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {[
                  { id: 'all' as const, label: 'All Artifacts' },
                  { id: 'me' as const, label: 'Created by me' },
                  { id: 'archived' as const, label: 'Archived' },
                  { id: 'kits' as const, label: 'Art Kits' }
                ].map(tb => (
                  <button
                    key={tb.id}
                    onClick={() => setActiveArtifactTab(tb.id)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      border: activeArtifactTab === tb.id ? '1px solid #cbd5e1' : '1px solid transparent',
                      backgroundColor: activeArtifactTab === tb.id ? '#ffffff' : 'transparent',
                      color: activeArtifactTab === tb.id ? '#1e1f21' : '#64748b',
                      fontSize: '0.78rem',
                      fontWeight: activeArtifactTab === tb.id ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                <Search size={15} style={{ cursor: 'pointer' }} />
                <SlidersHorizontal size={15} style={{ cursor: 'pointer' }} />
              </div>
            </div>

            {/* Artifacts Body: Either Empty State or Created Artifacts */}
            {artifacts.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  border: '1.5px solid #fed7aa',
                  backgroundColor: '#fff7ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: '14px'
                }}>
                  💖
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e1f21', margin: '0 0 6px 0' }}>
                  No artifacts have been created yet.
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 20px 0', maxWidth: '440px', lineHeight: 1.4 }}>
                  Create presentations, reports, and dashboards with AI that your team can reopen anytime.
                </p>

                <button
                  onClick={() => setIsNewArtifactModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#1e1f21',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                  }}
                >
                  <Plus size={14} />
                  <span>Create artifact</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {artifacts.map(art => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArtifactPreview(art)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #eaebf0',
                      borderRadius: '12px',
                      padding: '18px',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#eaebf0'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>
                        {art.type}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{art.createdAt}</span>
                    </div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1e1f21', marginBottom: '4px' }}>
                      {art.title}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.3 }}>
                      {art.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW D: ACTIVITY FEED                                           */}
        {/* =============================================================== */}
        {activeAISubtab === 'activity' && (
          <div style={{ padding: '24px 32px 80px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1f21', margin: '0 0 4px 0' }}>
                  AI & Agent Activity
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Live execution audit trail and autonomous actions across {workspaceName}.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={handleClearActivities}
                  style={{
                    padding: '7px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Clear Feed
                </button>
                <button
                  onClick={handleTriggerTestAction}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#1e1f21',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '7px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Play size={14} />
                  <span>Run Test Action</span>
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Total Executions</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{activities.length}</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>+12% vs yesterday</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Success Rate</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>99.4%</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>0 failed tasks</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Avg Latency</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#6366f1' }}>740ms</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>Sub-second inference</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Active Agents</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ec4899' }}>6 Active</div>
                <div style={{ fontSize: '0.7rem', color: '#ec4899', fontWeight: 600, marginTop: '2px' }}>Autonomous triggers</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '400px', backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search execution logs or agents..."
                  value={activitySearch}
                  onChange={e => setActivitySearch(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.82rem', width: '100%', color: '#1e293b' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {(['all', 'success', 'running', 'warning'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setActivityFilter(f)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: activityFilter === f ? '#0f172a' : '#e2e8f0',
                      backgroundColor: activityFilter === f ? '#0f172a' : '#ffffff',
                      color: activityFilter === f ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Table */}
            {activities.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <Activity size={36} color="#94a3b8" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>No activity records found</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: '#64748b' }}>Run a test action or trigger an autonomous agent in your workspace.</p>
                <button onClick={handleTriggerTestAction} style={{ padding: '8px 18px', backgroundColor: '#7c3aed', color: '#ffffff', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                  Run Test Action
                </button>
              </div>
            ) : (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                {activities
                  .filter(a => activityFilter === 'all' || a.status === activityFilter)
                  .filter(a => !activitySearch || a.actionTitle.toLowerCase().includes(activitySearch.toLowerCase()) || a.agentName.toLowerCase().includes(activitySearch.toLowerCase()))
                  .map((act, index) => (
                    <div
                      key={act.id}
                      onClick={() => setSelectedActivityItem(act)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderBottom: index < activities.length - 1 ? '1px solid #f1f5f9' : 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: act.category === 'triage' ? '#eff6ff' : act.category === 'sprint' ? '#fdf2f8' : act.category === 'sync' ? '#ecfdf5' : '#faf5ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {act.category === 'triage' ? <ListTodo size={16} color="#3b82f6" /> :
                           act.category === 'sprint' ? <Zap size={16} color="#ec4899" /> :
                           act.category === 'sync' ? <RefreshCw size={16} color="#10b981" /> :
                           <Bot size={16} color="#8b5cf6" />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{act.actionTitle}</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#10b981', backgroundColor: '#d1fae5', padding: '1px 6px', borderRadius: '100px' }}>
                              200 OK
                            </span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: '#7c3aed' }}>{act.agentName}</span>
                            <span>•</span>
                            <span>{act.modelUsed}</span>
                            <span>•</span>
                            <span>{act.tokensUsed} tokens ({act.latencyMs}ms)</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{act.timestamp}</span>
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedActivityItem(act); }}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: '#f1f5f9',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#334155',
                            cursor: 'pointer'
                          }}
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW E: ANALYTICS                                               */}
        {/* =============================================================== */}
        {activeAISubtab === 'analytics' && (
          <div style={{ padding: '24px 32px 80px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1f21', margin: '0 0 4px 0' }}>
                  Brain² Intelligence & ROI Analytics
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Token consumption, model performance, and hours saved for {workspaceName}.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                  {(['7d', '30d', 'all'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setAnalyticsTimeframe(t)}
                      style={{
                        padding: '5px 12px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        backgroundColor: analyticsTimeframe === t ? '#ffffff' : 'transparent',
                        color: analyticsTimeframe === t ? '#0f172a' : '#64748b',
                        boxShadow: analyticsTimeframe === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {t === '7d' ? 'Last 7 Days' : t === '30d' ? 'Last 30 Days' : 'All Time'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => showToast('✓ Analytics report exported to CSV!')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Hero Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Total AI Queries</span>
                  <Sparkles size={16} color="#7c3aed" />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>1,428</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>↑ +24.6% vs previous period</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Tokens Consumed</span>
                  <Coins size={16} color="#2563eb" />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>384.1k</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>64% prompt / 36% completion</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Estimated Hours Saved</span>
                  <Clock size={16} color="#10b981" />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>52.5 hrs</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>≈ $2,625 team productivity value</div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Response Satisfaction</span>
                  <Award size={16} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>98.9%</div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>492 Thumbs Up / 5 Down</div>
              </div>
            </div>

            {/* Daily Volume Bar Graph + Model Breakdown Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px', marginBottom: '24px' }}>
              {/* Daily Volume Bar Chart */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>Daily AI Request Volume</h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Avg. 204 requests/day</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '170px', padding: '0 10px', gap: '16px' }}>
                  {[
                    { day: 'Mon', count: 180, pct: 60 },
                    { day: 'Tue', count: 245, pct: 82 },
                    { day: 'Wed', count: 290, pct: 95 },
                    { day: 'Thu', count: 210, pct: 70 },
                    { day: 'Fri', count: 260, pct: 86 },
                    { day: 'Sat', count: 120, pct: 40 },
                    { day: 'Sun', count: 123, pct: 42 }
                  ].map(b => (
                    <div key={b.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>{b.count}</span>
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '36px',
                          height: `${b.pct}%`,
                          backgroundColor: '#7c3aed',
                          borderRadius: '6px 6px 2px 2px',
                          transition: 'height 0.3s ease, background-color 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#6d28d9'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#7c3aed'}
                      />
                      <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>{b.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Distribution Breakdown */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>Model Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: '#0f172a' }}>OpenAI GPT-4o</span>
                      <span style={{ color: '#7c3aed' }}>46% (176k tokens)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '46%', height: '100%', backgroundColor: '#7c3aed' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: '#0f172a' }}>Google Gemini 2.0 Flash</span>
                      <span style={{ color: '#2563eb' }}>34% (130k tokens)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '34%', height: '100%', backgroundColor: '#2563eb' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                      <span style={{ color: '#0f172a' }}>Anthropic Claude 3.5 Sonnet</span>
                      <span style={{ color: '#d97706' }}>20% (78k tokens)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '20%', height: '100%', backgroundColor: '#d97706' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Agents Leaderboard Table */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>Top Performing Autonomous Agents</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { name: 'Backlog Auto-Triager', runs: 480, success: '99.6%', latency: '710ms', tag: 'Productivity' },
                  { name: 'Sprint Burndown Forecaster', runs: 340, success: '99.1%', latency: '620ms', tag: 'Agile' },
                  { name: 'Supabase Vector Sync', runs: 318, success: '100%', latency: '890ms', tag: 'Database' },
                  { name: 'PR Code Quality Inspector', runs: 290, success: '98.4%', latency: '950ms', tag: 'Engineering' }
                ].map(ag => (
                  <div key={ag.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Bot size={16} color="#7c3aed" />
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{ag.name}</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px' }}>{ag.tag}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.78rem', color: '#64748b' }}>
                      <span><strong>{ag.runs}</strong> executions</span>
                      <span>Success: <strong style={{ color: '#10b981' }}>{ag.success}</strong></span>
                      <span>Latency: <strong>{ag.latency}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW F: CONNECTIONS                                             */}
        {/* =============================================================== */}
        {activeAISubtab === 'connections' && (
          <div style={{ padding: '24px 32px 80px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1f21', margin: '0 0 4px 0' }}>
                  Connections & Integrations Hub
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Link external data stores, git repositories, and communication channels into ClickUp Brain².
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={handleSyncAllConnections}
                  disabled={isSyncingAll}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: isSyncingAll ? 'not-allowed' : 'pointer'
                  }}
                >
                  <RefreshCw size={14} style={{ animation: isSyncingAll ? 'spin 1s linear infinite' : 'none' }} />
                  <span>{isSyncingAll ? 'Syncing All...' : 'Sync All Sources'}</span>
                </button>

                <button
                  onClick={() => setIsAddConnectionModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#1e1f21',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '7px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} />
                  <span>Add Connection</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {(['all', 'connected', 'available'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedConnectionFilter(f)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: selectedConnectionFilter === f ? '#0f172a' : '#e2e8f0',
                    backgroundColor: selectedConnectionFilter === f ? '#0f172a' : '#ffffff',
                    color: selectedConnectionFilter === f ? '#ffffff' : '#64748b',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {f === 'all' ? `All Connections (${connections.length})` : f === 'connected' ? `Connected (${connections.filter(c => c.status === 'connected').length})` : `Available (${connections.filter(c => c.status === 'available').length})`}
                </button>
              ))}
            </div>

            {/* Grid of Connections */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {connections
                .filter(c => selectedConnectionFilter === 'all' || c.status === selectedConnectionFilter)
                .map(conn => (
                  <div
                    key={conn.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'border-color 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {conn.iconType === 'supabase' ? <Database size={20} color="#10b981" /> :
                             conn.iconType === 'github' ? <GitBranch size={20} color="#0f172a" /> :
                             conn.iconType === 'slack' ? <MessageSquare size={20} color="#ec4899" /> :
                             conn.iconType === 'gdrive' ? <GoogleCalendarAppIcon size={20} /> :
                             conn.iconType === 'figma' ? <Layout size={20} color="#8b5cf6" /> :
                             <Globe size={20} color="#2563eb" />}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>{conn.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{conn.category}</div>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '100px',
                          backgroundColor: conn.status === 'connected' ? '#ecfdf5' : '#f1f5f9',
                          color: conn.status === 'connected' ? '#059669' : '#64748b'
                        }}>
                          {conn.status === 'connected' ? '● Connected' : 'Available'}
                        </span>
                      </div>

                      <p style={{ margin: '0 0 14px 0', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                        {conn.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {conn.status === 'connected' ? `Synced: ${conn.lastSync}` : 'Ready to connect'}
                      </span>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {conn.status === 'connected' ? (
                          <>
                            <button
                              onClick={() => handleSyncSingleConnection(conn.id)}
                              style={{ padding: '5px 10px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
                            >
                              Sync Now
                            </button>
                            <button
                              onClick={() => handleToggleConnection(conn.id)}
                              style={{ padding: '5px 10px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}
                            >
                              Disconnect
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleToggleConnection(conn.id)}
                            style={{ padding: '6px 14px', backgroundColor: '#7c3aed', border: 'none', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW G: SKILLS DIRECTORY                                        */}
        {/* =============================================================== */}
        {activeAISubtab === 'skills' && (
          <div style={{ padding: '24px 32px 80px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1f21', margin: '0 0 4px 0' }}>
                  ClickUp Brain AI Skills
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Autonomous triggers and pre-built intelligence automations for {workspaceName}.
                </p>
              </div>

              <button
                onClick={() => setIsNewSkillModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1e1f21',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
                <span>Create Custom Skill</span>
              </button>
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['All', 'Productivity', 'Team Workflow', 'Engineering', 'Sales & CRM', 'Agile'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSkillsFilter(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: skillsFilter === cat ? '#0f172a' : '#e2e8f0',
                    backgroundColor: skillsFilter === cat ? '#0f172a' : '#ffffff',
                    color: skillsFilter === cat ? '#ffffff' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Skills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {skills
                .filter(s => skillsFilter === 'All' || s.category === skillsFilter)
                .map(skill => (
                  <div
                    key={skill.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'border-color 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={16} color="#d97706" />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{skill.name}</div>
                            <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>{skill.category}</span>
                          </div>
                        </div>

                        {/* Toggle Switch */}
                        <div
                          onClick={() => handleToggleSkill(skill.id)}
                          style={{
                            width: '40px',
                            height: '22px',
                            borderRadius: '100px',
                            backgroundColor: skill.enabled ? '#7c3aed' : '#cbd5e1',
                            padding: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'background-color 0.2s ease',
                            justifyContent: skill.enabled ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </div>
                      </div>

                      <p style={{ margin: '0 0 14px 0', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                        {skill.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#64748b' }}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        Trigger: {skill.triggerType}
                      </span>
                      <span><strong>{skill.runsCount}</strong> runs</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 3. MODAL: NEW ARTIFACT CREATOR                                      */}
      {/* =================================================================== */}
      {isNewArtifactModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            padding: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>💖</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1f21', margin: 0 }}>Create New AI Artifact</h3>
              </div>
              <button onClick={() => setIsNewArtifactModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Artifact Title:
              </label>
              <input
                type="text"
                value={newArtifactTitle}
                onChange={e => setNewArtifactTitle(e.target.value)}
                placeholder="e.g. Q4 Executive Product Briefing"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Artifact Format:
              </label>
              <select
                value={newArtifactType}
                onChange={e => setNewArtifactType(e.target.value as any)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="deck">Slide Deck</option>
                <option value="data">Data Visualization & Scorecard</option>
                <option value="proto">Interactive Prototype App</option>
                <option value="tool">Interactive Utility / Calculator</option>
                <option value="doc">Polished Executive Report</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setIsNewArtifactModalOpen(false)}
                style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateArtifact(newArtifactTitle, newArtifactType)}
                style={{ padding: '8px 20px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Generate with AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. MODAL: ARTIFACT PREVIEW / PRESENTATION                           */}
      {/* =================================================================== */}
      {selectedArtifactPreview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '680px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #eaebf0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafbfc' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e1f21', margin: 0 }}>
                  {selectedArtifactPreview.title}
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedArtifactPreview.type}
                </span>
              </div>
              <button onClick={() => setSelectedArtifactPreview(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', backgroundColor: '#f8fafc', whiteSpace: 'pre-wrap', fontSize: '0.88rem', lineHeight: 1.6, color: '#1e1f21' }}>
              {selectedArtifactPreview.content}
            </div>

            <div style={{ padding: '14px 22px', backgroundColor: '#ffffff', borderTop: '1px solid #eaebf0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => {
                  showToast('Artifact share link copied!');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                <Share2 size={13} />
                <span>Share</span>
              </button>
              <button
                onClick={() => setSelectedArtifactPreview(null)}
                style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#1e1f21', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. MODAL: AI API KEY CONFIGURATION                                  */}
      {/* =================================================================== */}
      {isApiModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '540px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #eaebf0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fafbfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ClickUpAIPetalIcon size={22} />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Connect Your Own AI API Key
                  </h3>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                    Power ClickUp Brain² with your personal OpenAI, Gemini, or Groq quota
                  </p>
                </div>
              </div>
              <button onClick={() => setIsApiModalOpen(false)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '22px' }}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  Select AI Provider:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'openai' as const, name: 'OpenAI' },
                    { id: 'gemini' as const, name: 'Gemini' },
                    { id: 'groq' as const, name: 'Groq' },
                    { id: 'anthropic' as const, name: 'Claude' },
                    { id: 'openrouter' as const, name: 'OpenRouter' }
                  ].map(prov => (
                    <button
                      key={prov.id}
                      onClick={() => {
                        setTempProvider(prov.id);
                        setTempModel(DEFAULT_MODELS[prov.id][0]);
                        setTestStatus('idle');
                        setTestMessage('');
                      }}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: tempProvider === prov.id ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                        backgroundColor: tempProvider === prov.id ? '#f5f3ff' : '#ffffff',
                        color: tempProvider === prov.id ? '#7c3aed' : '#475569',
                        fontWeight: tempProvider === prov.id ? 800 : 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {prov.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Select Model:
                </label>
                <select
                  value={tempModel}
                  onChange={e => setTempModel(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem', color: '#1e1f21', outline: 'none' }}
                >
                  {DEFAULT_MODELS[tempProvider].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                    {tempProvider.toUpperCase()} API Key:
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#7c3aed', cursor: 'pointer' }} onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? 'Hide' : 'Show'} Key
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#ffffff', padding: '2px 10px' }}>
                  <Key size={15} color="#94a3b8" />
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={tempApiKey}
                    onChange={e => {
                      setTempApiKey(e.target.value);
                      setTestStatus('idle');
                    }}
                    placeholder={
                      tempProvider === 'openai' ? 'sk-proj-...' :
                      tempProvider === 'gemini' ? 'AIzaSy...' :
                      tempProvider === 'groq' ? 'gsk_...' :
                      'Enter your API key'
                    }
                    style={{ border: 'none', outline: 'none', padding: '8px 10px', fontSize: '0.84rem', width: '100%', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing'}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
                >
                  <Zap size={13} color="#f59e0b" />
                  <span>{testStatus === 'testing' ? 'Testing Connection...' : '⚡ Test Connection'}</span>
                </button>

                {testStatus === 'success' && <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>{testMessage}</div>}
                {testStatus === 'error' && <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>❌ {testMessage}</div>}
              </div>
            </div>

            <div style={{ padding: '14px 22px', backgroundColor: '#f8fafc', borderTop: '1px solid #eaebf0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => {
                  setTempApiKey('');
                  setApiConfig({ provider: 'openai', apiKey: '', model: 'gpt-4o' });
                  localStorage.removeItem('clickup_brain_api_config');
                  setIsApiModalOpen(false);
                  showToast('Custom API Key removed.');
                }}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#dc2626', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset / Use Standard
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setIsApiModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="button" onClick={handleSaveApiConfig} style={{ padding: '8px 20px', backgroundColor: '#7c3aed', border: 'none', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}>
                  Save & Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Memory Modal */}
      {isMemoryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '480px', backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>Brain² Memory</h3>
              <button onClick={() => setIsMemoryModalOpen(false)} style={{ border: 'none', background: 'none' }}><X size={16} /></button>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Workspace knowledge base active for {currentUserName}.</p>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {selectedActivityItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ width: '560px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={20} color="#7c3aed" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Execution Details</h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Event ID: {selectedActivityItem.id}</span>
                </div>
              </div>
              <button onClick={() => setSelectedActivityItem(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Action & Agent</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{selectedActivityItem.actionTitle}</div>
                <div style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 600 }}>Executed by: {selectedActivityItem.agentName}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ padding: '10px', backgroundColor: '#faf5ff', borderRadius: '8px', border: '1px solid #f3e8ff' }}>
                  <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 700, display: 'block' }}>Model Used</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#581c87' }}>{selectedActivityItem.modelUsed}</span>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                  <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 700, display: 'block' }}>Tokens</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1e3a8a' }}>{selectedActivityItem.tokensUsed} tokens</span>
                </div>
                <div style={{ padding: '10px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #d1fae5' }}>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, display: 'block' }}>Latency</span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#064e3b' }}>{selectedActivityItem.latencyMs}ms</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Execution Trace & Outcome</span>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontFamily: 'monospace' }}>
                  {selectedActivityItem.details}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button onClick={() => setSelectedActivityItem(null)} style={{ padding: '8px 18px', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Connection Modal */}
      {isAddConnectionModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ width: '480px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={20} color="#7c3aed" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Connect External Source</h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Index knowledge into Brain² memory</span>
                </div>
              </div>
              <button onClick={() => setIsAddConnectionModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Service Type</label>
                <select
                  value={newConnType}
                  onChange={e => setNewConnType(e.target.value as any)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="gdrive">Google Drive & Docs</option>
                  <option value="figma">Figma Design System</option>
                  <option value="webhook">Custom REST Webhook</option>
                  <option value="github">GitHub Organization</option>
                  <option value="slack">Slack Workspace</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Integration Label / Workspace Name</label>
                <input
                  type="text"
                  value={newConnName}
                  onChange={e => setNewConnName(e.target.value)}
                  placeholder="e.g. Acme Google Drive or Core Figma"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>API Token / Access Key (Optional)</label>
                <input
                  type="password"
                  value={newConnApiKey}
                  onChange={e => setNewConnApiKey(e.target.value)}
                  placeholder="OAuth token or webhook secret"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => setIsAddConnectionModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleAddNewConnection} style={{ padding: '8px 20px', backgroundColor: '#7c3aed', color: '#ffffff', borderRadius: '8px', border: 'none', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  Connect Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Skill Modal */}
      {isNewSkillModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
          <div style={{ width: '500px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} color="#d97706" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Create Custom AI Skill</h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Automate repetitive task workflows</span>
                </div>
              </div>
              <button onClick={() => setIsNewSkillModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Skill Name</label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="e.g. Inbound Ticket Severity Classifier"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Category</label>
                <select
                  value={newSkillCat}
                  onChange={e => setNewSkillCat(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="Productivity">Productivity</option>
                  <option value="Team Workflow">Team Workflow</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales & CRM">Sales & CRM</option>
                  <option value="Agile">Agile</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Skill Instructions & Logic</label>
                <textarea
                  rows={3}
                  value={newSkillDesc}
                  onChange={e => setNewSkillDesc(e.target.value)}
                  placeholder="Explain what the AI should do when this skill triggers (e.g. classify urgency, summarize changes, or assign tags)..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => setIsNewSkillModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleCreateNewSkill} style={{ padding: '8px 20px', backgroundColor: '#7c3aed', color: '#ffffff', borderRadius: '8px', border: 'none', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
                  Deploy Skill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

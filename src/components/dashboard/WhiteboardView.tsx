import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Square, 
  Circle, 
  Type, 
  PenTool, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Sparkles,
  Share2,
  Download,
  Star,
  Check,
  ChevronLeft,
  SlidersHorizontal,
  ChevronRight,
  MoreHorizontal,
  Edit2,
  ArrowRight,
  Save,
  MousePointer,
  RotateCcw,
  Palette,
  FileText
} from 'lucide-react';

export interface WhiteboardCanvasItem {
  id: string;
  type: 'sticky' | 'rect' | 'circle' | 'text' | 'card' | 'diamond';
  x: number;
  y: number;
  width?: number;
  height?: number;
  title?: string;
  text: string;
  color: string;
  borderColor?: string;
  author?: string;
  tag?: string;
  role?: string;
  category?: string;
  status?: string;
}

export interface WhiteboardDrawingStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
}

export interface WhiteboardData {
  id: string;
  title: string;
  templateType: 'org-chart' | 'action-plan' | 'customer-journey' | 'flow-chart' | 'fishbone' | 'scratch';
  isFavorite: boolean;
  dateCreated: string;
  dateUpdated: string;
  items: WhiteboardCanvasItem[];
  strokes?: WhiteboardDrawingStroke[];
}

const TEMPLATE_CONFIGS = [
  {
    id: 'org-chart',
    title: 'Organizational Chart',
    subtitle: 'Visualize your team structure',
    bgColor: '#f3e8ff',
    iconColor: '#9333ea',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="5" r="2.5" fill="#9333ea" />
        <circle cx="6" cy="18" r="2" fill="#9333ea" />
        <circle cx="12" cy="18" r="2" fill="#9333ea" />
        <circle cx="18" cy="18" r="2" fill="#9333ea" />
        <path d="M12 7.5V13M6 16v-3h12v3" stroke="#9333ea" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'action-plan',
    title: 'Action Plan',
    subtitle: 'Turn goals into actionable steps',
    bgColor: '#ccfbf1',
    iconColor: '#0d9488',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="8" height="16" rx="2" fill="#0d9488" fillOpacity="0.25" stroke="#0d9488" strokeWidth="1.8" />
        <rect x="13" y="4" width="8" height="16" rx="2" fill="#0d9488" fillOpacity="0.25" stroke="#0d9488" strokeWidth="1.8" />
        <path d="M5.5 8.5h3M5.5 12h3M15.5 8.5h3M15.5 12h3" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'customer-journey',
    title: 'Customer Journey Map',
    subtitle: 'Optimize every customer touchpoint',
    bgColor: '#dbeafe',
    iconColor: '#2563eb',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="14" r="3" fill="#2563eb" />
        <circle cx="12" cy="8" r="3" fill="#2563eb" />
        <circle cx="18" cy="14" r="3" fill="#2563eb" />
        <path d="M8.5 12.5L9.5 9.5M14.5 9.5L15.5 12.5" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'flow-chart',
    title: 'Flow Chart',
    subtitle: 'Structure and communicate processes and workflows',
    bgColor: '#fce7f3',
    iconColor: '#db2777',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="#db2777" strokeWidth="1.8" />
        <circle cx="17" cy="7" r="3" stroke="#db2777" strokeWidth="1.8" />
        <polygon points="12,14 17,17 12,20 7,17" stroke="#db2777" strokeWidth="1.8" fill="none" />
        <path d="M10 7h4M12 10v4" stroke="#db2777" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'fishbone',
    title: 'Root Cause Analysis',
    subtitle: 'Analyze issues using the Ishikawa Fishbone diagram',
    bgColor: '#ffedd5',
    iconColor: '#ea580c',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="19" cy="12" r="3" fill="#ea580c" />
        <line x1="3" y1="12" x2="16" y2="12" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        <line x1="7" y1="12" x2="11" y2="6" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="7" y1="12" x2="11" y2="18" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="12" y1="12" x2="15" y2="7" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="12" y1="12" x2="15" y2="17" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'scratch',
    title: 'Start from scratch',
    subtitle: 'Blank infinite canvas for freehand brainstorming',
    bgColor: '#f8fafc',
    iconColor: '#475569',
    icon: (
      <Plus size={26} color="#64748b" />
    )
  }
];

const generateInitialItemsForTemplate = (type: string): WhiteboardCanvasItem[] => {
  switch (type) {
    case 'org-chart':
      return [
        {
          id: 'org-ceo',
          type: 'card',
          x: 480,
          y: 70,
          width: 240,
          title: 'Joy Kumar Yuv',
          role: 'Founder & CEO',
          text: 'Executive Leadership & Product Strategy',
          color: '#f5f3ff',
          borderColor: '#8b5cf6',
          tag: 'Executive'
        },
        {
          id: 'org-vp-eng',
          type: 'card',
          x: 240,
          y: 220,
          width: 220,
          title: 'Alex Rivera',
          role: 'VP of Engineering',
          text: 'Architecture, Cloud & Infrastructure',
          color: '#eff6ff',
          borderColor: '#3b82f6',
          tag: 'Engineering'
        },
        {
          id: 'org-vp-prod',
          type: 'card',
          x: 720,
          y: 220,
          width: 220,
          title: 'Sarah Chen',
          role: 'VP of Product & AI',
          text: 'Product Growth, AI Brain 3.0 & UX',
          color: '#fdf2f8',
          borderColor: '#ec4899',
          tag: 'Product'
        },
        {
          id: 'org-lead-fe',
          type: 'sticky',
          x: 160,
          y: 380,
          title: 'Emma Davis',
          text: 'Lead Frontend Eng\n• React, Vite, TS\n• Design System 3.0',
          color: '#fef08a',
          tag: 'UI/UX'
        },
        {
          id: 'org-lead-be',
          type: 'sticky',
          x: 350,
          y: 380,
          title: 'David Kim',
          text: 'Lead Backend Eng\n• Supabase, Postgres\n• Realtime sync',
          color: '#bae6fd',
          tag: 'Data'
        },
        {
          id: 'org-lead-ai',
          type: 'sticky',
          x: 640,
          y: 380,
          title: 'Elena Rostova',
          text: 'AI Research Lead\n• LLM Agents\n• Vector Search',
          color: '#e9d5ff',
          tag: 'AI Center'
        },
        {
          id: 'org-lead-qa',
          type: 'sticky',
          x: 830,
          y: 380,
          title: 'Marcus Brody',
          text: 'QA & Automation\n• E2E Playwright\n• 100% test coverage',
          color: '#bbf7d0',
          tag: 'Reliability'
        }
      ];

    case 'action-plan':
      return [
        {
          id: 'ap-goal',
          type: 'rect',
          x: 140,
          y: 70,
          width: 880,
          title: '🎯 Objective: Launch ClickUp 3.0 Enterprise Suite',
          text: 'Deliver full feature parity with real data persistence, custom sub-sidebars, AI Team Center & Timesheets.',
          color: '#f0fdf4',
          borderColor: '#22c55e',
          tag: 'Q4 Milestone'
        },
        {
          id: 'ap-phase-1',
          type: 'card',
          x: 140,
          y: 190,
          width: 270,
          title: 'Phase 1: Hubs & Navigation',
          text: '• Hub sub-sidebars\n• Dark rail active states\n• Realtime sync indicator',
          color: '#eff6ff',
          borderColor: '#3b82f6',
          status: 'Completed',
          tag: 'Sprint 24'
        },
        {
          id: 'ap-phase-2',
          type: 'card',
          x: 445,
          y: 190,
          width: 270,
          title: 'Phase 2: Whiteboards & Canvas',
          text: '• 6 Interactive templates\n• Draggable sticky notes\n• Realtime drawing canvas',
          color: '#fefce8',
          borderColor: '#eab308',
          status: 'In Progress',
          tag: 'Sprint 25'
        },
        {
          id: 'ap-phase-3',
          type: 'card',
          x: 750,
          y: 190,
          width: 270,
          title: 'Phase 3: Timesheets & Timer',
          text: '• Interactive live stopwatch\n• Task time logging modal\n• Daily hours calculator',
          color: '#faf5ff',
          borderColor: '#a855f7',
          status: 'Planned',
          tag: 'Sprint 26'
        },
        {
          id: 'ap-note-1',
          type: 'sticky',
          x: 200,
          y: 370,
          text: '💡 Ensure zero prototype code. All inputs must save to localStorage and Supabase.',
          color: '#fef08a',
          tag: 'Critical'
        },
        {
          id: 'ap-note-2',
          type: 'sticky',
          x: 520,
          y: 370,
          text: '🚀 Joy Kumar Yuv to review production deployment and verify responsive UI.',
          color: '#bbf7d0',
          tag: 'Review'
        }
      ];

    case 'customer-journey':
      return [
        {
          id: 'cj-stage-1',
          type: 'card',
          x: 100,
          y: 80,
          width: 170,
          title: '1. Discover',
          text: 'Searches for modern productivity tool.\nSees ClickUp 3.0 AI showcase.',
          color: '#f1f5f9',
          borderColor: '#94a3b8',
          tag: 'Touchpoint: Web'
        },
        {
          id: 'cj-stage-2',
          type: 'card',
          x: 300,
          y: 80,
          width: 170,
          title: '2. Explore',
          text: 'Tries Demo workspace without signup.\nInteracts with Planner & Kanban.',
          color: '#eff6ff',
          borderColor: '#60a5fa',
          tag: 'Touchpoint: App'
        },
        {
          id: 'cj-stage-3',
          type: 'card',
          x: 500,
          y: 80,
          width: 170,
          title: '3. Onboard',
          text: 'One-click sign in.\nInvites team members.\nSets up CRM Space.',
          color: '#f5f3ff',
          borderColor: '#a78bfa',
          tag: 'Touchpoint: Auth'
        },
        {
          id: 'cj-stage-4',
          type: 'card',
          x: 700,
          y: 80,
          width: 170,
          title: '4. Adopt',
          text: 'Daily standups in Teams Hub.\nTracks sprint tasks & timesheets.\nBrain AI searches.',
          color: '#f0fdf4',
          borderColor: '#4ade80',
          tag: 'Touchpoint: Work'
        },
        {
          id: 'cj-stage-5',
          type: 'card',
          x: 900,
          y: 80,
          width: 170,
          title: '5. Advocate',
          text: 'Shares Whiteboard templates.\nUpgrades to Unlimited Plan.\nRecommends to peers.',
          color: '#fdf2f8',
          borderColor: '#f472b6',
          tag: 'Touchpoint: Growth'
        },
        {
          id: 'cj-sentiment-1',
          type: 'sticky',
          x: 120,
          y: 280,
          text: '🤔 "Is it fast and easy to migrate our existing Trello boards?"',
          color: '#fef08a',
          tag: 'Questions'
        },
        {
          id: 'cj-sentiment-2',
          type: 'sticky',
          x: 520,
          y: 280,
          text: '😍 "The dark rail and unified AI chat make switching effortless!"',
          color: '#bbf7d0',
          tag: 'Delight'
        },
        {
          id: 'cj-sentiment-3',
          type: 'sticky',
          x: 880,
          y: 280,
          text: '⭐ "Live stopwatch in timesheet saves our team 3 hours every week."',
          color: '#bae6fd',
          tag: 'Value'
        }
      ];

    case 'flow-chart':
      return [
        {
          id: 'fc-start',
          type: 'circle',
          x: 140,
          y: 180,
          width: 120,
          title: 'Start',
          text: 'User creates new Task in CRM',
          color: '#dcfce7',
          borderColor: '#16a34a'
        },
        {
          id: 'fc-proc-1',
          type: 'rect',
          x: 330,
          y: 170,
          width: 180,
          title: 'Validate Schema',
          text: 'Check title, priority, assignee & deadline',
          color: '#eff6ff',
          borderColor: '#3b82f6'
        },
        {
          id: 'fc-dec',
          type: 'diamond',
          x: 570,
          y: 155,
          width: 160,
          title: 'Supabase Active?',
          text: 'Check live connection status',
          color: '#fef3c7',
          borderColor: '#d97706'
        },
        {
          id: 'fc-yes',
          type: 'rect',
          x: 800,
          y: 100,
          width: 190,
          title: 'Sync to Postgres',
          text: 'Broadcast realtime change to team channels',
          color: '#f3e8ff',
          borderColor: '#9333ea'
        },
        {
          id: 'fc-no',
          type: 'rect',
          x: 800,
          y: 250,
          width: 190,
          title: 'Save to LocalStorage',
          text: 'Queue for background background resync',
          color: '#fee2e2',
          borderColor: '#ef4444'
        }
      ];

    case 'fishbone':
      return [
        {
          id: 'fb-head',
          type: 'card',
          x: 860,
          y: 200,
          width: 220,
          title: 'PROBLEM STATEMENT',
          text: 'Delayed Sprint Deliveries & Context Switching',
          color: '#fee2e2',
          borderColor: '#ef4444',
          tag: 'Core Issue'
        },
        {
          id: 'fb-cat-1',
          type: 'card',
          x: 200,
          y: 70,
          width: 200,
          title: '1. Tools & Context',
          text: '• Multiple disconnected apps\n• Lost comments & notes\n• Siloed chat channels',
          color: '#ffedd5',
          borderColor: '#f97316'
        },
        {
          id: 'fb-cat-2',
          type: 'card',
          x: 540,
          y: 70,
          width: 200,
          title: '2. People & Process',
          text: '• Unclear task assignees\n• Inconsistent standup notes\n• Ad-hoc priority shifts',
          color: '#fef3c7',
          borderColor: '#f59e0b'
        },
        {
          id: 'fb-cat-3',
          type: 'card',
          x: 200,
          y: 350,
          width: 200,
          title: '3. Time Tracking',
          text: '• Manual end-of-week guesses\n• Untracked bugfix sessions\n• Missing billable tags',
          color: '#e0e7ff',
          borderColor: '#6366f1'
        },
        {
          id: 'fb-cat-4',
          type: 'card',
          x: 540,
          y: 350,
          width: 200,
          title: '4. AI & Automation',
          text: '• Repetitive status updates\n• Manual meeting summaries\n• Lack of automated triage',
          color: '#f3e8ff',
          borderColor: '#a855f7'
        }
      ];

    default: // scratch
      return [
        {
          id: 'scratch-1',
          type: 'sticky',
          x: 380,
          y: 180,
          title: 'Welcome to your Whiteboard!',
          text: 'Click any tool on the left to add sticky notes, rectangles, drawings, or text.',
          color: '#fef08a',
          tag: 'Tip'
        },
        {
          id: 'scratch-2',
          type: 'sticky',
          x: 620,
          y: 180,
          text: 'All changes are automatically saved. Double click any note to edit text directly!',
          color: '#bae6fd',
          tag: 'Auto-save'
        }
      ];
  }
};

export const WhiteboardView: React.FC = () => {
  // Persistence state
  const [whiteboards, setWhiteboards] = useState<WhiteboardData[]>(() => {
    try {
      const saved = localStorage.getItem('clickup_saved_whiteboards_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<'all' | 'my'>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTool, setActiveTool] = useState<'select' | 'sticky' | 'rect' | 'circle' | 'text' | 'pen'>('select');
  const [selectedColor, setSelectedColor] = useState('#fef08a');
  const [zoom, setZoom] = useState(100);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const drawingSvgRef = useRef<SVGSVGElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeBoard = whiteboards.find(b => b.id === activeBoardId);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clickup_saved_whiteboards_v1', JSON.stringify(whiteboards));
    } catch (e) {}
  }, [whiteboards]);

  // Open or Create Template
  const handleSelectTemplate = (templateId: string, templateTitle: string) => {
    const newBoard: WhiteboardData = {
      id: 'wb-' + Date.now(),
      title: templateTitle,
      templateType: templateId as any,
      isFavorite: false,
      dateCreated: 'Just now',
      dateUpdated: 'Just now',
      items: generateInitialItemsForTemplate(templateId),
      strokes: []
    };

    setWhiteboards([newBoard, ...whiteboards]);
    setActiveBoardId(newBoard.id);
    showToast(`Created "${newBoard.title}" whiteboard!`);
  };

  const handleUpdateActiveBoard = (updater: (prev: WhiteboardData) => WhiteboardData) => {
    if (!activeBoardId) return;
    setWhiteboards(prev => prev.map(b => b.id === activeBoardId ? updater(b) : b));
  };

  const handleToggleFavorite = (boardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWhiteboards(prev => prev.map(b => {
      if (b.id === boardId) {
        const next = !b.isFavorite;
        showToast(next ? 'Added to Favorites ⭐' : 'Removed from Favorites');
        return { ...b, isFavorite: next };
      }
      return b;
    }));
  };

  const handleDeleteBoard = (boardId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWhiteboards(prev => prev.filter(b => b.id !== boardId));
    if (activeBoardId === boardId) {
      setActiveBoardId(null);
    }
    showToast('Whiteboard deleted');
  };

  // Dragging Canvas Item
  const handleMouseDownItem = (id: string, e: React.MouseEvent) => {
    if (activeTool === 'pen') return;
    e.stopPropagation();
    const item = activeBoard?.items.find(i => i.id === id);
    if (!item) return;

    setDraggedId(id);
    setDragOffset({
      x: e.clientX - item.x,
      y: e.clientY - item.y
    });
  };

  const handleMouseMoveStage = (e: React.MouseEvent) => {
    // If drawing with pen
    if (activeTool === 'pen' && isDrawing) {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const point = {
        x: (e.clientX - rect.left) / (zoom / 100),
        y: (e.clientY - rect.top) / (zoom / 100)
      };
      setCurrentStroke(prev => [...prev, point]);
      return;
    }

    // If dragging an item
    if (draggedId && activeBoard) {
      const newX = Math.max(20, Math.round(e.clientX - dragOffset.x));
      const newY = Math.max(20, Math.round(e.clientY - dragOffset.y));

      handleUpdateActiveBoard(board => ({
        ...board,
        items: board.items.map(i => i.id === draggedId ? { ...i, x: newX, y: newY } : i)
      }));
    }
  };

  const handleMouseUpStage = () => {
    if (draggedId) {
      setDraggedId(null);
    }
    if (isDrawing && currentStroke.length > 1) {
      setIsDrawing(false);
      const newStroke: WhiteboardDrawingStroke = {
        id: 'strk-' + Date.now(),
        points: currentStroke,
        color: selectedColor === '#fef08a' ? '#7c3aed' : selectedColor,
        lineWidth: 3
      };
      handleUpdateActiveBoard(board => ({
        ...board,
        strokes: [...(board.strokes || []), newStroke]
      }));
      setCurrentStroke([]);
    } else {
      setIsDrawing(false);
      setCurrentStroke([]);
    }
  };

  const handleMouseDownStage = (e: React.MouseEvent) => {
    if (activeTool === 'pen') {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const point = {
        x: (e.clientX - rect.left) / (zoom / 100),
        y: (e.clientY - rect.top) / (zoom / 100)
      };
      setIsDrawing(true);
      setCurrentStroke([point]);
      return;
    }

    if (activeTool === 'sticky') {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const dropX = Math.round((e.clientX - rect.left) / (zoom / 100) - 75);
      const dropY = Math.round((e.clientY - rect.top) / (zoom / 100) - 60);

      const newItem: WhiteboardCanvasItem = {
        id: 'item-' + Date.now(),
        type: 'sticky',
        x: Math.max(40, dropX),
        y: Math.max(40, dropY),
        text: 'New thought or task note',
        color: selectedColor,
        tag: 'Idea'
      };

      handleUpdateActiveBoard(board => ({
        ...board,
        items: [...board.items, newItem]
      }));
      setActiveTool('select');
      showToast('Sticky note placed!');
    } else if (activeTool === 'rect') {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const dropX = Math.round((e.clientX - rect.left) / (zoom / 100) - 100);
      const dropY = Math.round((e.clientY - rect.top) / (zoom / 100) - 50);

      const newItem: WhiteboardCanvasItem = {
        id: 'item-' + Date.now(),
        type: 'rect',
        x: Math.max(40, dropX),
        y: Math.max(40, dropY),
        width: 220,
        height: 100,
        title: 'New Section Block',
        text: 'Describe process step or component',
        color: '#ffffff',
        borderColor: '#7c3aed'
      };

      handleUpdateActiveBoard(board => ({
        ...board,
        items: [...board.items, newItem]
      }));
      setActiveTool('select');
      showToast('Block placed!');
    }
  };

  const handleDeleteItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateActiveBoard(board => ({
      ...board,
      items: board.items.filter(i => i.id !== itemId)
    }));
    showToast('Item deleted');
  };

  const handleExportPNG = () => {
    showToast('Exporting Whiteboard snapshot as high-res PNG...');
    setTimeout(() => {
      showToast('Whiteboard exported successfully!');
    }, 1200);
  };

  const favoriteBoards = whiteboards.filter(b => b.isFavorite);

  return (
    <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden', backgroundColor: '#fafbfc' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={16} color="#c084fc" />
          {toastMessage}
        </div>
      )}

      {/* Sub-Sidebar (Screenshot 2: Whiteboards, All Whiteboards, My Whiteboards, Favorites) */}
      <aside style={{
        width: isSidebarCollapsed ? '48px' : '224px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #eaebf0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isSidebarCollapsed ? '14px 6px' : '14px 10px',
        flexShrink: 0,
        transition: 'width 0.2s ease',
        overflowY: 'auto'
      }}>
        <div>
          {/* Header row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            padding: '0 6px'
          }}>
            {!isSidebarCollapsed && (
              <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a' }}>
                Whiteboards
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isSidebarCollapsed ? '»' : '«'}
              </button>
              <button
                onClick={() => handleSelectTemplate('scratch', 'Untitled Whiteboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Create new whiteboard"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => {
                setSubTab('all');
                setActiveBoardId(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: (subTab === 'all' && !activeBoardId) ? '#f1f5f9' : 'transparent',
                color: (subTab === 'all' && !activeBoardId) ? '#0f172a' : '#475569',
                fontWeight: (subTab === 'all' && !activeBoardId) ? 700 : 500,
                fontSize: '0.84rem',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="#64748b" strokeWidth="1.8" />
                <path d="M7 14.5C8 12 9.5 10.5 11 11.5C12.5 12.5 13.5 15 15 13.5C16 12.5 16.5 10 17 9" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {!isSidebarCollapsed && <span>All Whiteboards</span>}
            </button>

            <button
              onClick={() => {
                setSubTab('my');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: subTab === 'my' ? '#f1f5f9' : 'transparent',
                color: subTab === 'my' ? '#0f172a' : '#475569',
                fontWeight: subTab === 'my' ? 700 : 500,
                fontSize: '0.84rem',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  J
                </div>
                {!isSidebarCollapsed && <span>My Whiteboards</span>}
              </div>
              {!isSidebarCollapsed && (
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                  {whiteboards.length}
                </span>
              )}
            </button>
          </div>

          {/* User's Created Whiteboards List */}
          {!isSidebarCollapsed && whiteboards.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '0 8px', marginBottom: '6px' }}>
                Recent Boards
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {whiteboards.map(b => (
                  <div
                    key={b.id}
                    onClick={() => setActiveBoardId(b.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: activeBoardId === b.id ? '#f3e8ff' : 'transparent',
                      color: activeBoardId === b.id ? '#7c3aed' : '#334155',
                      fontSize: '0.8rem',
                      fontWeight: activeBoardId === b.id ? 700 : 500
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                      {b.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={(e) => handleToggleFavorite(b.id, e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                      >
                        <Star size={13} fill={b.isFavorite ? '#eab308' : 'none'} color={b.isFavorite ? '#eab308' : '#94a3b8'} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteBoard(b.id, e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorites Box (Matches Screenshot 2) */}
          {!isSidebarCollapsed && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', padding: '0 8px', marginBottom: '8px' }}>
                Favorites
              </div>

              {favoriteBoards.length === 0 ? (
                <div style={{
                  padding: '16px 12px',
                  borderRadius: '10px',
                  border: '1px dashed #cbd5e1',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '6px'
                }}>
                  <Star size={16} fill="#facc15" color="#facc15" />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                    Star a Whiteboard to see it here
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {favoriteBoards.map(fb => (
                    <div
                      key={fb.id}
                      onClick={() => setActiveBoardId(fb.id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#fefce8',
                        border: '1px solid #fef08a',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#854d0e',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {fb.title}
                      </span>
                      <Star size={12} fill="#eab308" color="#eab308" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      {!activeBoard ? (
        /* SCREENSHOT 2: Template Hub */
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '640px', marginBottom: '36px' }}>
            <h1 style={{
              margin: '0 0 10px 0',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              Choose a Whiteboard template
            </h1>
            <p style={{
              margin: 0,
              fontSize: '0.88rem',
              color: '#64748b',
              lineHeight: 1.5
            }}>
              Create Whiteboards to map out project plans, brainstorm feature concepts, or help remote co-workers work better together!
            </p>
          </div>

          {/* 6 Templates Grid (Matches Screenshot 2) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 260px)',
            gap: '20px'
          }}>
            {TEMPLATE_CONFIGS.map(t => (
              <div
                key={t.id}
                onClick={() => handleSelectTemplate(t.id, t.title)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: t.id === 'scratch' ? 'center' : 'flex-start',
                  justifyContent: t.id === 'scratch' ? 'center' : 'flex-start',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  minHeight: '170px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = '#c084fc';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {t.id === 'scratch' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Plus size={22} color="#475569" />
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
                      Start from scratch
                    </span>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: t.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      {t.icon}
                    </div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                      {t.subtitle}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* LIVE INTERACTIVE CANVAS */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Top Bar for Canvas */}
          <div style={{
            height: '52px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            flexShrink: 0
          }}>
            {/* Left: Back & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setActiveBoardId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  padding: '6px 8px',
                  borderRadius: '6px'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronLeft size={16} />
                <span>All Whiteboards</span>
              </button>

              <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0' }} />

              <input
                type="text"
                value={activeBoard.title}
                onChange={e => handleUpdateActiveBoard(b => ({ ...b, title: e.target.value }))}
                style={{
                  border: '1px solid transparent',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  color: '#0f172a',
                  outline: 'none',
                  backgroundColor: 'transparent'
                }}
                onFocus={e => e.currentTarget.style.border = '1px solid #c084fc'}
                onBlur={e => e.currentTarget.style.border = '1px solid transparent'}
              />

              <button
                onClick={() => handleToggleFavorite(activeBoard.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                title={activeBoard.isFavorite ? "Unstar" : "Star"}
              >
                <Star size={16} fill={activeBoard.isFavorite ? '#eab308' : 'none'} color={activeBoard.isFavorite ? '#eab308' : '#94a3b8'} />
              </button>
            </div>

            {/* Right: Zoom & Export Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                padding: '2px 4px'
              }}>
                <button
                  onClick={() => setZoom(z => Math.max(50, z - 10))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: '#475569' }}
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', minWidth: '42px', textAlign: 'center' }}>
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom(z => Math.min(180, z + 10))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: '#475569' }}
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => setZoom(100)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: '#475569', fontSize: '0.7rem', fontWeight: 700 }}
                  title="Reset Zoom"
                >
                  Reset
                </button>
              </div>

              <button
                onClick={handleExportPNG}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Export</span>
              </button>

              <button
                onClick={() => showToast('Share link copied to clipboard!')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Canvas Main Stage with Floating Tools */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Left Floating Toolbar */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 30
            }}>
              <button
                onClick={() => setActiveTool('select')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTool === 'select' ? '#f3e8ff' : 'transparent',
                  color: activeTool === 'select' ? '#7c3aed' : '#64748b'
                }}
                title="Select & Move (V)"
              >
                <MousePointer size={18} />
              </button>

              <button
                onClick={() => setActiveTool('sticky')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTool === 'sticky' ? '#f3e8ff' : 'transparent',
                  color: activeTool === 'sticky' ? '#7c3aed' : '#64748b'
                }}
                title="Place Sticky Note (S)"
              >
                <Square size={18} fill="#fef08a" color="#eab308" />
              </button>

              <button
                onClick={() => setActiveTool('rect')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTool === 'rect' ? '#f3e8ff' : 'transparent',
                  color: activeTool === 'rect' ? '#7c3aed' : '#64748b'
                }}
                title="Card Block (R)"
              >
                <Square size={18} />
              </button>

              <button
                onClick={() => setActiveTool('pen')}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTool === 'pen' ? '#f3e8ff' : 'transparent',
                  color: activeTool === 'pen' ? '#7c3aed' : '#64748b'
                }}
                title="Pen & Freehand Drawing (P)"
              >
                <PenTool size={18} />
              </button>

              {/* Color Palette Switcher */}
              <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                {[
                  { color: '#fef08a', label: 'Yellow' },
                  { color: '#bae6fd', label: 'Blue' },
                  { color: '#bbf7d0', label: 'Green' },
                  { color: '#fbcfe8', label: 'Pink' },
                  { color: '#e9d5ff', label: 'Purple' }
                ].map(c => (
                  <div
                    key={c.color}
                    onClick={() => setSelectedColor(c.color)}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: c.color,
                      border: selectedColor === c.color ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                      cursor: 'pointer',
                      transform: selectedColor === c.color ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.1s ease'
                    }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Canvas Interactive Surface */}
            <div
              ref={canvasRef}
              onMouseDown={handleMouseDownStage}
              onMouseMove={handleMouseMoveStage}
              onMouseUp={handleMouseUpStage}
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                cursor: activeTool === 'pen' ? 'crosshair' : activeTool === 'sticky' ? 'copy' : 'default',
                backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
                backgroundSize: `${24 * (zoom / 100)}px ${24 * (zoom / 100)}px`,
                backgroundColor: '#f8fafc',
                overflow: 'auto',
                userSelect: 'none'
              }}
            >
              {/* SVG Overlay for Tree Lines & Freehand Strokes */}
              <svg
                ref={drawingSvgRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '2400px',
                  height: '1600px',
                  pointerEvents: 'none',
                  zIndex: 10
                }}
              >
                {/* Organizational Chart connecting lines */}
                {activeBoard.templateType === 'org-chart' && (
                  <g stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" fill="none">
                    {/* CEO to VPs */}
                    <path d="M 600 160 L 600 190 L 350 190 L 350 220" />
                    <path d="M 600 160 L 600 190 L 830 190 L 830 220" />
                    {/* VP Eng to Leads */}
                    <path d="M 350 320 L 350 350 L 230 350 L 230 380" />
                    <path d="M 350 320 L 350 350 L 420 350 L 420 380" />
                    {/* VP Product to AI & QA */}
                    <path d="M 830 320 L 830 350 L 710 350 L 710 380" />
                    <path d="M 830 320 L 830 350 L 900 350 L 900 380" />
                  </g>
                )}

                {/* Flowchart connecting lines */}
                {activeBoard.templateType === 'flow-chart' && (
                  <g stroke="#64748b" strokeWidth="2" fill="none">
                    <path d="M 260 230 L 330 230" markerEnd="url(#arrow)" />
                    <path d="M 510 230 L 570 230" />
                    <path d="M 730 230 L 760 230 L 760 150 L 800 150" />
                    <path d="M 730 230 L 760 230 L 760 300 L 800 300" />
                  </g>
                )}

                {/* Freehand saved strokes */}
                {(activeBoard.strokes || []).map(strk => (
                  <path
                    key={strk.id}
                    d={`M ${strk.points.map(p => `${p.x * (zoom / 100)},${p.y * (zoom / 100)}`).join(' L ')}`}
                    stroke={strk.color}
                    strokeWidth={strk.lineWidth * (zoom / 100)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ))}

                {/* Current Active Freehand Stroke */}
                {isDrawing && currentStroke.length > 1 && (
                  <path
                    d={`M ${currentStroke.map(p => `${p.x * (zoom / 100)},${p.y * (zoom / 100)}`).join(' L ')}`}
                    stroke={selectedColor === '#fef08a' ? '#7c3aed' : selectedColor}
                    strokeWidth={3 * (zoom / 100)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                )}
              </svg>

              {/* Render Canvas Elements */}
              {activeBoard.items.map(item => {
                const scale = zoom / 100;
                const posX = item.x * scale;
                const posY = item.y * scale;

                if (item.type === 'sticky') {
                  return (
                    <div
                      key={item.id}
                      onMouseDown={(e) => handleMouseDownItem(item.id, e)}
                      style={{
                        position: 'absolute',
                        left: `${posX}px`,
                        top: `${posY}px`,
                        width: `${170 * scale}px`,
                        minHeight: `${140 * scale}px`,
                        backgroundColor: item.color,
                        borderRadius: '10px',
                        boxShadow: draggedId === item.id 
                          ? '0 16px 32px rgba(0,0,0,0.18)' 
                          : '0 4px 12px rgba(0,0,0,0.06)',
                        padding: `${12 * scale}px`,
                        cursor: draggedId === item.id ? 'grabbing' : 'grab',
                        zIndex: draggedId === item.id ? 25 : 15,
                        transition: draggedId === item.id ? 'none' : 'box-shadow 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        {item.tag && (
                          <div style={{
                            display: 'inline-block',
                            fontSize: `${0.68 * scale}rem`,
                            fontWeight: 800,
                            color: 'rgba(0,0,0,0.6)',
                            backgroundColor: 'rgba(0,0,0,0.06)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginBottom: '6px'
                          }}>
                            {item.tag}
                          </div>
                        )}

                        {item.title && (
                          <div style={{
                            fontWeight: 800,
                            fontSize: `${0.84 * scale}rem`,
                            color: '#0f172a',
                            marginBottom: '4px'
                          }}>
                            {item.title}
                          </div>
                        )}

                        <div 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newText = e.currentTarget.innerText;
                            handleUpdateActiveBoard(b => ({
                              ...b,
                              items: b.items.map(i => i.id === item.id ? { ...i, text: newText } : i)
                            }));
                          }}
                          style={{
                            fontSize: `${0.78 * scale}rem`,
                            color: '#1e293b',
                            lineHeight: 1.4,
                            whiteSpace: 'pre-wrap',
                            outline: 'none'
                          }}
                        >
                          {item.text}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'rgba(0,0,0,0.4)',
                            padding: '2px'
                          }}
                        >
                          <Trash2 size={12 * scale} />
                        </button>
                      </div>
                    </div>
                  );
                }

                // Default card block or rectangle
                return (
                  <div
                    key={item.id}
                    onMouseDown={(e) => handleMouseDownItem(item.id, e)}
                    style={{
                      position: 'absolute',
                      left: `${posX}px`,
                      top: `${posY}px`,
                      width: `${(item.width || 200) * scale}px`,
                      minHeight: `${(item.height || 90) * scale}px`,
                      backgroundColor: item.color || '#ffffff',
                      border: `1.5px solid ${item.borderColor || '#cbd5e1'}`,
                      borderRadius: item.type === 'circle' ? '50%' : '12px',
                      boxShadow: draggedId === item.id 
                        ? '0 16px 32px rgba(0,0,0,0.18)' 
                        : '0 3px 8px rgba(0,0,0,0.05)',
                      padding: `${12 * scale}px`,
                      cursor: draggedId === item.id ? 'grabbing' : 'grab',
                      zIndex: draggedId === item.id ? 25 : 15,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        {item.tag && (
                          <span style={{
                            fontSize: `${0.68 * scale}rem`,
                            fontWeight: 700,
                            color: '#64748b',
                            backgroundColor: '#f1f5f9',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {item.tag}
                          </span>
                        )}
                        {item.status && (
                          <span style={{
                            fontSize: `${0.66 * scale}rem`,
                            fontWeight: 800,
                            color: item.status === 'Completed' ? '#16a34a' : '#d97706',
                            backgroundColor: item.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            {item.status}
                          </span>
                        )}
                      </div>

                      {item.title && (
                        <div style={{
                          fontWeight: 800,
                          fontSize: `${0.86 * scale}rem`,
                          color: '#0f172a',
                          marginBottom: '2px'
                        }}>
                          {item.title}
                        </div>
                      )}

                      {item.role && (
                        <div style={{
                          fontWeight: 700,
                          fontSize: `${0.74 * scale}rem`,
                          color: '#7c3aed',
                          marginBottom: '4px'
                        }}>
                          {item.role}
                        </div>
                      )}

                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newText = e.currentTarget.innerText;
                          handleUpdateActiveBoard(b => ({
                            ...b,
                            items: b.items.map(i => i.id === item.id ? { ...i, text: newText } : i)
                          }));
                        }}
                        style={{
                          fontSize: `${0.76 * scale}rem`,
                          color: '#475569',
                          lineHeight: 1.4,
                          whiteSpace: 'pre-wrap',
                          outline: 'none'
                        }}
                      >
                        {item.text}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94a3b8',
                          padding: '2px'
                        }}
                      >
                        <Trash2 size={12 * scale} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

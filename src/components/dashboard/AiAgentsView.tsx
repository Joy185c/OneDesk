import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Play, 
  Plus, 
  Sparkles, 
  Check, 
  X, 
  Settings2, 
  RefreshCw, 
  Terminal, 
  Cpu, 
  Zap, 
  Sliders, 
  Code2, 
  GitPullRequest, 
  FileText, 
  CheckCircle2, 
  Circle, 
  Eye, 
  ChevronRight,
  ShieldAlert,
  Send,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface AiAgent {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  visorGradient: string;
  status: 'Running' | 'Active' | 'Idle';
  instructions: string;
  tools: string[];
  lastAction: string;
  executionsCount: number;
}

const INITIAL_AGENTS: AiAgent[] = [
  {
    id: 'agent-1',
    name: 'Project Manager',
    role: 'Orchestrates process and alignment across functions so engineers can focus on delivering high-quality work.',
    avatarBg: '#fdba74',
    visorGradient: 'linear-gradient(90deg, #ff007a, #9d00ff, #00f0ff, #ffb800)',
    status: 'Running',
    instructions: 'You are responsible for streamlining workflows, aligning timelines, and keeping the team unblocked and coordinated. Automatically recalculate task dependencies on date shifts.',
    tools: ['Supabase Realtime DB', 'ClickUp Tasks', 'Slack Sync', 'Calendar Engine'],
    lastAction: 'Aligned sprint milestone with roadmap timeline (2m ago)',
    executionsCount: 142
  },
  {
    id: 'agent-2',
    name: 'PR Triage Agent',
    role: 'Scans open GitHub pull requests & links to ClickUp ticket IDs automatically.',
    avatarBg: '#bae6fd',
    visorGradient: 'linear-gradient(90deg, #ec4899, #3b82f6)',
    status: 'Running',
    instructions: 'Scan all merged pull requests in repo Joy185c/OneDesk, extract ticket identifiers, move corresponding tasks to TESTING, and post a diff summary.',
    tools: ['GitHub Webhook', 'Git PR Diff', 'ClickUp Tasks API'],
    lastAction: 'Processed commit c2109fc (SPA router rewrite) and notified #eng-product',
    executionsCount: 89
  },
  {
    id: 'agent-3',
    name: 'Release Notes Agent',
    role: 'Generates user-facing changelog and product release notes from merged commits.',
    avatarBg: '#fed7aa',
    visorGradient: 'linear-gradient(90deg, #f97316, #a855f7)',
    status: 'Active',
    instructions: 'Aggregate commit messages since last tag, group into Features, Improvements, and Bug Fixes, and publish to #announcements and Docs.',
    tools: ['Git Log Parser', 'ClickUp Docs API', 'Slack Bot'],
    lastAction: 'Drafted ClickUp 3.0 Production Release Announcement (1h ago)',
    executionsCount: 34
  },
  {
    id: 'agent-4',
    name: 'Sprint Velocity Agent',
    role: 'Recalculates agile burndown rate and auto-flags blocked or delayed tickets.',
    avatarBg: '#dcfce7',
    visorGradient: 'linear-gradient(90deg, #10b981, #06b6d4)',
    status: 'Active',
    instructions: 'Monitor Sprint 52 burndown daily at 9:00 AM. If remaining points exceed threshold, alert the engineering manager with recommended scope adjustments.',
    tools: ['Sprint Tracker', 'Velocity Calculator', 'Alert Dispatcher'],
    lastAction: 'Estimated 82% sprint completion probability for Friday close',
    executionsCount: 76
  },
  {
    id: 'agent-5',
    name: 'Recruiting Manager',
    role: 'Vets inbound developer CVs and matches candidate portfolios against tech stack requirements.',
    avatarBg: '#fbcfe8',
    visorGradient: 'linear-gradient(90deg, #f43f5e, #8b5cf6)',
    status: 'Idle',
    instructions: 'Screen applicants for TypeScript, React, and Supabase proficiency. Generate candidate overview cards for team interviewers.',
    tools: ['Resume Parser', 'Candidate Scorecard', 'Calendar Booking'],
    lastAction: 'Vetted 6 frontend engineering applications for Q4 hiring',
    executionsCount: 28
  }
];

export const AiAgentsView: React.FC = () => {
  const [agents, setAgents] = useState<AiAgent[]>(() => {
    const saved = localStorage.getItem('clickup_ai_agents_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_AGENTS;
  });

  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-1');
  const [testingAgentId, setTestingAgentId] = useState<string | null>(null);
  const [testOutputLogs, setTestOutputLogs] = useState<string[]>([]);
  const [isNewAgentModalOpen, setIsNewAgentModalOpen] = useState<boolean>(false);
  const [newAgentName, setNewAgentName] = useState<string>('');
  const [newAgentRole, setNewAgentRole] = useState<string>('');
  const [newAgentInstructions, setNewAgentInstructions] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('clickup_ai_agents_v1', JSON.stringify(agents));
  }, [agents]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRunAgentTest = (agent: AiAgent) => {
    setTestingAgentId(agent.id);
    setTestOutputLogs([
      `[${new Date().toLocaleTimeString()}] 🚀 Initiating agent "${agent.name}"...`,
      `[${new Date().toLocaleTimeString()}] 🔍 Validating tools: ${agent.tools.join(', ')}...`,
      `[${new Date().toLocaleTimeString()}] ⚙️ Executing context-aware instructions...`
    ]);

    setTimeout(() => {
      setTestOutputLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ⚡ Context synthesized across 18 workspace tasks & 4 Supabase tables`,
        `[${new Date().toLocaleTimeString()}] ✅ Action executed successfully: "${agent.lastAction}" in 0.42s.`
      ]);
      setTestingAgentId(null);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      showToast(`Agent "${agent.name}" completed execution`);
      
      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, executionsCount: a.executionsCount + 1 } : a));
    }, 1200);
  };

  const handleUpdateInstructions = (newText: string) => {
    setAgents(prev => prev.map(a => a.id === selectedAgent.id ? { ...a, instructions: newText } : a));
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const newAg: AiAgent = {
      id: `agent-${Date.now()}`,
      name: newAgentName.trim(),
      role: newAgentRole.trim() || 'Custom AI Agent for automated workspace management.',
      avatarBg: '#e0e7ff',
      visorGradient: 'linear-gradient(90deg, #6366f1, #a855f7)',
      status: 'Active',
      instructions: newAgentInstructions.trim() || 'Monitor workspace activities and trigger automated responses.',
      tools: ['ClickUp Tasks', 'Supabase DB', 'Webhook Dispatcher'],
      lastAction: 'Agent deployed into workspace (Just now)',
      executionsCount: 0
    };

    setAgents(prev => [...prev, newAg]);
    setSelectedAgentId(newAg.id);
    setNewAgentName('');
    setNewAgentRole('');
    setNewAgentInstructions('');
    setIsNewAgentModalOpen(false);
    showToast(`AI Agent "${newAg.name}" created!`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Toast notification */}
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
          zIndex: 9999,
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

      {/* Top Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
          }}>
            <Bot size={18} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              AI Super Agents
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Autonomous ClickUp AI Agents working 24/7 across your tasks, docs, and integrations
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsNewAgentModalOpen(true)}
          style={{
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
          }}
        >
          <Plus size={15} />
          <span>Create Custom Agent</span>
        </button>
      </div>

      {/* Main 2-Column Split: Agents Catalog (Left) + Detail Inspector (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', flex: 1, overflow: 'hidden' }}>
        
        {/* Left Column: Agents List */}
        <div style={{
          borderRight: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          padding: '16px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
            Active Agents ({agents.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {agents.map(ag => {
              const isSelected = ag.id === selectedAgentId;
              return (
                <div
                  key={ag.id}
                  onClick={() => setSelectedAgentId(ag.id)}
                  style={{
                    backgroundColor: isSelected ? '#ffffff' : '#ffffff',
                    border: isSelected ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 14px rgba(124, 58, 237, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    {/* Rainbow Visor Avatar matching Screenshot 4 */}
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: ag.avatarBg,
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '-2px',
                        right: '-2px',
                        height: '11px',
                        borderRadius: '100px',
                        background: ag.visorGradient,
                        boxShadow: '0 0 6px rgba(0,240,255,0.7)'
                      }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                          {ag.name}
                        </span>
                        <span style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '100px',
                          backgroundColor: ag.status === 'Running' ? '#ecfdf5' : '#f1f5f9',
                          color: ag.status === 'Running' ? '#059669' : '#64748b'
                        }}>
                          ● {ag.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                        {ag.role}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px', fontSize: '0.7rem', color: '#94a3b8' }}>
                    <span>{ag.executionsCount} runs</span>
                    <span style={{ color: '#7c3aed', fontWeight: 700 }}>Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Agent Inspector & Live Console */}
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px', backgroundColor: '#ffffff' }}>
          
          {/* Agent Header Profile */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '18px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: selectedAgent.avatarBg,
                position: 'relative',
                flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '-4px',
                  right: '-4px',
                  height: '18px',
                  borderRadius: '100px',
                  background: selectedAgent.visorGradient,
                  boxShadow: '0 0 10px rgba(0,240,255,0.8)'
                }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    {selectedAgent.name}
                  </h3>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    border: '1px solid #a7f3d0'
                  }}>
                    ● {selectedAgent.status}
                  </span>
                </div>

                <p style={{ fontSize: '0.86rem', color: '#475569', margin: '6px 0 0', maxWidth: '580px', lineHeight: 1.5 }}>
                  {selectedAgent.role}
                </p>
              </div>
            </div>

            {/* Test Agent Action Button */}
            <button
              onClick={() => handleRunAgentTest(selectedAgent)}
              disabled={testingAgentId === selectedAgent.id}
              style={{
                backgroundColor: testingAgentId === selectedAgent.id ? '#94a3b8' : '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: testingAgentId === selectedAgent.id ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
              }}
            >
              <Play size={15} fill="#ffffff" />
              <span>{testingAgentId === selectedAgent.id ? 'Running Agent...' : 'Test Agent Live'}</span>
            </button>
          </div>

          {/* Connected Tools & Capabilities */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Connected Tools & Capabilities
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedAgent.tools.map((tool, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#334155'
                  }}
                >
                  <Cpu size={13} color="#7c3aed" />
                  <span>{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Editor */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Instructions & Prompt Directives
              </div>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>● Auto-saved to ClickUp Brain</span>
            </div>

            <textarea
              rows={4}
              value={selectedAgent.instructions}
              onChange={e => handleUpdateInstructions(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.86rem',
                color: '#1e293b',
                lineHeight: 1.5,
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Live Execution Console / Output Logs */}
          <div style={{
            backgroundColor: '#0f172a',
            borderRadius: '10px',
            padding: '16px 20px',
            color: '#f8fafc',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            minHeight: '140px',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                <Terminal size={14} />
                <span>Agent Execution Terminal Logs</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Realtime Supabase & Agent Channel</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', lineHeight: 1.5 }}>
              {testOutputLogs.length > 0 ? (
                testOutputLogs.map((log, idx) => (
                  <div key={idx} style={{ color: log.includes('✅') ? '#4ade80' : log.includes('⚡') ? '#facc15' : '#e2e8f0' }}>
                    {log}
                  </div>
                ))
              ) : (
                <div style={{ color: '#64748b' }}>
                  [Ready] Agent is idling. Click "Test Agent Live" above to trigger a test execution.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Custom Agent */}
      {isNewAgentModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
              <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>
                Create New AI Super Agent
              </div>
              <button onClick={() => setIsNewAgentModalOpen(false)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Agent Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAgentName}
                  onChange={e => setNewAgentName(e.target.value)}
                  placeholder="e.g. Security Vulnerability Auditor"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Mission / Role
                </label>
                <input
                  type="text"
                  value={newAgentRole}
                  onChange={e => setNewAgentRole(e.target.value)}
                  placeholder="e.g. Scans dependencies and monitors CVE advisories."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Agent Directives & Instructions
                </label>
                <textarea
                  rows={3}
                  value={newAgentInstructions}
                  onChange={e => setNewAgentInstructions(e.target.value)}
                  placeholder="Explain exactly what the agent should do when triggered..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewAgentModalOpen(false)}
                  style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', backgroundColor: '#7c3aed', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                >
                  Deploy Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

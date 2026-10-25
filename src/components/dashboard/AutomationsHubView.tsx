import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  Check, 
  X, 
  Play, 
  ChevronDown, 
  ArrowRight, 
  Bot, 
  Settings2, 
  Users, 
  Tag, 
  Bell, 
  Clock, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface AutomationRule {
  id: string;
  name: string;
  space: string;
  trigger: string;
  fromStatus?: string;
  toStatus?: string;
  action: string;
  actionTarget: string;
  active: boolean;
  executionsCount: number;
  description: string;
}

const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'auto-1',
    name: 'Status Automation: QA Hand-off',
    space: '🔴 Product Design',
    trigger: 'Status changes',
    fromStatus: 'In Progress',
    toStatus: 'Needs Review',
    action: 'Change Assignee & Launch AI Agent',
    actionTarget: 'Akram Khalid (QA Lead)',
    active: true,
    executionsCount: 48,
    description: 'This automation assigns tasks that are ready for QA to Akram who is the lead QA specialist and triggers AI review.'
  },
  {
    id: 'auto-2',
    name: 'Overdue Task Escalation',
    space: '🚀 Engineering',
    trigger: 'Due date arrives',
    action: 'Increase Priority & Send Slack Notification',
    actionTarget: '#eng-alerts',
    active: true,
    executionsCount: 19,
    description: 'Escalates overdue tasks to Urgent priority and pings the engineering on-call channel in Slack.'
  },
  {
    id: 'auto-3',
    name: 'Time Tracking Auto-Stop on Complete',
    space: '🏢 All Spaces',
    trigger: 'Status changes to COMPLETE',
    action: 'Stop Active Timer & Log Timesheet',
    actionTarget: 'Current User Timesheet',
    active: true,
    executionsCount: 92,
    description: 'Automatically stops any running timer when a task is moved to COMPLETE and records billable hours.'
  },
  {
    id: 'auto-4',
    name: 'GitHub PR Merge Sync',
    space: '💻 Core Platform',
    trigger: 'GitHub PR Merged',
    action: 'Move Task Status to DONE',
    actionTarget: 'Sprint 52 Board',
    active: true,
    executionsCount: 37,
    description: 'Listens to GitHub webhook and moves associated ClickUp tasks to DONE when pull requests merge.'
  }
];

export const AutomationsHubView: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>(() => {
    const saved = localStorage.getItem('clickup_automations_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RULES;
  });

  const [testingRuleId, setTestingRuleId] = useState<string | null>(null);
  const [testLog, setTestLog] = useState<string | null>(null);
  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = useState<boolean>(false);
  const [newRuleName, setNewRuleName] = useState<string>('');
  const [newRuleFromStatus, setNewRuleFromStatus] = useState<string>('In Progress');
  const [newRuleToStatus, setNewRuleToStatus] = useState<string>('Needs Review');
  const [newRuleActionTarget, setNewRuleActionTarget] = useState<string>('Akram Khalid (QA Lead)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('clickup_automations_v1', JSON.stringify(rules));
  }, [rules]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    const target = rules.find(r => r.id === id);
    showToast(`Automation "${target?.name}" ${!target?.active ? 'activated' : 'paused'}`);
  };

  const handleTestRule = (rule: AutomationRule) => {
    setTestingRuleId(rule.id);
    setTestLog(`⚡ Triggering simulated event: ${rule.trigger}...`);
    setTimeout(() => {
      setTestLog(`✅ Action successfully executed: ${rule.action} -> ${rule.actionTarget} in 0.08s.`);
      setTestingRuleId(null);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      showToast(`Automation "${rule.name}" test passed!`);
      setRules(prev => prev.map(r => r.id === rule.id ? { ...r, executionsCount: r.executionsCount + 1 } : r));
    }, 900);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newRule: AutomationRule = {
      id: `auto-${Date.now()}`,
      name: newRuleName.trim(),
      space: '🔴 Product Design',
      trigger: 'Status changes',
      fromStatus: newRuleFromStatus,
      toStatus: newRuleToStatus,
      action: 'Change Assignee & Notify',
      actionTarget: newRuleActionTarget,
      active: true,
      executionsCount: 0,
      description: `When status changes from ${newRuleFromStatus} to ${newRuleToStatus}, assign to ${newRuleActionTarget}.`
    };

    setRules(prev => [newRule, ...prev]);
    setNewRuleName('');
    setIsNewRuleModalOpen(false);
    showToast(`New automation "${newRule.name}" created!`);
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
      {/* Toast */}
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
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(168, 85, 247, 0.4)'
          }}>
            <Zap size={18} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Automations Hub
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Eliminate busywork by automating workflows, status hand-offs, and notifications
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsNewRuleModalOpen(true)}
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
          <span>Add Automation</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#fafbfc' }}>
        
        {/* Featured Visual Flowchart (Screenshot 4 Matching) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '24px 28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
                Featured Automation: QA Handoff Workflow
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                Active in: <span style={{ color: '#ef4444', fontWeight: 800 }}>🔴 Product Design Space</span>
              </div>
            </div>

            <button
              onClick={() => handleTestRule(rules[0])}
              style={{
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                border: '1.5px solid #ddd6fe',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Play size={12} fill="#7c3aed" />
              <span>Test Automation</span>
            </button>
          </div>

          {/* Flowchart Diagram Cards */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Trigger Box */}
            <div style={{
              width: '280px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>⚡ Trigger</span>
                <span style={{ fontSize: '0.68rem', backgroundColor: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px' }}>Tasks</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                <div style={{ border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '6px', marginBottom: '6px', fontWeight: 600 }}>
                  Status changes
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>From:</div>
                <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '6px', fontWeight: 700, marginBottom: '6px' }}>
                  ◉ In Progress
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>To:</div>
                <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
                  ✔ Needs Review
                </div>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div style={{ fontSize: '1.5rem', color: '#94a3b8', fontWeight: 800 }}>→</div>

            {/* Action 1 Box */}
            <div style={{
              width: '280px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', marginBottom: '10px' }}>
                🎯 Action 1: Reassign
              </div>
              <div style={{ border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
                @ Change assignees
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>To:</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#f59e0b', color: '#fff', fontSize: '0.68rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  AK
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Akram Khalid (QA Lead)</span>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div style={{ fontSize: '1.5rem', color: '#94a3b8', fontWeight: 800 }}>→</div>

            {/* Action 2 Box */}
            <div style={{
              width: '280px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#7c3aed', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bot size={15} />
                <span>Action 2: AI Review</span>
              </div>
              <div style={{ border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
                🚀 Launch AI Agent
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                AI analyzes code diffs, attaches test checklist, and posts summary to task comments.
              </div>
            </div>
          </div>

          {/* Test log output if run */}
          {testLog && (
            <div style={{
              marginTop: '16px',
              padding: '10px 14px',
              backgroundColor: '#0f172a',
              color: '#4ade80',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontFamily: 'monospace'
            }}>
              {testLog}
            </div>
          )}
        </div>

        {/* List of All Automations */}
        <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
          Configured Automations ({rules.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rules.map(rule => (
            <div
              key={rule.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>
                    {rule.name}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                    {rule.space}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
                  {rule.description}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                  ⚡ Executed {rule.executionsCount} times
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => handleTestRule(rule)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Play size={11} /> Test
                </button>

                {/* Toggle Switch */}
                <div
                  onClick={() => handleToggleRule(rule.id)}
                  style={{
                    width: '42px',
                    height: '24px',
                    backgroundColor: rule.active ? '#10b981' : '#cbd5e1',
                    borderRadius: '100px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '3px',
                    left: rule.active ? '21px' : '3px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Automation */}
      {isNewRuleModalOpen && (
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
                Create Automation Rule
              </div>
              <button onClick={() => setIsNewRuleModalOpen(false)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRule} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Automation Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  placeholder="e.g. Auto-assign on Needs Review"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    When Status Changes From:
                  </label>
                  <select
                    value={newRuleFromStatus}
                    onChange={e => setNewRuleFromStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Open">Open</option>
                    <option value="To Do">To Do</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    To Status:
                  </label>
                  <select
                    value={newRuleToStatus}
                    onChange={e => setNewRuleToStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  >
                    <option value="Needs Review">Needs Review</option>
                    <option value="Testing">Testing</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Then Reassign To:
                </label>
                <input
                  type="text"
                  value={newRuleActionTarget}
                  onChange={e => setNewRuleActionTarget(e.target.value)}
                  placeholder="e.g. Akram Khalid (QA Lead)"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewRuleModalOpen(false)}
                  style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', backgroundColor: '#7c3aed', border: 'none', borderRadius: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                >
                  Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

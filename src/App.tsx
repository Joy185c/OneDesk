import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DocsFeaturePage } from './pages/DocsFeaturePage';
import { TasksFeaturePage } from './pages/TasksFeaturePage';
import { PricingPage } from './pages/PricingPage';
import { ComparePage } from './pages/ComparePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { JoinWorkspacePage } from './pages/JoinWorkspacePage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/join" element={<JoinWorkspacePage />} />
      <Route path="/invite" element={<JoinWorkspacePage />} />
      <Route path="/features/docs" element={<DocsFeaturePage />} />
      <Route path="/features/tasks" element={<TasksFeaturePage />} />
      <Route path="/features/whiteboards" element={<DocsFeaturePage />} />
      <Route path="/features/dashboards" element={<TasksFeaturePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/workspace" element={<WorkspacePage />} />
      <Route path="/projects" element={<WorkspacePage />} />
      <Route path="/sprints" element={<WorkspacePage />} />
      <Route path="/agents" element={<WorkspacePage />} />
      <Route path="/automations" element={<WorkspacePage />} />
      <Route path="/calendar" element={<WorkspacePage />} />
      <Route path="/scheduling" element={<WorkspacePage />} />
      <Route path="/brain" element={<WorkspacePage />} />
      <Route path="/dashboards" element={<WorkspacePage />} />
      <Route path="/whiteboards" element={<WorkspacePage />} />
      <Route path="/time" element={<WorkspacePage />} />
      <Route path="/time/team" element={<WorkspacePage />} />
      <Route path="/time/approvals" element={<WorkspacePage />} />
      <Route path="/hubs/dashboards" element={<WorkspacePage />} />
      <Route path="/hubs/whiteboards" element={<WorkspacePage />} />
      <Route path="/docs" element={<WorkspacePage />} />
      <Route path="/forms" element={<WorkspacePage />} />
      <Route path="/hubs/clips" element={<WorkspacePage />} />
      <Route path="/clips" element={<WorkspacePage />} />
      <Route path="/goals" element={<WorkspacePage />} />
      <Route path="/apps" element={<WorkspacePage />} />
      <Route path="/chat/*" element={<WorkspacePage />} />
      <Route path="/v/o/s/*" element={<WorkspacePage />} />
      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

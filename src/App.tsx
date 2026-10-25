import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DocsFeaturePage } from './pages/DocsFeaturePage';
import { TasksFeaturePage } from './pages/TasksFeaturePage';
import { PricingPage } from './pages/PricingPage';
import { ComparePage } from './pages/ComparePage';
import { WorkspacePage } from './pages/WorkspacePage';
import { JoinWorkspacePage } from './pages/JoinWorkspacePage';

// Production Auth Routes
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/features/docs" element={<DocsFeaturePage />} />
      <Route path="/features/tasks" element={<TasksFeaturePage />} />
      <Route path="/features/whiteboards" element={<DocsFeaturePage />} />
      <Route path="/features/dashboards" element={<TasksFeaturePage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/compare" element={<ComparePage />} />

      {/* Dedicated Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Invitations */}
      <Route path="/join" element={<JoinWorkspacePage />} />
      <Route path="/invite" element={<JoinWorkspacePage />} />

      {/* Protected Workspaces and Hubs */}
      <Route path="/workspace" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/sprints" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/agents" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/automations" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/scheduling" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/brain" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/dashboards" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/whiteboards" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/time" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/time/team" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/time/approvals" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/hubs/dashboards" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/hubs/whiteboards" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/docs" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/forms" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/hubs/clips" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/clips" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/apps" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/chat/*" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/v/o/s/*" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

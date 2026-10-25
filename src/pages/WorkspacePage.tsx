import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WorkspaceApp } from '../components/dashboard/WorkspaceApp';
import { AuthModal } from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';

export const WorkspacePage: React.FC = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      demoLogin();
    }
  }, [isAuthenticated, demoLogin]);

  return <WorkspaceApp onBackToLanding={() => navigate('/')} />;
};

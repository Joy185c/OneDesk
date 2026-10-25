import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ClickUpInteractiveShowcase } from '../components/ClickUpInteractiveShowcase';
import { ContextConvergenceSection } from '../components/ContextConvergenceSection';
import { SuperAgentsSection } from '../components/SuperAgentsSection';
import { FeatureModules } from '../components/FeatureModules';
import { WorkFlowSection } from '../components/WorkFlowSection';
import { AutomationsSection } from '../components/AutomationsSection';
import { SocialProofSection } from '../components/SocialProofSection';
import { CompareSection } from '../components/CompareSection';
import { PricingSection } from '../components/PricingSection';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { WaitlistModal } from '../components/WaitlistModal';
import { AuthModal } from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' }>({
    open: false,
    mode: 'signup'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Navbar
        onOpenWaitlist={() => setWaitlistOpen(true)}
        onOpenAuth={(mode) => navigate(mode === 'signin' ? '/login' : '/signup')}
        onGoToWorkspace={() => navigate('/workspace')}
      />

      <main style={{ flex: 1 }}>
        {/* 1. HERO WITH CLICKUP 4.0, BRAIN², AND THE 12 FEATURE PILLS */}
        <Hero
          onOpenWaitlist={() => setWaitlistOpen(true)}
          onOpenAuth={(mode) => navigate(mode === 'signin' ? '/login' : '/signup')}
        />

        {/* 2. THE SIGNATURE 12-FEATURE INTERACTIVE SHOWCASE FROM YOUR SCREENSHOTS */}
        <ClickUpInteractiveShowcase />

        {/* 3. THE CONVERGENCE REVOLUTION (60% OF WORK IS LOST IN CONTEXT) */}
        <ContextConvergenceSection />

        {/* 4. CLICKUP SUPER AGENTS (A NEW ERA OF HUMANS, WITH SUPER AGENTS) */}
        <SuperAgentsSection />

        {/* 5. PRODUCT FEATURE MODULES (TASKS, DOCS, WHITEBOARDS, DASHBOARDS, AI) */}
        <FeatureModules />

        {/* 6. SOLUTIONS FOR EVERY TEAM (WITH 'REPLACES' BADGES) & WORKFLOWS */}
        <WorkFlowSection onOpenWaitlist={() => setWaitlistOpen(true)} />

        {/* 7. NO-CODE AUTOMATIONS LIVE SIMULATOR */}
        <AutomationsSection />

        {/* 8. SOCIAL PROOF, G2 AWARDS & ENTERPRISE GRADE EVERYTHING */}
        <SocialProofSection />

        {/* 9. COMPETITOR MATRIX (MONDAY, ASANA, JIRA) */}
        <CompareSection onOpenWaitlist={() => setWaitlistOpen(true)} />

        {/* 10. PRICING PLANS */}
        <PricingSection
          onOpenWaitlist={() => setWaitlistOpen(true)}
          onOpenAuth={(mode) => navigate(mode === 'signin' ? '/login' : '/signup')}
        />

        {/* 11. TESTIMONIALS & METRICS */}
        <Testimonials />
      </main>

      <Footer
        onOpenWaitlist={() => setWaitlistOpen(true)}
        onOpenAuth={(mode) => navigate(mode === 'signin' ? '/login' : '/signup')}
      />

      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <AuthModal
        isOpen={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, open: false })}
      />
    </div>
  );
};

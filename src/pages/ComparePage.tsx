import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { CompareSection } from '../components/CompareSection';
import { PricingSection } from '../components/PricingSection';
import { Footer } from '../components/Footer';
import { WaitlistModal } from '../components/WaitlistModal';
import { AuthModal } from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';

export const ComparePage: React.FC = () => {
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
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onGoToWorkspace={() => navigate('/workspace')}
      />

      <main style={{ flex: 1, paddingTop: '40px' }}>
        <CompareSection onOpenWaitlist={() => setWaitlistOpen(true)} />
        <PricingSection
          onOpenWaitlist={() => setWaitlistOpen(true)}
          onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        />
      </main>

      <Footer
        onOpenWaitlist={() => setWaitlistOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
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

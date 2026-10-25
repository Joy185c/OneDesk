import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { PricingSection } from '../components/PricingSection';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { WaitlistModal } from '../components/WaitlistModal';
import { AuthModal } from '../components/AuthModal';
import { useNavigate } from 'react-router-dom';

export const PricingPage: React.FC = () => {
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

      <main style={{ flex: 1, paddingTop: '30px' }}>
        <PricingSection
          onOpenWaitlist={() => setWaitlistOpen(true)}
          onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        />
        <Testimonials />
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

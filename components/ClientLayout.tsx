'use client';

import { useState, ReactNode } from 'react';
import Navigation from './Navigation';
import AuthModal from './AuthModal';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  return (
    <>
      <Navigation 
        onSignIn={() => { setAuthMode('signin'); setIsAuthModalOpen(true); }}
        onSignUp={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
      />
      <div className="pt-16">
        {children}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  );
}

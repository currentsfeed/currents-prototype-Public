'use client';

import { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'signup' | 'signin';
}

type AuthStep = 'select' | 'email' | 'wallet' | 'loading' | 'success' | 'error';

export default function AuthModal({ isOpen, onClose, mode = 'signup' }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>('select');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setEmail('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsValidEmail(validateEmail(value));
    setError(null);
  };

  const handleEmailSubmit = async () => {
    if (!isValidEmail) return;
    
    setStep('loading');
    
    // Mock auth - in real app, this would use Privy SDK
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setStep('success');
      setTimeout(() => {
        onClose();
        // Redirect to markets page
        window.location.reload();
      }, 2000);
    } catch (err) {
      setStep('error');
      setError('Failed to create account. Please try again.');
    }
  };

  const handleWalletConnect = async (provider: string) => {
    setStep('loading');
    
    // Mock wallet connection
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('success');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (err) {
      setStep('error');
      setError('Wallet connection failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 p-8 shadow-2xl animate-modal-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
        >
          ✕
        </button>

        {/* Select method */}
        {step === 'select' && (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              {mode === 'signup' ? 'Join Currents' : 'Welcome back'}
            </h2>
            
            <button
              onClick={() => setStep('email')}
              className="w-full h-12 mb-3 flex items-center justify-center gap-3 bg-[#2C4A6B] hover:bg-[#1E3447] text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <span className="text-xl">📧</span>
              Continue with Email
            </button>
            
            <button
              onClick={() => setStep('wallet')}
              className="w-full h-12 flex items-center justify-center gap-3 bg-[#2C4A6B] hover:bg-[#1E3447] text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <span className="text-xl">🔗</span>
              Connect Wallet
            </button>
            
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            
            <p className="text-sm text-center text-gray-600">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button className="font-semibold text-[#2C4A6B] hover:underline">
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button className="font-semibold text-[#2C4A6B] hover:underline">
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        )}

        {/* Email input */}
        {step === 'email' && (
          <div>
            <button
              onClick={() => setStep('select')}
              className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Back
            </button>
            
            <h3 className="text-xl font-semibold mb-6">Enter your email</h3>
            
            <div className="relative mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C4A6B] focus:ring-3 focus:ring-[#2C4A6B]/10 transition-all text-base"
              />
              {isValidEmail && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2D6A4F] text-xl">
                  ✓
                </span>
              )}
            </div>
            
            {error && (
              <p className="text-sm text-red-600 mb-4">
                ⚠ {error}
              </p>
            )}
            
            <button
              onClick={handleEmailSubmit}
              disabled={!isValidEmail}
              className="w-full h-12 bg-[#2C4A6B] hover:bg-[#1E3447] text-white font-semibold rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-6">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-[#2C4A6B] hover:underline">Terms</a>
              {' & '}
              <a href="/privacy" className="text-[#2C4A6B] hover:underline">Privacy</a>.
            </p>
          </div>
        )}

        {/* Wallet selection */}
        {step === 'wallet' && (
          <div>
            <button
              onClick={() => setStep('select')}
              className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Back
            </button>
            
            <h3 className="text-xl font-semibold mb-6">Connect Wallet</h3>
            
            <button
              onClick={() => handleWalletConnect('metamask')}
              className="w-full h-16 mb-3 flex items-center gap-4 px-4 border border-gray-200 hover:border-[#2C4A6B] rounded-lg transition-all hover:bg-gray-50"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">MetaMask</div>
                <div className="text-xs text-gray-500">Most Popular</div>
              </div>
            </button>
            
            <button
              onClick={() => handleWalletConnect('coinbase')}
              className="w-full h-16 mb-3 flex items-center gap-4 px-4 border border-gray-200 hover:border-[#2C4A6B] rounded-lg transition-all hover:bg-gray-50"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                C
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Coinbase Wallet</div>
              </div>
            </button>
            
            <button
              onClick={() => handleWalletConnect('walletconnect')}
              className="w-full h-16 flex items-center gap-4 px-4 border border-gray-200 hover:border-[#2C4A6B] rounded-lg transition-all hover:bg-gray-50"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                W
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">WalletConnect</div>
                <div className="text-xs text-gray-500">100+ wallets</div>
              </div>
            </button>
          </div>
        )}

        {/* Loading */}
        {step === 'loading' && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#2C4A6B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">
              Processing...
            </p>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-[#2D6A4F]">✓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome! 👋</h3>
            <p className="text-gray-600">Your account is ready</p>
            <div className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#2C4A6B] animate-progress" />
            </div>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Connection Failed</h3>
            <p className="text-gray-600 mb-6">
              {error || 'Couldn\'t connect. Check your internet and try again.'}
            </p>
            <button
              onClick={() => setStep('select')}
              className="w-full h-12 bg-[#2C4A6B] hover:bg-[#1E3447] text-white font-semibold rounded-lg transition-all"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="w-full h-10 mt-3 text-gray-600 hover:text-gray-900 font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .animate-modal-in {
          animation: modal-in 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-progress {
          animation: progress 2s linear forwards;
        }
      `}</style>
    </div>
  );
}

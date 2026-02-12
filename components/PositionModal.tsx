'use client';

import { useState, useEffect, useReducer, useCallback } from 'react';

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketId: string;
  marketQuestion: string;
  initialProbability: number;
}

type PositionStep = 'entry' | 'confirmation' | 'loading' | 'success' | 'error';
type Side = 'YES' | 'NO';

interface PositionState {
  step: PositionStep;
  side: Side;
  amount: number;
  preview: Preview | null;
  error: string | null;
  positionId: string | null;
  newBalance: number | null;
}

interface Preview {
  shares: number;
  pricePerShare: number;
  potentialWin: number;
  potentialLoss: number;
  roi: number;
  currentProbability: number;
  newProbability: number;
  marketImpact: number;
}

type PositionAction =
  | { type: 'SET_SIDE'; side: Side }
  | { type: 'SET_AMOUNT'; amount: number }
  | { type: 'SET_PREVIEW'; preview: Preview }
  | { type: 'CONFIRM' }
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; positionId: string; newBalance: number }
  | { type: 'ERROR'; error: string }
  | { type: 'RESET' };

const initialState: PositionState = {
  step: 'entry',
  side: 'YES',
  amount: 25,
  preview: null,
  error: null,
  positionId: null,
  newBalance: null
};

function positionReducer(state: PositionState, action: PositionAction): PositionState {
  switch (action.type) {
    case 'SET_SIDE':
      return { ...state, side: action.side, error: null };
    case 'SET_AMOUNT':
      return { ...state, amount: action.amount, error: null };
    case 'SET_PREVIEW':
      return { ...state, preview: action.preview };
    case 'CONFIRM':
      return { ...state, step: 'confirmation' };
    case 'SUBMIT':
      return { ...state, step: 'loading' };
    case 'SUCCESS':
      return { ...state, step: 'success', positionId: action.positionId, newBalance: action.newBalance };
    case 'ERROR':
      return { ...state, step: 'error', error: action.error };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function PositionModal({ 
  isOpen, 
  onClose, 
  marketId, 
  marketQuestion,
  initialProbability 
}: PositionModalProps) {
  const [state, dispatch] = useReducer(positionReducer, initialState);
  const [balance, setBalance] = useState(100); // Mock balance
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'RESET' });
    }
  }, [isOpen]);

  // Fetch preview when amount or side changes
  useEffect(() => {
    if (!isOpen || state.step !== 'entry') return;

    const fetchPreview = async () => {
      if (state.amount < 1 || state.amount > balance) return;

      setIsLoadingPreview(true);
      try {
        const response = await fetch('/api/positions/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            marketId,
            side: state.side,
            amount: state.amount
          })
        });

        const data = await response.json();
        if (data.success) {
          dispatch({ type: 'SET_PREVIEW', preview: data.preview });
        }
      } catch (error) {
        console.error('Preview fetch error:', error);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    const timeoutId = setTimeout(fetchPreview, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [state.amount, state.side, marketId, balance, isOpen, state.step]);

  const handleCreatePosition = async () => {
    dispatch({ type: 'SUBMIT' });

    try {
      const response = await fetch('/api/positions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marketId,
          side: state.side,
          amount: state.amount
        })
      });

      const data = await response.json();
      
      if (data.success) {
        dispatch({ 
          type: 'SUCCESS', 
          positionId: data.position.id, 
          newBalance: data.newBalance 
        });
        setBalance(data.newBalance);
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        dispatch({ type: 'ERROR', error: data.message || 'Transaction failed' });
      }
    } catch (error) {
      dispatch({ type: 'ERROR', error: 'Network error. Please try again.' });
    }
  };

  if (!isOpen) return null;

  const amountError = 
    state.amount < 1 ? 'Minimum position: $1' :
    state.amount > 1000 ? 'Maximum position: $1,000' :
    state.amount > balance ? `Insufficient balance. You have $${balance} USDC.` :
    null;

  const canProceed = !amountError && state.preview;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={state.step === 'loading' ? undefined : onClose}
      />
      
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 p-8 shadow-2xl animate-modal-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={state.step === 'loading'}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
        >
          ✕
        </button>

        {/* Entry Screen */}
        {state.step === 'entry' && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                  Take a Position
                </h2>
                <div className="text-sm text-gray-600" style={{ fontFamily: 'SF Mono, monospace' }}>
                  Balance: ${balance} USDC
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-semibold">
                {marketQuestion}
              </div>
            </div>

            {/* YES/NO Selector */}
            <div className="grid grid-cols-2 h-14 border border-gray-200 rounded-lg overflow-hidden mb-6">
              <button
                onClick={() => dispatch({ type: 'SET_SIDE', side: 'YES' })}
                className={`font-bold transition-all ${
                  state.side === 'YES'
                    ? 'bg-[rgba(45,106,79,0.05)] text-[#2D6A4F] border-l-4 border-[#2D6A4F]'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                YES
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_SIDE', side: 'NO' })}
                className={`font-bold transition-all ${
                  state.side === 'NO'
                    ? 'bg-[rgba(157,91,78,0.05)] text-[#9D5B4E] border-r-4 border-[#9D5B4E]'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                NO
              </button>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400" style={{ fontFamily: 'SF Mono, monospace' }}>
                  $
                </span>
                <input
                  type="number"
                  value={state.amount}
                  onChange={(e) => dispatch({ type: 'SET_AMOUNT', amount: parseFloat(e.target.value) || 0 })}
                  className={`w-full h-14 pl-10 pr-4 text-2xl text-right border rounded-lg focus:outline-none focus:ring-3 transition-all ${
                    amountError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                      : 'border-gray-300 focus:border-[#2C4A6B] focus:ring-[#2C4A6B]/10'
                  }`}
                  style={{ fontFamily: 'SF Mono, monospace' }}
                  min="1"
                  max="1000"
                  step="1"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                {amountError ? (
                  <p className="text-sm text-red-600">⚠ {amountError}</p>
                ) : (
                  <p className="text-xs text-gray-500">Min $1 • Max $1,000</p>
                )}
              </div>
            </div>

            {/* Slider */}
            <div className="mb-8">
              <input
                type="range"
                min="1"
                max={Math.min(balance, 100)}
                value={Math.min(state.amount, balance)}
                onChange={(e) => dispatch({ type: 'SET_AMOUNT', amount: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer position-slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2" style={{ fontFamily: 'SF Mono, monospace' }}>
                <span>$10</span>
                <span>$25</span>
                <span>$50</span>
                <span>$100</span>
              </div>
            </div>

            {/* Preview */}
            {state.preview && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-4">
                  <span>📊</span> Position Preview
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">You'll receive:</div>
                    <div className="text-lg font-bold" style={{ fontFamily: 'SF Mono, monospace' }}>
                      {state.preview.shares} shares @ ${state.preview.pricePerShare}/share
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Potential win:</div>
                    <div className={`text-xl font-bold ${state.side === 'YES' ? 'text-[#2D6A4F]' : 'text-[#9D5B4E]'}`} style={{ fontFamily: 'SF Mono, monospace' }}>
                      +${state.preview.potentialWin.toFixed(2)} ({state.preview.roi.toFixed(0)}%)
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500" style={{ fontFamily: 'SF Mono, monospace' }}>
                      Current: {state.preview.currentProbability}% → After: {state.preview.newProbability}% 
                      <span className="ml-2 text-gray-400">(+{state.preview.marketImpact.toFixed(1)}% impact)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => dispatch({ type: 'CONFIRM' })}
              disabled={!canProceed || isLoadingPreview}
              className="w-full h-13 bg-[#2C4A6B] hover:bg-[#1E3447] text-white font-bold rounded-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Review Position
            </button>
          </>
        )}

        {/* Confirmation Screen */}
        {state.step === 'confirmation' && state.preview && (
          <>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Back
            </button>

            <div className={`text-center py-4 rounded-lg mb-6 ${
              state.side === 'YES' ? 'bg-[rgba(45,106,79,0.08)]' : 'bg-[rgba(157,91,78,0.08)]'
            }`}>
              <h2 className={`text-3xl font-extrabold uppercase ${
                state.side === 'YES' ? 'text-[#2D6A4F]' : 'text-[#9D5B4E]'
              }`}>
                ▼ BUY {state.side} ▼
              </h2>
            </div>

            <div className="mb-6 text-center">
              <p className="text-sm text-gray-600 font-semibold">{marketQuestion}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 mb-6 space-y-3">
              <h3 className="font-semibold mb-3">Position Details</h3>
              
              <div className="flex justify-between" style={{ fontFamily: 'SF Mono, monospace' }}>
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">${state.amount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between" style={{ fontFamily: 'SF Mono, monospace' }}>
                <span className="text-gray-600">Shares:</span>
                <span className="font-semibold">{state.preview.shares}</span>
              </div>
              
              <div className="flex justify-between" style={{ fontFamily: 'SF Mono, monospace' }}>
                <span className="text-gray-600">Price/share:</span>
                <span className="font-semibold">${state.preview.pricePerShare}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="border-2 border-[#2D6A4F] bg-[rgba(45,106,79,0.05)] rounded-lg p-4">
                <div className="flex items-center gap-2 text-[#2D6A4F] font-semibold mb-1">
                  <span className="text-xl">✓</span> If {state.side} wins:
                </div>
                <div className="text-2xl font-bold text-[#2D6A4F]" style={{ fontFamily: 'SF Mono, monospace' }}>
                  +${state.preview.potentialWin.toFixed(2)} ({state.preview.roi.toFixed(0)}%)
                </div>
              </div>
              
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 font-semibold mb-1">
                  <span className="text-xl">✗</span> If {state.side === 'YES' ? 'NO' : 'YES'} wins:
                </div>
                <div className="text-xl font-bold text-gray-500" style={{ fontFamily: 'SF Mono, monospace' }}>
                  -${state.amount.toFixed(2)} (0%)
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'SF Mono, monospace' }}>
              New balance: ${(balance - state.amount).toFixed(2)} USDC
            </div>

            <button
              onClick={handleCreatePosition}
              className={`w-full h-13 font-bold text-white rounded-lg transition-all mb-3 ${
                state.side === 'YES' 
                  ? 'bg-[#2D6A4F] hover:bg-[#234F3D]' 
                  : 'bg-[#9D5B4E] hover:bg-[#7D4B3E]'
              }`}
            >
              Confirm {state.side} Position
            </button>
            
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="w-full h-11 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </>
        )}

        {/* Loading */}
        {state.step === 'loading' && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#2C4A6B] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Processing your position...</p>
          </div>
        )}

        {/* Success */}
        {state.step === 'success' && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-[#2D6A4F]">✓</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Position Placed! 🎉</h3>
            <p className="text-gray-600 mb-4">
              You bought {state.preview?.shares} {state.side} shares for ${state.amount}
            </p>
            <div className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'SF Mono, monospace' }}>
              New balance: ${state.newBalance} USDC
            </div>
            <button
              onClick={onClose}
              className="w-full h-12 bg-[#2C4A6B] hover:bg-[#1E3447] text-white font-semibold rounded-lg transition-all"
            >
              View Position
            </button>
          </div>
        )}

        {/* Error */}
        {state.step === 'error' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Transaction Failed</h3>
            <p className="text-gray-600 mb-6">{state.error}</p>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="w-full h-12 bg-[#2C4A6B] hover:bg-[#1E3447] text-white font-semibold rounded-lg transition-all"
            >
              Try Again
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
        
        .animate-modal-in {
          animation: modal-in 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .position-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          border: 3px solid #2C4A6B;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .position-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

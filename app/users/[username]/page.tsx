'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  username: string;
  displayName: string;
  avatar: string;
  joinDate: string;
  bio: string;
  stats: {
    marketsCreated: number;
    positionsTaken: number;
    netOutcome: string;
    accuracy: number;
  };
  marketsCreated: Array<{
    id: string;
    question: string;
    category: string;
    currentBelief: number;
    status: string;
    participants: number;
    resolution?: string;
  }>;
  positions: Array<{
    marketId: string;
    question: string;
    position: string;
    amount: string;
    currentValue: string;
    change: string;
  }>;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'markets' | 'positions'>('markets');

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/users/${username}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('User not found');
          } else {
            setError('Failed to load user profile');
          }
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [username]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-24 w-24 bg-neutral-800 rounded-full mb-4" />
            <div className="h-8 w-48 bg-neutral-800 rounded mb-2" />
            <div className="h-4 w-64 bg-neutral-800 rounded mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-neutral-800 rounded" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">{error || 'User not found'}</h1>
          <p className="text-neutral-400 mb-8">
            {error === 'User not found' 
              ? 'This user doesn\'t exist or has been removed.'
              : 'Something went wrong loading this profile.'}
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </main>
      </div>
    );
  }

  const isNewUser = new Date(user.joinDate).toDateString() === new Date().toDateString();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="text-7xl">{user.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user.displayName}</h1>
                {isNewUser && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full">
                    New to Currents
                  </span>
                )}
              </div>
              <p className="text-neutral-400 mb-2">@{user.username}</p>
              <p className="text-neutral-300 mb-3">{user.bio}</p>
              <p className="text-sm text-neutral-500">
                Joined {new Date(user.joinDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-500">{user.stats.marketsCreated}</div>
              <div className="text-sm text-neutral-400">Markets Created</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-500">{user.stats.positionsTaken}</div>
              <div className="text-sm text-neutral-400">Positions</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className={`text-2xl font-bold ${user.stats.netOutcome.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {user.stats.netOutcome}
              </div>
              <div className="text-sm text-neutral-400">Net Outcome</div>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-500">{user.stats.accuracy}%</div>
              <div className="text-sm text-neutral-400">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-800 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('markets')}
              className={`pb-4 font-medium transition-colors relative ${
                activeTab === 'markets'
                  ? 'text-orange-500'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Markets Created
              {activeTab === 'markets' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('positions')}
              className={`pb-4 font-medium transition-colors relative ${
                activeTab === 'positions'
                  ? 'text-orange-500'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Positions
              {activeTab === 'positions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'markets' && (
          <div>
            {user.marketsCreated.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl text-neutral-400">No markets created yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {user.marketsCreated.map(market => (
                  <Link
                    key={market.id}
                    href={`/markets/${market.id}`}
                    className="block bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-orange-500 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium flex-1">{market.question}</h3>
                      {market.status === 'resolved' && market.resolution && (
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          market.resolution === 'YES' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          Resolved: {market.resolution}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-400">
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                        {market.category}
                      </span>
                      <span>{market.participants.toLocaleString()} participants</span>
                      {market.status === 'open' && (
                        <span className="text-orange-500 font-bold">
                          {market.currentBelief}% believe YES
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'positions' && (
          <div>
            {user.positions.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💰</div>
                <p className="text-xl text-neutral-400">No positions taken yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {user.positions.map(position => (
                  <div
                    key={position.marketId}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link
                          href={`/markets/${position.marketId}`}
                          className="text-lg font-medium hover:text-orange-500 transition-colors"
                        >
                          {position.question}
                        </Link>
                        <div className="mt-2">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            position.position === 'YES'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {position.position}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          position.change.startsWith('+')
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {position.change}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-neutral-400">Invested</div>
                        <div className="font-medium">{position.amount}</div>
                      </div>
                      <div>
                        <div className="text-neutral-400">Current Value</div>
                        <div className="font-medium">{position.currentValue}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

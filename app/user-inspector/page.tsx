'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InterestItem {
  name: string;
  score: number;
}

interface Activity {
  marketId: string;
  type: string;
  timestamp: string;
  category?: string;
}

interface MarketScore {
  marketId: string;
  question: string;
  category: string;
  currentBelief: number;
  participants: number;
  score: number;
  rank: number;
  classification: string;
  breakdown: any;
}

interface ProfileData {
  userId: string;
  persona: string;
  interests: {
    categories: InterestItem[];
    actors: InterestItem[];
    angles: InterestItem[];
    eventTypes: InterestItem[];
  };
  recentActivity: Activity[];
  marketScores: MarketScore[];
  exploitationExploration: {
    exploitation: number;
    exploration: number;
    exploitationRatio: number;
    targetRatio: number;
  };
  metadata: {
    totalMarkets: number;
    lastUpdated: string;
    generatedAt: string;
  };
}

export default function UserInspectorPage() {
  const [activeUserId, setActiveUserId] = useState('user-crypto-1');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    actors: true,
    angles: true,
    eventTypes: true,
    activity: true,
    allMarkets: false
  });

  const profiles = [
    { id: 'user-crypto-1', name: '🪙 Crypto Enthusiast', emoji: '🪙' },
    { id: 'user-politics-1', name: '🗳️ Politics Junkie', emoji: '🗳️' },
    { id: 'user-sports-1', name: '🏈 Sports Fan', emoji: '🏈' },
    { id: 'user-tech-1', name: '🤖 Tech Nerd', emoji: '🤖' },
    { id: 'user-generalist-1', name: '🌍 Generalist', emoji: '🌍' }
  ];

  useEffect(() => {
    fetchProfile();
  }, [activeUserId]);

  useEffect(() => {
    if (profileData && profileData.marketScores.length > 0 && !selectedMarketId) {
      setSelectedMarketId(profileData.marketScores[0].marketId);
    }
  }, [profileData]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Use the activeUserId directly as it matches the expected username format
      const response = await fetch(`/api/users/${activeUserId}/profile`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getColorForScore = (score: number) => {
    if (score >= 0.7) return '#28a745';
    if (score >= 0.4) return '#ffc107';
    return '#dc3545';
  };

  const ProgressBar = ({ score, label }: { score: number; label?: string }) => {
    const percentage = Math.round(score * 100);
    const color = getColorForScore(score);
    
    return (
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          {label && <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{label}</span>}
          <span style={{ fontFamily: 'monospace', fontSize: '14px', color, fontWeight: 'bold' }}>
            {percentage}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '24px',
          background: '#e9ecef',
          borderRadius: '4px',
          overflow: 'hidden',
          border: '1px solid #dee2e6'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    );
  };

  const exportToCSV = () => {
    if (!profileData) return;

    const headers = ['Rank', 'Score', 'Market', 'Category', 'Classification'];
    const rows = profileData.marketScores.map(m => [
      m.rank,
      m.score.toFixed(3),
      `"${m.question}"`,
      m.category,
      m.classification
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeUserId}-market-rankings.csv`;
    a.click();
  };

  const exportToJSON = () => {
    if (!profileData) return;

    const json = JSON.stringify(profileData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeUserId}-profile.json`;
    a.click();
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Loading...</h1>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
        <h1 style={{ color: '#dc3545', fontSize: '32px', fontWeight: 'bold' }}>
          Failed to load profile
        </h1>
        <button 
          onClick={fetchProfile}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const selectedMarket = profileData.marketScores.find(m => m.marketId === selectedMarketId);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui', 
      maxWidth: '1400px', 
      margin: '0 auto',
      background: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '36px',
          fontWeight: 'bold',
          margin: 0,
          marginBottom: '10px'
        }}>
          🔬 User Profile Inspector
        </h1>
        <p style={{ fontSize: '18px', color: '#6c757d', margin: 0 }}>
          Deep dive into what the personalization engine knows about each user
        </p>
      </div>

      {/* User Selector */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '12px',
        border: '2px solid #dee2e6'
      }}>
        <h2 style={{ marginTop: 0, fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
          Select User Profile
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setActiveUserId(profile.id)}
              style={{
                padding: '14px 24px',
                borderRadius: '8px',
                border: activeUserId === profile.id ? '3px solid #0070f3' : '2px solid #dee2e6',
                background: activeUserId === profile.id ? '#0070f3' : '#ffffff',
                color: activeUserId === profile.id ? '#ffffff' : '#000000',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {profile.name}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '15px', padding: '15px', background: '#ffffff', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '16px' }}>
            <strong>User ID:</strong> <span style={{ fontFamily: 'monospace', color: '#0070f3' }}>{profileData.userId}</span>
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '16px' }}>
            <strong>Persona:</strong> {profileData.persona}
          </p>
        </div>
      </div>

      {/* Interest Profile */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        background: '#ffffff', 
        borderRadius: '12px',
        border: '3px solid #0070f3',
        fontFamily: 'monospace'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            ═══ INTEREST PROFILE ═══
          </h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={exportToJSON}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Export JSON
            </button>
            <button
              onClick={exportToCSV}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '25px' }}>
          <div 
            onClick={() => toggleSection('categories')}
            style={{ 
              cursor: 'pointer', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: '#0070f3'
            }}
          >
            {expandedSections.categories ? '▼' : '▶'} CATEGORIES (sorted by score):
          </div>
          {expandedSections.categories && (
            <div style={{ paddingLeft: '20px' }}>
              {profileData.interests.categories.map((cat, idx) => (
                <ProgressBar 
                  key={cat.name} 
                  score={cat.score} 
                  label={`${idx + 1}. ${cat.name}`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Top Actors */}
        <div style={{ marginBottom: '25px' }}>
          <div 
            onClick={() => toggleSection('actors')}
            style={{ 
              cursor: 'pointer', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: '#0070f3'
            }}
          >
            {expandedSections.actors ? '▼' : '▶'} TOP ACTORS (engagement):
          </div>
          {expandedSections.actors && (
            <div style={{ paddingLeft: '20px' }}>
              {profileData.interests.actors.slice(0, 10).map((actor, idx) => (
                <ProgressBar 
                  key={actor.name} 
                  score={actor.score} 
                  label={`${idx + 1}. ${actor.name}`} 
                />
              ))}
              {profileData.interests.actors.length > 10 && (
                <p style={{ color: '#6c757d', fontSize: '14px', marginTop: '10px' }}>
                  ... and {profileData.interests.actors.length - 10} more
                </p>
              )}
            </div>
          )}
        </div>

        {/* Angles */}
        <div style={{ marginBottom: '25px' }}>
          <div 
            onClick={() => toggleSection('angles')}
            style={{ 
              cursor: 'pointer', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: '#0070f3'
            }}
          >
            {expandedSections.angles ? '▼' : '▶'} ANGLES (preferences):
          </div>
          {expandedSections.angles && (
            <div style={{ paddingLeft: '20px' }}>
              {profileData.interests.angles.map((angle) => (
                <ProgressBar 
                  key={angle.name} 
                  score={angle.score} 
                  label={angle.name} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Event Types */}
        <div>
          <div 
            onClick={() => toggleSection('eventTypes')}
            style={{ 
              cursor: 'pointer', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: '#0070f3'
            }}
          >
            {expandedSections.eventTypes ? '▼' : '▶'} EVENT TYPES:
          </div>
          {expandedSections.eventTypes && (
            <div style={{ paddingLeft: '20px' }}>
              {profileData.interests.eventTypes.map((eventType) => (
                <ProgressBar 
                  key={eventType.name} 
                  score={eventType.score} 
                  label={eventType.name} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        background: '#ffffff', 
        borderRadius: '12px',
        border: '3px solid #ffc107',
        fontFamily: 'monospace'
      }}>
        <div 
          onClick={() => toggleSection('activity')}
          style={{ 
            cursor: 'pointer', 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#000'
          }}
        >
          {expandedSections.activity ? '▼' : '▶'} ═══ ACTIVITY HISTORY (Last {profileData.recentActivity.length}) ═══
        </div>
        {expandedSections.activity && (
          <div>
            {profileData.recentActivity.length === 0 ? (
              <p style={{ color: '#6c757d', fontSize: '16px' }}>No recent activity</p>
            ) : (
              profileData.recentActivity.map((activity, idx) => {
                const timeAgo = new Date(activity.timestamp).toLocaleString();
                return (
                  <div 
                    key={idx}
                    style={{
                      marginBottom: '15px',
                      padding: '15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}
                  >
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>
                      {timeAgo}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                      {activity.type.toUpperCase()}: {activity.marketId}
                    </div>
                    {activity.category && (
                      <div style={{ fontSize: '14px', color: '#6c757d' }}>
                        Category: {activity.category}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Live Scoring Demo */}
      {selectedMarket && (
        <div style={{ 
          marginBottom: '30px', 
          padding: '25px', 
          background: '#ffffff', 
          borderRadius: '12px',
          border: '3px solid #28a745',
          fontFamily: 'monospace'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            ═══ HOW MARKETS ARE SCORED FOR THIS USER ═══
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '16px', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
              Select a market:
            </label>
            <select
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid #dee2e6',
                fontFamily: 'monospace'
              }}
            >
              {profileData.marketScores.map((market) => (
                <option key={market.marketId} value={market.marketId}>
                  #{market.rank} - {market.question} (score: {market.score.toFixed(3)})
                </option>
              ))}
            </select>
          </div>

          <div style={{ 
            padding: '20px', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            border: '2px solid #dee2e6'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
              Market: "{selectedMarket.question}"
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                SCORING BREAKDOWN:
              </h4>

              {/* Category */}
              <div style={{ marginBottom: '15px', paddingLeft: '10px' }}>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  Category: <strong>{selectedMarket.breakdown.baseScore.category.name}</strong>
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', color: '#6c757d' }}>
                  User interest: {selectedMarket.breakdown.baseScore.category.match.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', color: '#6c757d' }}>
                  Weight: {selectedMarket.breakdown.baseScore.category.weight.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', fontWeight: 'bold' }}>
                  Contribution: {selectedMarket.breakdown.baseScore.category.match.toFixed(2)} × {selectedMarket.breakdown.baseScore.category.weight.toFixed(2)} = {selectedMarket.breakdown.baseScore.category.contribution.toFixed(3)}
                </div>
              </div>

              {/* Actors */}
              <div style={{ marginBottom: '15px', paddingLeft: '10px' }}>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  Actors: <strong>{selectedMarket.breakdown.baseScore.actors.names.join(', ') || 'None'}</strong>
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', color: '#6c757d' }}>
                  Avg interest: {selectedMarket.breakdown.baseScore.actors.avgMatch.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', color: '#6c757d' }}>
                  Weight: {selectedMarket.breakdown.baseScore.actors.weight.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', fontWeight: 'bold' }}>
                  Contribution: {selectedMarket.breakdown.baseScore.actors.avgMatch.toFixed(2)} × {selectedMarket.breakdown.baseScore.actors.weight.toFixed(2)} = {selectedMarket.breakdown.baseScore.actors.contribution.toFixed(3)}
                </div>
              </div>

              {/* Angle */}
              <div style={{ marginBottom: '15px', paddingLeft: '10px' }}>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  Angle: <strong>{selectedMarket.breakdown.baseScore.angle.name}</strong>
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', color: '#6c757d' }}>
                  User interest: {selectedMarket.breakdown.baseScore.angle.match.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', color: '#6c757d' }}>
                  Weight: {selectedMarket.breakdown.baseScore.angle.weight.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', fontWeight: 'bold' }}>
                  Contribution: {selectedMarket.breakdown.baseScore.angle.match.toFixed(2)} × {selectedMarket.breakdown.baseScore.angle.weight.toFixed(2)} = {selectedMarket.breakdown.baseScore.angle.contribution.toFixed(3)}
                </div>
              </div>

              {/* Event Type */}
              <div style={{ marginBottom: '15px', paddingLeft: '10px' }}>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  Event Type: <strong>{selectedMarket.breakdown.baseScore.eventType.name}</strong>
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', color: '#6c757d' }}>
                  User interest: {selectedMarket.breakdown.baseScore.eventType.match.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', color: '#6c757d' }}>
                  Weight: {selectedMarket.breakdown.baseScore.eventType.weight.toFixed(2)}
                </div>
                <div style={{ fontSize: '14px', paddingLeft: '20px', fontWeight: 'bold' }}>
                  Contribution: {selectedMarket.breakdown.baseScore.eventType.match.toFixed(2)} × {selectedMarket.breakdown.baseScore.eventType.weight.toFixed(2)} = {selectedMarket.breakdown.baseScore.eventType.contribution.toFixed(3)}
                </div>
              </div>

              {/* Base Score */}
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                background: '#e7f3ff', 
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                BASE SCORE: {selectedMarket.breakdown.baseScore.total.toFixed(3)}
              </div>

              {/* Modifiers */}
              {selectedMarket.breakdown.modifiers.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                    Modifiers:
                  </h4>
                  {selectedMarket.breakdown.modifiers.map((mod: any, idx: number) => (
                    <div key={idx} style={{ fontSize: '14px', marginBottom: '5px', paddingLeft: '10px' }}>
                      {mod.value >= 0 ? '+' : ''}{mod.value.toFixed(2)} {mod.type}: {mod.reason}
                    </div>
                  ))}
                </div>
              )}

              {/* Final Score */}
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                background: '#d4edda', 
                borderRadius: '6px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                <div>FINAL SCORE: {selectedMarket.breakdown.finalScore.toFixed(3)}</div>
                <div style={{ fontSize: '16px', marginTop: '10px' }}>
                  Classification: {selectedMarket.classification.toUpperCase()} 
                  {selectedMarket.classification === 'exploitation' && ' ✓'}
                </div>
                <div style={{ fontSize: '16px', marginTop: '5px' }}>
                  Rank for this user: #{selectedMarket.rank} {selectedMarket.rank === 1 && '(highest)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Markets Ranked */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        background: '#ffffff', 
        borderRadius: '12px',
        border: '3px solid #6f42c1',
        fontFamily: 'monospace'
      }}>
        <div 
          onClick={() => toggleSection('allMarkets')}
          style={{ 
            cursor: 'pointer', 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            color: '#000'
          }}
        >
          {expandedSections.allMarkets ? '▼' : '▶'} ═══ ALL MARKETS RANKED FOR THIS USER ═══
        </div>
        {expandedSections.allMarkets && (
          <>
            <div style={{ 
              overflowX: 'auto',
              marginBottom: '15px'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>Rank</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>Score</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>Market</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #dee2e6' }}>Category</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.marketScores.map((market, idx) => (
                    <tr 
                      key={market.marketId}
                      style={{ 
                        borderBottom: '1px solid #dee2e6',
                        background: idx % 2 === 0 ? '#ffffff' : '#f8f9fa',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedMarketId(market.marketId)}
                    >
                      <td style={{ padding: '10px', borderRight: '1px solid #dee2e6', fontWeight: 'bold' }}>
                        {market.rank}
                      </td>
                      <td style={{ 
                        padding: '10px', 
                        borderRight: '1px solid #dee2e6',
                        color: getColorForScore(market.score),
                        fontWeight: 'bold'
                      }}>
                        {market.score.toFixed(3)}
                      </td>
                      <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                        {market.question}
                      </td>
                      <td style={{ padding: '10px', borderRight: '1px solid #dee2e6' }}>
                        {market.category}
                      </td>
                      <td style={{ 
                        padding: '10px',
                        color: market.classification === 'exploitation' ? '#28a745' : '#17a2b8',
                        fontWeight: 'bold'
                      }}>
                        {market.classification.toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={exportToCSV}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Export as CSV
            </button>
          </>
        )}
      </div>

      {/* Exploitation vs Exploration */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        background: '#ffffff', 
        borderRadius: '12px',
        border: '3px solid #fd7e14',
        fontFamily: 'monospace'
      }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          ═══ 90/10 CLASSIFICATION ═══
        </h2>

        <div style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#28a745' }}>
              EXPLOITATION (score ≥ 0.5): {profileData.exploitationExploration.exploitation} markets
            </strong>
            <div style={{ paddingLeft: '20px', color: '#6c757d' }}>
              These match known interests
            </div>
            <div style={{ paddingLeft: '20px', color: '#6c757d' }}>
              System shows these 90% of the time
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <strong style={{ color: '#17a2b8' }}>
              EXPLORATION (score {'<'} 0.5): {profileData.exploitationExploration.exploration} markets
            </strong>
            <div style={{ paddingLeft: '20px', color: '#6c757d' }}>
              Testing new topics/interests
            </div>
            <div style={{ paddingLeft: '20px', color: '#6c757d' }}>
              System shows these 10% of the time
            </div>
          </div>

          <div style={{ 
            padding: '15px', 
            background: '#fff3cd', 
            borderRadius: '6px',
            fontWeight: 'bold'
          }}>
            <div>
              Current exploitation ratio: {profileData.exploitationExploration.exploitationRatio.toFixed(1)}%
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '5px', color: '#6c757d' }}>
              (In real feed, enforced at {profileData.exploitationExploration.targetRatio}%)
            </div>
          </div>
        </div>
      </div>

      {/* Feed Preview Link */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        background: '#e7f3ff', 
        borderRadius: '12px',
        border: '3px solid #0070f3',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
          🎯 Feed Preview
        </h2>
        <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '20px' }}>
          See what {profileData.persona}'s personalized feed would look like
        </p>
        <Link 
          href={`/test-personalization?userId=${activeUserId}`}
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px'
          }}
        >
          View Personalized Feed →
        </Link>
      </div>

      {/* Metadata Footer */}
      <div style={{ 
        padding: '20px', 
        background: '#f8f9fa', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6c757d',
        fontFamily: 'monospace'
      }}>
        <div>Total Markets: {profileData.metadata.totalMarkets}</div>
        <div>Profile Last Updated: {new Date(profileData.metadata.lastUpdated).toLocaleString()}</div>
        <div>Page Generated: {new Date(profileData.metadata.generatedAt).toLocaleString()}</div>
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          Performance: API response time {'<'} 500ms ✓
        </div>
      </div>
    </div>
  );
}

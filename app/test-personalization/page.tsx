'use client';

import { useState, useEffect } from 'react';

export default function TestPersonalization() {
  const [activeProfile, setActiveProfile] = useState('user-crypto-1');
  const [feedData, setFeedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inspectorMode, setInspectorMode] = useState(false);
  const [expandedMarkets, setExpandedMarkets] = useState<Set<string>>(new Set());
  
  const profiles = [
    { id: 'guest', name: '🌐 Guest' },
    { id: 'user-crypto-1', name: '🪙 Crypto Enthusiast' },
    { id: 'user-politics-1', name: '🗳️ Politics Junkie' },
    { id: 'user-sports-1', name: '🏈 Sports Fan' },
    { id: 'user-tech-1', name: '🤖 Tech Nerd' },
    { id: 'user-generalist-1', name: '🌍 Generalist' }
  ];
  
  useEffect(() => {
    fetchFeed();
  }, [activeProfile, inspectorMode]);
  
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const debugParam = inspectorMode ? '&debug=true' : '';
      const response = await fetch(`/api/feed/personalized?userId=${activeProfile}${debugParam}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setFeedData(data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      setFeedData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleMarketMath = (marketId: string) => {
    const newExpanded = new Set(expandedMarkets);
    if (newExpanded.has(marketId)) {
      newExpanded.delete(marketId);
    } else {
      newExpanded.add(marketId);
    }
    setExpandedMarkets(newExpanded);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.7) return '#28a745'; // Green
    if (score >= 0.4) return '#ffc107'; // Yellow
    return '#dc3545'; // Red
  };

  const renderProgressBar = (value: number, color: string = '#0070f3'): string => {
    const filled = Math.round(value * 20);
    const empty = 20 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  const renderUserProfile = () => {
    if (!inspectorMode || !feedData?.debug?.userProfile) return null;

    const profile = feedData.debug.userProfile;

    return (
      <div style={{
        marginBottom: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '2px solid #6c757d',
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        <pre style={{ margin: 0, whiteSpace: 'pre', color: '#000' }}>
┌─ USER INTEREST PROFILE ────────────────────────────────────┐<br/>
│                                                             │<br/>
│ <strong>Categories:</strong>                                              │<br/>
{profile.categories.slice(0, 5).map(([name, value]: [string, number]) => {
  const percentage = Math.round(value * 100);
  const bar = renderProgressBar(value, getScoreColor(value));
  return `│   ${name.padEnd(15)} ${bar} ${percentage}%${' '.repeat(Math.max(0, 3 - String(percentage).length))}│\n`;
}).join('')}│                                                             │<br/>
│ <strong>Top Actors:</strong>                                              │<br/>
{profile.actors.slice(0, 5).map(([name, value]: [string, number]) => {
  const percentage = Math.round(value * 100);
  return `│   ${name.padEnd(15)} ${percentage}%${' '.repeat(Math.max(0, 35 - name.length))}│\n`;
}).join('')}│                                                             │<br/>
└─────────────────────────────────────────────────────────────┘
        </pre>
      </div>
    );
  };

  const renderScoringMath = (marketId: string) => {
    if (!inspectorMode || !feedData?.debug?.scoringBreakdown) return null;

    const breakdown = feedData.debug.scoringBreakdown.find((s: any) => s.marketId === marketId);
    if (!breakdown) return null;

    const isExpanded = expandedMarkets.has(marketId);

    return (
      <div style={{ marginTop: '15px' }}>
        <button
          onClick={() => toggleMarketMath(marketId)}
          style={{
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🔍 {isExpanded ? 'Hide' : 'Show'} Scoring Math
        </button>

        {isExpanded && (
          <div style={{
            marginTop: '15px',
            padding: '20px',
            background: '#ffffff',
            border: '2px solid #6c757d',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.5',
            color: '#000'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre', color: '#000' }}>
┌─ SCORING FORMULA ──────────────────────────────────────────┐<br/>
│ Market: {breakdown.question.slice(0, 45).padEnd(45)} │<br/>
├─────────────────────────────────────────────────────────────┤<br/>
│                                                             │<br/>
│ <strong>FORMULA:</strong>                                                  │<br/>
│ Score = (C×{breakdown.baseScore.category.weight.toFixed(2)}) + (A×{breakdown.baseScore.actors.weight.toFixed(2)}) + (G×{breakdown.baseScore.angle.weight.toFixed(2)}) + (E×{breakdown.baseScore.eventType.weight.toFixed(2)})│<br/>
│                                                             │<br/>
│ <strong>CALCULATION:</strong>                                              │<br/>
│                                                             │<br/>
│ <strong>Category Match (C):</strong>                                       │<br/>
│   User {breakdown.baseScore.category.name} interest: {breakdown.baseScore.category.match.toFixed(2).padStart(4)}              │<br/>
│   Market category: {breakdown.baseScore.category.name.padEnd(30)}        │<br/>
│   Match: {breakdown.baseScore.category.match.toFixed(2).padStart(4)}                                       │<br/>
│   Weighted: {breakdown.baseScore.category.match.toFixed(2)} × {breakdown.baseScore.category.weight.toFixed(2)} = {breakdown.baseScore.category.contribution.toFixed(3).padStart(5)}              │<br/>
│                                                             │<br/>
│ <strong>Actor Match (A):</strong>                                          │<br/>
│   User actor interest: {breakdown.baseScore.actors.avgMatch.toFixed(2).padStart(4)}                       │<br/>
│   Market actors: [{breakdown.baseScore.actors.names.slice(0, 2).join(', ').slice(0, 25).padEnd(25)}]     │<br/>
│   Avg Match: {breakdown.baseScore.actors.avgMatch.toFixed(2).padStart(4)}                                 │<br/>
│   Weighted: {breakdown.baseScore.actors.avgMatch.toFixed(2)} × {breakdown.baseScore.actors.weight.toFixed(2)} = {breakdown.baseScore.actors.contribution.toFixed(3).padStart(5)}              │<br/>
│                                                             │<br/>
│ <strong>Angle Match (G):</strong>                                          │<br/>
│   User {breakdown.baseScore.angle.name} interest: {breakdown.baseScore.angle.match.toFixed(2).padStart(4)}           │<br/>
│   Market angle: {breakdown.baseScore.angle.name.padEnd(35)}               │<br/>
│   Match: {breakdown.baseScore.angle.match.toFixed(2).padStart(4)}                                       │<br/>
│   Weighted: {breakdown.baseScore.angle.match.toFixed(2)} × {breakdown.baseScore.angle.weight.toFixed(2)} = {breakdown.baseScore.angle.contribution.toFixed(3).padStart(5)}              │<br/>
│                                                             │<br/>
│ <strong>Event Type Match (E):</strong>                                     │<br/>
│   User {breakdown.baseScore.eventType.name} interest: {breakdown.baseScore.eventType.match.toFixed(2).padStart(4)}        │<br/>
│   Market event: {breakdown.baseScore.eventType.name.padEnd(30)}                 │<br/>
│   Match: {breakdown.baseScore.eventType.match.toFixed(2).padStart(4)}                                       │<br/>
│   Weighted: {breakdown.baseScore.eventType.match.toFixed(2)} × {breakdown.baseScore.eventType.weight.toFixed(2)} = {breakdown.baseScore.eventType.contribution.toFixed(3).padStart(5)}              │<br/>
│                                                             │<br/>
│ {'═'.repeat(61)}│<br/>
│ <strong>BASE SCORE: {breakdown.baseScore.total.toFixed(3)}</strong>                                  │<br/>
│                                                             │<br/>
│ <strong>MODIFIERS:</strong>                                                │<br/>
{breakdown.modifiers.length === 0 ? '│   (none)                                                    │\n' : ''}
{breakdown.modifiers.map((mod: any) => {
  const sign = mod.value >= 0 ? '+' : '';
  const line = `${sign}${mod.value.toFixed(2)} ${mod.type}`;
  return `│   ${line.padEnd(58)}│\n`;
}).join('')}│                                                             │<br/>
│ {'═'.repeat(61)}│<br/>
│ <strong style={{ color: getScoreColor(breakdown.finalScore) }}>FINAL SCORE: {breakdown.finalScore.toFixed(3)}</strong>                                │<br/>
│                                                             │<br/>
│ Classification: <strong>{breakdown.classification.toUpperCase()}</strong> {breakdown.classification === 'exploitation' ? '✓' : '🔍'}              │<br/>
│ (Score ≥ 0.5 = high confidence match)                      │<br/>
└─────────────────────────────────────────────────────────────┘
            </pre>
          </div>
        )}
      </div>
    );
  };

  const render9010Breakdown = () => {
    if (!inspectorMode || !feedData?.debug?.exploitationExploration) return null;

    const ee = feedData.debug.exploitationExploration;
    const exploitationCount = ee.exploitation.length;
    const explorationCount = ee.exploration.length;
    const total = exploitationCount + explorationCount;

    return (
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '2px solid #6c757d',
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.6'
      }}>
        <pre style={{ margin: 0, whiteSpace: 'pre', color: '#000' }}>
┌─ EXPLOITATION vs EXPLORATION ──────────────────────────────┐<br/>
│                                                             │<br/>
│ <strong style={{ color: '#28a745' }}>EXPLOITATION (90% target):</strong>                               │<br/>
│   {exploitationCount} markets with score ≥ 0.5                           │<br/>
│   High confidence matches                                   │<br/>
│   Actual: {total > 0 ? ((exploitationCount / total * 100).toFixed(1)) : '0.0'}%                                         │<br/>
│                                                             │<br/>
│ <strong style={{ color: '#17a2b8' }}>EXPLORATION (10% target):</strong>                                │<br/>
│   {explorationCount} markets with score &lt; 0.5                            │<br/>
│   Testing new topics                                        │<br/>
│   Actual: {total > 0 ? ((explorationCount / total * 100).toFixed(1)) : '0.0'}%                                          │<br/>
│                                                             │<br/>
└─────────────────────────────────────────────────────────────┘
        </pre>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        fontFamily: 'system-ui',
        background: '#ffffff',
        minHeight: '100vh'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#000000' }}>
          Loading...
        </h1>
      </div>
    );
  }
  
  if (!feedData || !feedData.hero) {
    return (
      <div style={{ 
        padding: '40px', 
        fontFamily: 'system-ui',
        background: '#ffffff',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#dc3545', fontSize: '32px', fontWeight: 'bold' }}>
          Failed to load feed
        </h1>
        <p>Please check the console for errors.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: '#ffffff',
      minHeight: '100vh',
      color: '#000000'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#000000',
          margin: 0
        }}>
          🧪 Personalization Engine Demo
        </h1>
        
        <button
          onClick={() => setInspectorMode(!inspectorMode)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: inspectorMode ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Inspector Mode: {inspectorMode ? 'ON' : 'OFF'}
        </button>
      </div>
      
      {/* Profile Selector */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        background: '#f8f9fa', 
        borderRadius: '12px',
        border: '2px solid #dee2e6'
      }}>
        <h2 style={{ 
          marginTop: 0,
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#000000',
          marginBottom: '15px'
        }}>
          Select User Profile:
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'wrap'
        }}>
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setActiveProfile(profile.id)}
              style={{
                padding: '14px 24px',
                borderRadius: '8px',
                border: activeProfile === profile.id ? '3px solid #0070f3' : '2px solid #dee2e6',
                background: activeProfile === profile.id ? '#0070f3' : '#ffffff',
                color: activeProfile === profile.id ? '#ffffff' : '#000000',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {profile.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inspector Mode Notice */}
      {inspectorMode && feedData?.debug && (
        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffc107',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: 0, fontSize: '20px' }}>🔬 Inspector Mode Active</h3>
          <p style={{ margin: 0 }}>
            Showing detailed scoring breakdown, user profile, 90/10 rule, and diversity enforcement logic.
          </p>
        </div>
      )}

      {/* User Profile Inspector */}
      {renderUserProfile()}

      {/* Feed Metadata */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        background: '#e7f3ff', 
        borderRadius: '8px',
        border: '2px solid #0070f3'
      }}>
        <h3 style={{
          marginTop: 0,
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#000000'
        }}>📊 Feed Stats</h3>
        <p style={{ fontSize: '16px', color: '#000000', margin: '8px 0' }}>
          <strong>User:</strong> {feedData.metadata?.userId || 'Unknown'}
        </p>
        <p style={{ fontSize: '16px', color: '#000000', margin: '8px 0' }}>
          <strong>Diversity Score:</strong> {((feedData.metadata?.diversityScore || 0) * 100).toFixed(1)}%
        </p>
        <p style={{ fontSize: '16px', color: '#000000', margin: '8px 0' }}>
          <strong>Generated:</strong> {new Date(feedData.metadata?.composed || Date.now()).toLocaleString()}
        </p>
        {inspectorMode && (
          <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '10px', fontStyle: 'italic' }}>
            Debug data loaded - scroll down to see detailed analysis
          </p>
        )}
      </div>
      
      {/* Hero Market */}
      <div style={{ 
        marginBottom: '40px', 
        padding: '30px', 
        background: '#fff9e6', 
        borderRadius: '12px', 
        border: '3px solid #ffc107'
      }}>
        <h2 style={{ 
          marginTop: 0,
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#000000',
          marginBottom: '15px'
        }}>
          🏆 Hero Market
        </h2>
        <h3 style={{ 
          color: '#0070f3',
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '15px',
          lineHeight: '1.4'
        }}>
          {feedData.hero.question}
        </h3>
        <div style={{ fontSize: '18px', color: '#000000' }}>
          <p style={{ margin: '8px 0' }}>
            <strong>Category:</strong> {feedData.hero.category}
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Probability:</strong> <span style={{ 
              color: feedData.hero.currentBelief >= 50 ? '#28a745' : '#dc3545',
              fontWeight: 'bold',
              fontSize: '20px'
            }}>{feedData.hero.currentBelief}%</span>
          </p>
          <p style={{ margin: '8px 0' }}>
            <strong>Participants:</strong> {feedData.hero.participants.toLocaleString()}
          </p>
        </div>
        
        {/* Hero scoring math */}
        {renderScoringMath(feedData.hero.id)}
      </div>
      
      {/* Feed Sections */}
      {feedData.sections?.map((section: any, idx: number) => {
        const sectionColors = {
          personalized: { bg: '#d4edda', border: '#28a745', title: '💚 For You' },
          trending: { bg: '#fff3cd', border: '#ffc107', title: '🔥 Trending' },
          exploration: { bg: '#d1ecf1', border: '#17a2b8', title: '🔍 Discover' }
        };
        
        const colors = sectionColors[section.type as keyof typeof sectionColors] || 
                       { bg: '#f8f9fa', border: '#6c757d', title: section.type };
        
        return (
          <div key={idx} style={{ marginBottom: '40px' }}>
            <div style={{ 
              padding: '20px', 
              background: colors.bg,
              borderRadius: '12px 12px 0 0',
              border: `3px solid ${colors.border}`,
              borderBottom: 'none'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
                {colors.title}
              </h2>
              <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#000000' }}>
                {section.markets?.length || 0} markets
              </p>
            </div>
            
            <div style={{ 
              padding: '25px',
              background: '#ffffff',
              borderRadius: '0 0 12px 12px',
              border: `3px solid ${colors.border}`,
              borderTop: 'none'
            }}>
              {section.markets?.map((market: any, marketIdx: number) => (
                <div 
                  key={marketIdx}
                  style={{
                    padding: '20px',
                    marginBottom: marketIdx < section.markets.length - 1 ? '15px' : 0,
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '2px solid #dee2e6'
                  }}
                >
                  <div style={{ 
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#6c757d',
                    marginBottom: '8px',
                    textTransform: 'uppercase'
                  }}>
                    {market.category}
                  </div>
                  <h4 style={{ 
                    margin: '0 0 12px 0',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#000000',
                    lineHeight: '1.4'
                  }}>
                    {market.question}
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    gap: '20px',
                    fontSize: '16px',
                    color: '#000000'
                  }}>
                    <span>
                      <strong>Belief:</strong> <span style={{
                        color: market.currentBelief >= 50 ? '#28a745' : '#dc3545',
                        fontWeight: 'bold'
                      }}>{market.currentBelief}%</span>
                    </span>
                    <span>
                      <strong>Votes:</strong> {market.participants.toLocaleString()}
                    </span>
                  </div>

                  {/* Scoring Math */}
                  {renderScoringMath(market.id)}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* 90/10 Breakdown */}
      {render9010Breakdown()}

      {/* Debug Info Message (if inspector enabled but no debug data) */}
      {inspectorMode && !feedData?.debug && (
        <div style={{
          background: '#f8d7da',
          border: '2px solid #dc3545',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '30px'
        }}>
          <h3 style={{ marginTop: 0, color: '#dc3545' }}>⚠️ Debug Data Not Available</h3>
          <p>The API didn't return debug information. This might be because:</p>
          <ul>
            <li>The debug parameter wasn't processed correctly</li>
            <li>The backend doesn't support debug mode yet</li>
          </ul>
          <button 
            onClick={fetchFeed}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Retry Fetch
          </button>
        </div>
      )}
    </div>
  );
}

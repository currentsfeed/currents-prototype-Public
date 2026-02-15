'use client';

import { useState, useEffect } from 'react';

export default function TestPersonalization() {
  const [activeProfile, setActiveProfile] = useState('user-crypto-1');
  const [feedData, setFeedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inspectorMode, setInspectorMode] = useState(false);
  const [expandedMarket, setExpandedMarket] = useState<string | null>(null);
  
  const profiles = [
    { id: 'guest', name: '🌐 Guest', emoji: '🌐' },
    { id: 'user-crypto-1', name: '🪙 Crypto Enthusiast', emoji: '🪙' },
    { id: 'user-politics-1', name: '🗳️ Politics Junkie', emoji: '🗳️' },
    { id: 'user-sports-1', name: '🏈 Sports Fan', emoji: '🏈' },
    { id: 'user-tech-1', name: '🤖 Tech Nerd', emoji: '🤖' },
    { id: 'user-generalist-1', name: '🌍 Generalist', emoji: '🌍' }
  ];
  
  useEffect(() => {
    fetchFeed();
  }, [activeProfile, inspectorMode]);
  
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const debugParam = inspectorMode ? '&debug=true' : '';
      const response = await fetch(`/api/feed/personalized?userId=${activeProfile}${debugParam}`);
      const data = await response.json();
      setFeedData(data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = (value: number, maxValue: number = 1) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div style={{
        width: '200px',
        height: '20px',
        background: '#e9ecef',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: '#0070f3',
          transition: 'width 0.3s'
        }} />
      </div>
    );
  };

  const renderScoringBreakdown = (breakdown: any) => {
    return (
      <div style={{
        fontFamily: 'monospace',
        fontSize: '14px',
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '15px',
        border: '2px solid #dee2e6'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>
          Market: "{breakdown.question.substring(0, 60)}..."
        </div>
        
        <div style={{ 
          border: '2px solid #6c757d', 
          padding: '15px',
          borderRadius: '8px',
          background: '#ffffff'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>┌─ Base Score Calculation ─────────────────┐</div>
          
          <div style={{ marginLeft: '20px' }}>
            <div>Category Match ({breakdown.baseScore.category.name}): {breakdown.baseScore.category.match.toFixed(2)} × {breakdown.baseScore.category.weight.toFixed(1)} = {breakdown.baseScore.category.contribution.toFixed(3)}</div>
            <div>Actor Match ({breakdown.baseScore.actors.names.join(', ') || 'none'}): {breakdown.baseScore.actors.avgMatch.toFixed(2)} × {breakdown.baseScore.actors.weight.toFixed(1)} = {breakdown.baseScore.actors.contribution.toFixed(3)}</div>
            <div>Angle Match ({breakdown.baseScore.angle.name}): {breakdown.baseScore.angle.match.toFixed(2)} × {breakdown.baseScore.angle.weight.toFixed(1)} = {breakdown.baseScore.angle.contribution.toFixed(3)}</div>
            <div>Event Type Match ({breakdown.baseScore.eventType.name}): {breakdown.baseScore.eventType.match.toFixed(2)} × {breakdown.baseScore.eventType.weight.toFixed(1)} = {breakdown.baseScore.eventType.contribution.toFixed(3)}</div>
          </div>
          
          <div style={{ margin: '10px 0', borderTop: '1px solid #dee2e6', paddingTop: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Base Relevance Score: {breakdown.baseScore.total.toFixed(3)}</div>
          </div>
          
          {breakdown.modifiers.length > 0 && (
            <>
              <div style={{ marginTop: '10px', fontWeight: 'bold' }}>Modifiers:</div>
              <div style={{ marginLeft: '20px' }}>
                {breakdown.modifiers.map((mod: any, idx: number) => (
                  <div key={idx} style={{ color: mod.value >= 0 ? '#28a745' : '#dc3545' }}>
                    {mod.value >= 0 ? '+' : ''} {mod.type}: {mod.value >= 0 ? '+' : ''}{mod.value.toFixed(3)} ({mod.reason})
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div style={{ margin: '10px 0', borderTop: '1px solid #dee2e6', paddingTop: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>Final Score: {breakdown.finalScore.toFixed(3)}</div>
            <div>Classification: <span style={{
              color: breakdown.classification === 'exploitation' ? '#28a745' : '#17a2b8',
              fontWeight: 'bold'
            }}>
              {breakdown.classification.toUpperCase()} {breakdown.classification === 'exploitation' ? '(>0.5 threshold)' : '(<0.5 threshold)'}
            </span></div>
          </div>
          
          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>└─────────────────────────────────────────┘</div>
        </div>
      </div>
    );
  };

  const renderUserProfileInspector = (profile: any) => {
    return (
      <div style={{
        background: '#f0f8ff',
        padding: '25px',
        borderRadius: '12px',
        border: '3px solid #0070f3',
        marginBottom: '30px',
        fontFamily: 'system-ui'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '24px' }}>
          🔍 User Profile Inspector
        </h2>
        
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>
            User: {profile.userId}
          </div>
          
          <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Categories:</h3>
          {profile.categories.map(([cat, score]: [string, number]) => (
            <div key={cat} style={{ marginBottom: '8px' }}>
              <span style={{ display: 'inline-block', width: '150px', fontWeight: 'bold' }}>{cat}:</span>
              {renderProgressBar(score)} {(score * 100).toFixed(0)}%
            </div>
          ))}
          
          <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Actors (Top 10):</h3>
          {profile.actors.map(([actor, score]: [string, number]) => (
            <div key={actor} style={{ marginBottom: '8px' }}>
              <span style={{ display: 'inline-block', width: '150px', fontWeight: 'bold' }}>{actor}:</span>
              {renderProgressBar(score)} {(score * 100).toFixed(0)}%
            </div>
          ))}
          
          <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Angles:</h3>
          {profile.angles.map(([angle, score]: [string, number]) => (
            <div key={angle} style={{ marginBottom: '8px' }}>
              <span style={{ display: 'inline-block', width: '150px', fontWeight: 'bold' }}>{angle}:</span>
              {renderProgressBar(score)} {(score * 100).toFixed(0)}%
            </div>
          ))}
          
          <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px' }}>Recent Activity (Last 10):</h3>
          <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            {profile.recentActivity.map((activity: any, idx: number) => (
              <div key={idx} style={{ marginBottom: '5px' }}>
                {idx + 1}. {activity.type.toUpperCase()} - Market #{activity.marketId.substring(0, 8)}...
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const render90_10Visualization = (debug: any) => {
    return (
      <div style={{
        background: '#f0fff4',
        padding: '25px',
        borderRadius: '12px',
        border: '3px solid #28a745',
        marginBottom: '30px',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '24px', fontFamily: 'system-ui' }}>
          📊 90/10 Rule Visualization
        </h2>
        
        <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px', fontFamily: 'system-ui', color: '#28a745' }}>
          EXPLOITATION (90% target):
        </h3>
        {debug.exploitationExploration.exploitation.slice(0, 6).map((market: any, idx: number) => (
          <div key={market.id} style={{ marginBottom: '5px' }}>
            ✓ {market.question.substring(0, 50)}... (category: {market.category})
          </div>
        ))}
        
        <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px', fontFamily: 'system-ui', color: '#17a2b8' }}>
          EXPLORATION (10% target):
        </h3>
        {debug.exploitationExploration.exploration.map((market: any, idx: number) => (
          <div key={market.id} style={{ marginBottom: '5px' }}>
            ? {market.question.substring(0, 50)}... (category: {market.category})
          </div>
        ))}
        
        <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px', fontFamily: 'system-ui', color: '#dc3545' }}>
          REJECTED (below threshold or diversity rules):
        </h3>
        {debug.exploitationExploration.rejected.slice(0, 5).map((market: any, idx: number) => (
          <div key={market.id} style={{ marginBottom: '5px' }}>
            ✗ {market.question.substring(0, 50)}... - {market._rejectionReason} (score: {market._score?.toFixed(3) || 'N/A'})
          </div>
        ))}
      </div>
    );
  };

  const renderDiversityEnforcement = (debug: any) => {
    return (
      <div style={{
        background: '#fff3e0',
        padding: '25px',
        borderRadius: '12px',
        border: '3px solid #ff9800',
        marginBottom: '30px',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '24px', fontFamily: 'system-ui' }}>
          🎨 Diversity Rule Enforcement
        </h2>
        
        <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px', fontFamily: 'system-ui' }}>
          Initial ranked list (by score):
        </h3>
        {debug.diversityEnforcement.before.slice(0, 8).map((market: any, idx: number) => (
          <div key={market.id} style={{ marginBottom: '5px' }}>
            {idx + 1}. [{market.category}] {market.question.substring(0, 40)}...
          </div>
        ))}
        
        {debug.diversityEnforcement.blocked.length > 0 && (
          <>
            <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px', fontFamily: 'system-ui', color: '#dc3545' }}>
              Blocked by diversity rules:
            </h3>
            {debug.diversityEnforcement.blocked.map((market: any, idx: number) => (
              <div key={market.id} style={{ marginBottom: '5px', color: '#dc3545' }}>
                ← BLOCKED: [{market.category}] {market.question.substring(0, 40)}... (3rd consecutive {market.category})
              </div>
            ))}
          </>
        )}
        
        <h3 style={{ fontSize: '18px', marginTop: '20px', marginBottom: '10px', fontFamily: 'system-ui', color: '#28a745' }}>
          Final Feed (diversity-enforced):
        </h3>
        {debug.diversityEnforcement.after.slice(0, 10).map((market: any, idx: number) => (
          <div key={market.id} style={{ marginBottom: '5px' }}>
            {idx + 1}. [{market.category}] {market.question.substring(0, 40)}...
          </div>
        ))}
      </div>
    );
  };

  const renderCompositionMath = (debug: any) => {
    return (
      <div style={{
        background: '#f3e5f5',
        padding: '25px',
        borderRadius: '12px',
        border: '3px solid #9c27b0',
        marginBottom: '30px',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '24px', fontFamily: 'system-ui' }}>
          📐 Feed Composition Math
        </h2>
        
        <div style={{ background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>
            Target: 15 markets total
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>PERSONALIZED SECTION (60% = 9 markets):</div>
            <div style={{ marginLeft: '20px' }}>Actual: {debug.compositionMath.actual.personalized}%</div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>TRENDING SECTION (20% = 3 markets):</div>
            <div style={{ marginLeft: '20px' }}>Actual: {debug.compositionMath.actual.trending}%</div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>EXPLORATION SECTION (20% = 3 markets):</div>
            <div style={{ marginLeft: '20px' }}>Actual: {debug.compositionMath.actual.exploration}%</div>
          </div>
          
          <div style={{ borderTop: '2px solid #dee2e6', paddingTop: '15px', marginTop: '15px' }}>
            <div style={{ fontWeight: 'bold' }}>FINAL FEED (validated):</div>
            <div style={{ marginLeft: '20px' }}>
              <div>✓ Personalized: {debug.compositionMath.actual.personalized}%</div>
              <div>✓ Trending: {debug.compositionMath.actual.trending}%</div>
              <div>✓ Exploration: {debug.compositionMath.actual.exploration}%</div>
              <div>✓ Diversity: Max 2 consecutive same-category</div>
              <div>✓ No duplicates</div>
            </div>
          </div>
        </div>
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
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#000000'
        }}>Loading...</h1>
      </div>
    );
  }
  
  if (!feedData) {
    return (
      <div style={{ 
        padding: '40px', 
        fontFamily: 'system-ui',
        background: '#ffffff',
        minHeight: '100vh'
      }}>
        <h1 style={{ 
          color: '#dc3545',
          fontSize: '32px',
          fontWeight: 'bold'
        }}>Failed to load feed</h1>
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
          marginBottom: 0,
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#000000'
        }}>
          🧪 Personalization Engine Demo
        </h1>
        
        <button
          onClick={() => setInspectorMode(!inspectorMode)}
          style={{
            padding: '14px 28px',
            borderRadius: '8px',
            border: inspectorMode ? '3px solid #28a745' : '2px solid #0070f3',
            background: inspectorMode ? '#28a745' : '#0070f3',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.2s'
          }}
        >
          {inspectorMode ? '🔍 Inspector Mode: ON' : '👁️ Simple View'}
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
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
            >
              {profile.name}
            </button>
          ))}
        </div>
      </div>

      {/* Inspector Mode Content */}
      {inspectorMode && feedData.debug && (
        <>
          {renderUserProfileInspector(feedData.debug.userProfile)}
          {render90_10Visualization(feedData.debug)}
          {renderDiversityEnforcement(feedData.debug)}
          {renderCompositionMath(feedData.debug)}
          
          <div style={{
            background: '#e3f2fd',
            padding: '25px',
            borderRadius: '12px',
            border: '3px solid #2196f3',
            marginBottom: '30px'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '24px' }}>
              🔬 Detailed Scoring Breakdown (All Markets)
            </h2>
            {feedData.debug.scoringBreakdown.map((breakdown: any, idx: number) => (
              <div key={idx}>
                {renderScoringBreakdown(breakdown)}
              </div>
            ))}
          </div>
        </>
      )}
      
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
        <p style={{ 
          fontSize: '16px',
          color: '#000000',
          margin: '8px 0'
        }}>
          <strong>User:</strong> {feedData.metadata.userId}
        </p>
        <p style={{ 
          fontSize: '16px',
          color: '#000000',
          margin: '8px 0'
        }}>
          <strong>Diversity Score:</strong> {(feedData.metadata.diversityScore * 100).toFixed(1)}%
        </p>
        <p style={{ 
          fontSize: '16px',
          color: '#000000',
          margin: '8px 0'
        }}>
          <strong>Generated:</strong> {new Date(feedData.metadata.composed).toLocaleString()}
        </p>
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
        
        {inspectorMode && feedData.debug && feedData.debug.scoringBreakdown.find((b: any) => b.marketId === feedData.hero.id) && (
          <button
            onClick={() => setExpandedMarket(expandedMarket === feedData.hero.id ? null : feedData.hero.id)}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              borderRadius: '6px',
              border: '2px solid #0070f3',
              background: '#ffffff',
              color: '#0070f3',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {expandedMarket === feedData.hero.id ? '▼ Hide Scoring' : '🔍 Inspect Scoring'}
          </button>
        )}
        
        {expandedMarket === feedData.hero.id && feedData.debug && (
          renderScoringBreakdown(feedData.debug.scoringBreakdown.find((b: any) => b.marketId === feedData.hero.id))
        )}
      </div>
      
      {/* Feed Sections */}
      {feedData.sections.map((section: any, idx: number) => {
        const sectionColors = {
          personalized: { bg: '#d4edda', border: '#28a745', title: '💚 For You', emoji: '🟢' },
          trending: { bg: '#fff3cd', border: '#ffc107', title: '🔥 Trending', emoji: '🟡' },
          exploration: { bg: '#d1ecf1', border: '#17a2b8', title: '🔍 Discover', emoji: '🔵' }
        };
        
        const colors = sectionColors[section.type as keyof typeof sectionColors] || 
                       { bg: '#f8f9fa', border: '#6c757d', title: section.type, emoji: '⚪' };
        
        return (
          <div key={idx} style={{ marginBottom: '40px' }}>
            <div style={{ 
              padding: '20px', 
              background: colors.bg,
              borderRadius: '12px 12px 0 0',
              border: `3px solid ${colors.border}`,
              borderBottom: 'none'
            }}>
              <h2 style={{ 
                margin: 0,
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000000'
              }}>
                {colors.title}
              </h2>
              <p style={{ 
                margin: '5px 0 0 0',
                fontSize: '16px',
                color: '#000000'
              }}>
                {section.markets.length} markets
              </p>
            </div>
            
            <div style={{ 
              padding: '25px',
              background: '#ffffff',
              borderRadius: '0 0 12px 12px',
              border: `3px solid ${colors.border}`,
              borderTop: 'none'
            }}>
              {section.markets.map((market: any, marketIdx: number) => {
                const breakdown = feedData.debug?.scoringBreakdown.find((b: any) => b.marketId === market.id);
                const isExpanded = expandedMarket === market.id;
                
                return (
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
                      {colors.emoji} {market.category}
                      {breakdown && (
                        <span style={{ marginLeft: '10px', fontSize: '12px', fontFamily: 'monospace' }}>
                          Score: {breakdown.finalScore.toFixed(3)} | {breakdown.classification.toUpperCase()}
                        </span>
                      )}
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
                    
                    {inspectorMode && breakdown && (
                      <>
                        <button
                          onClick={() => setExpandedMarket(isExpanded ? null : market.id)}
                          style={{
                            marginTop: '15px',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            border: '2px solid #0070f3',
                            background: '#ffffff',
                            color: '#0070f3',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}
                        >
                          {isExpanded ? '▼ Hide Details' : '🔍 Inspect'}
                        </button>
                        
                        {isExpanded && renderScoringBreakdown(breakdown)}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

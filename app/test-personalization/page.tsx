'use client';

import { useState, useEffect } from 'react';

export default function TestPersonalization() {
  const [activeProfile, setActiveProfile] = useState('user-crypto-1');
  const [feedData, setFeedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inspectorMode, setInspectorMode] = useState(false);
  
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
                </div>
              ))}
            </div>
          </div>
        );
      })}

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

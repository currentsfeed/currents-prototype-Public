'use client';

import { useState, useEffect } from 'react';

export default function TestPersonalization() {
  const [activeProfile, setActiveProfile] = useState('user-crypto-1');
  const [feedData, setFeedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
  }, [activeProfile]);
  
  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/feed/personalized?userId=${activeProfile}`);
      const data = await response.json();
      setFeedData(data);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
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
      <h1 style={{ 
        marginBottom: '30px',
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#000000'
      }}>
        🧪 Personalization Engine Demo
      </h1>
      
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
      </div>
      
      {/* Feed Sections */}
      {feedData.sections.map((section: any, idx: number) => {
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
              {section.markets.map((market: any, marketIdx: number) => (
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
    </div>
  );
}

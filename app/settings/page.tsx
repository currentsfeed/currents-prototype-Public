'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Settings {
  account: {
    username: string;
    displayName: string;
    email: string;
    bio: string;
    avatar: string;
    joinDate: string;
    balance: string;
  };
  notifications: {
    emailMarketUpdates: boolean;
    emailPositionChanges: boolean;
    emailNewsletter: boolean;
    pushMarketResolution: boolean;
    pushPriceAlerts: boolean;
  };
  privacy: {
    profileVisibility: string;
    showPositions: boolean;
    showMarketsCreated: boolean;
    showStats: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/users/me/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  async function handleSave() {
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/users/me/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
      // Clear message after 3s
      setTimeout(() => setMessage(null), 3000);
    }
  }

  function updateAccount(field: string, value: string) {
    if (!settings) return;
    setSettings({
      ...settings,
      account: { ...settings.account, [field]: value }
    });
  }

  function updateNotification(field: string, value: boolean) {
    if (!settings) return;
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value }
    });
  }

  function updatePrivacy(field: string, value: any) {
    if (!settings) return;
    setSettings({
      ...settings,
      privacy: { ...settings.privacy, [field]: value }
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-neutral-800 rounded" />
            <div className="h-64 bg-neutral-800 rounded" />
          </div>
        </main>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <h1 className="text-3xl font-bold mb-4">Failed to load settings</h1>
          <Link href="/" className="text-orange-500 hover:underline">Go Home</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-orange-500">Currents</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-neutral-400">Manage your account preferences</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/50 text-green-400'
              : 'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          {/* Account Section */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={settings.account.username}
                  disabled
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-neutral-500 mt-1">Username cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={settings.account.displayName}
                  onChange={(e) => updateAccount('displayName', e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={settings.account.email}
                  onChange={(e) => updateAccount('email', e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={settings.account.bio}
                  onChange={(e) => updateAccount('bio', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-neutral-400">Member since</div>
                  <div className="font-medium">{new Date(settings.account.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                </div>
                <div>
                  <div className="text-neutral-400">Account balance</div>
                  <div className="font-medium text-orange-500">{settings.account.balance}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Market updates</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailMarketUpdates}
                      onChange={(e) => updateNotification('emailMarketUpdates', e.target.checked)}
                      className="w-5 h-5 text-orange-500 bg-neutral-800 border-neutral-700 rounded focus:ring-orange-500 focus:ring-2"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Position changes</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailPositionChanges}
                      onChange={(e) => updateNotification('emailPositionChanges', e.target.checked)}
                      className="w-5 h-5 text-orange-500 bg-neutral-800 border-neutral-700 rounded focus:ring-orange-500 focus:ring-2"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Newsletter</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNewsletter}
                      onChange={(e) => updateNotification('emailNewsletter', e.target.checked)}
                      className="w-5 h-5 text-orange-500 bg-neutral-800 border-neutral-700 rounded focus:ring-orange-500 focus:ring-2"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <h3 className="font-medium mb-3">Push Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Market resolutions</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushMarketResolution}
                      onChange={(e) => updateNotification('pushMarketResolution', e.target.checked)}
                      className="w-5 h-5 text-orange-500 bg-neutral-800 border-neutral-700 rounded focus:ring-orange-500 focus:ring-2"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span>Price alerts</span>
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushPriceAlerts}
                      onChange={(e) => updateNotification('pushPriceAlerts', e.target.checked)}
                      className="w-5 h-5 text-orange-500 bg-neutral-800 border-neutral-700 rounded focus:ring-orange-500 focus:ring-2"
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Privacy</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => updatePrivacy('profileVisibility', e.target.value)}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:border-orange-500 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="public">Public - Anyone can view</option>
                  <option value="private">Private - Hidden from others</option>
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-medium">Show positions</div>
                    <div className="text-sm text-neutral-400">Display your market positions on your profile</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showPositions}
                    onChange={(e) => updatePrivacy('showPositions', e.target.checked)}
                    className="w-5 h-5 text-orange-500 bg-neutral-800 border-neutral-700 rounded focus:ring-orange-500 focus:ring-2"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-medium">Show markets created</div>
                    <div className="text-sm text-neutral-400">Display markets you've created</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showMarketsCreated}
                    onChange={(e) => updatePrivacy('showMarketsCreated', e.target.checked)}
                    className="w-5 h-5 text-orange-500 bg-neutral-800 border-neutral-700 rounded focus:ring-orange-500 focus:ring-2"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-medium">Show stats</div>
                    <div className="text-sm text-neutral-400">Display your performance statistics</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showStats}
                    onChange={(e) => updatePrivacy('showStats', e.target.checked)}
                    className="w-5 h-5 text-orange-500 bg-neutral-800 border-neutral-700 rounded focus:ring-orange-500 focus:ring-2"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Mock authentication state - replace with real auth when integrated
  const isAuthenticated = false;

  const categories = [
    { name: 'Politics', href: '/categories/politics' },
    { name: 'Technology', href: '/categories/technology' },
    { name: 'Economics', href: '/categories/economics' },
    { name: 'Global', href: '/categories/global' },
  ];

  return (
    <nav className="header fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[--accent-brand] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">Currents</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              Browse
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center space-x-1"
              >
                <span>Categories</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {categoriesOpen && (
                <div className="absolute top-full mt-1 left-0 w-48 bg-[--bg-elevated] rounded-lg shadow-xl border border-[rgba(255,255,255,0.05)] py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block px-4 py-2 text-sm text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/my-positions" className="px-4 py-2 rounded-lg text-sm font-medium text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              My Positions
            </Link>
            
            <Link href="/markets/create" className="px-4 py-2 rounded-lg text-sm font-medium text-[--accent-brand] hover:bg-[rgba(255,77,42,0.1)] transition-colors">
              Create Market
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link href="/notifications" className="p-2 rounded-lg text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {/* Notification badge - show when there are notifications */}
                  {/* <span className="absolute top-1 right-1 w-2 h-2 bg-[--accent-brand] rounded-full"></span> */}
                </Link>

                <Link href="/settings" className="p-2 rounded-lg text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>

                {/* User Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[--accent-brand] to-[--accent-orange] flex items-center justify-center text-white text-sm font-medium hover:opacity-80 transition-opacity"
                  >
                    U
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute top-full mt-2 right-0 w-48 bg-[--bg-elevated] rounded-lg shadow-xl border border-[rgba(255,255,255,0.05)] py-2">
                      <Link href="/users/profile" className="block px-4 py-2 text-sm text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                        Profile
                      </Link>
                      <Link href="/my-positions" className="block px-4 py-2 text-sm text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                        My Positions
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                        Settings
                      </Link>
                      <div className="border-t border-[rgba(255,255,255,0.05)] my-2"></div>
                      <button className="w-full text-left px-4 py-2 text-sm text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button className="btn-secondary px-4 py-2">
                  Sign In
                </button>
                <button className="btn-primary px-4 py-2">
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(255,255,255,0.05)]">
          <div className="px-4 py-4 space-y-2 bg-[--bg-header]">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg text-sm font-medium text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse
            </Link>

            {/* Categories in mobile */}
            <div className="space-y-1">
              <div className="px-4 py-2 text-xs font-semibold text-[--text-tertiary] uppercase tracking-wider">
                Categories
              </div>
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block px-4 py-2 pl-8 rounded-lg text-sm text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <Link
              href="/my-positions"
              className="block px-4 py-2 rounded-lg text-sm font-medium text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Positions
            </Link>

            <Link
              href="/markets/create"
              className="block px-4 py-2 rounded-lg text-sm font-medium text-[--accent-brand] hover:bg-[rgba(255,77,42,0.1)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Market
            </Link>

            <div className="border-t border-[rgba(255,255,255,0.05)] my-4"></div>

            {isAuthenticated ? (
              <>
                <Link
                  href="/notifications"
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Notifications
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>

                <Link
                  href="/users/profile"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>

                <button className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-[--text-secondary] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <button className="w-full btn-secondary">
                  Sign In
                </button>
                <button className="w-full btn-primary">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

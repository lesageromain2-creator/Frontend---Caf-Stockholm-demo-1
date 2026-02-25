/**
 * Header Kafé Stockholm — sticky, fond blanc au scroll, nav La Carte / Privatisation / Notre Histoire / Contact
 * Badge panier en rouge (accent2). Logo Playfair Display.
 */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCartStore } from '@/lib/cart-store';
import { useAuth } from '@/hooks/useAuth';
import { SITE } from '@/lib/site-config';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function EcommerceHeader() {
  const router = useRouter();
  const { getItemCount } = useCartStore();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [carteHover, setCarteHover] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasStoredToken, setHasStoredToken] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const itemCount = getItemCount();

  useEffect(() => {
    setMounted(true);
    setHasStoredToken(!!(localStorage.getItem('token') || localStorage.getItem('auth_token')));
  }, []);
  useEffect(() => {
    if (userMenuOpen && typeof window !== 'undefined') {
      setHasStoredToken(!!(localStorage.getItem('token') || localStorage.getItem('auth_token')));
    }
  }, [userMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/ecommerce/categories`).then((res) => {
      if (res.data?.success && res.data.categories) {
        setCategories(res.data.categories);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/carte?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const headerBg = scrolled
    ? 'bg-white shadow-refined border-b border-kafe-border'
    : 'bg-white/80 backdrop-blur-sm border-b border-kafe-border/50';

  return (
    <header
      className={'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' + headerBg}
    >
      <div className="max-w-grid mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo — Playfair Display */}
          <Link href="/" className="font-display text-xl lg:text-2xl font-semibold text-kafe-primary-dark tracking-tight">
            {SITE.name}
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="text-sm font-heading font-medium text-kafe-text hover:text-kafe-primary transition-colors">
              Accueil
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCarteHover(true)}
              onMouseLeave={() => setCarteHover(false)}
            >
              <Link
                href="/carte"
                className="text-sm font-heading font-medium text-kafe-text hover:text-kafe-primary transition-colors flex items-center gap-1"
              >
                La Carte
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {carteHover && (
                <div className="absolute top-full left-0 pt-2 -ml-2">
                  <div className="bg-white border border-kafe-border shadow-refined-hover rounded-refined py-3 min-w-[200px]">
                    <Link href="/carte" className="block px-5 py-2 text-sm text-kafe-text hover:bg-kafe-primary-xlight transition-colors">
                      Toute la carte
                    </Link>
                    {categories.length > 0
                      ? categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/carte?category=${cat.slug}`}
                            className="block px-5 py-2 text-sm text-kafe-text hover:bg-kafe-primary-xlight transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))
                      : SITE.navCarte.map((link) => (
                          <Link key={link.href} href={link.href} className="block px-5 py-2 text-sm text-kafe-text hover:bg-kafe-primary-xlight transition-colors">
                            {link.label}
                          </Link>
                        ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/carte?category=patisseries" className="text-sm font-heading font-medium text-kafe-text hover:text-kafe-primary transition-colors">
              Pâtisseries
            </Link>
            <Link href="/privatisation" className="text-sm font-heading font-medium text-kafe-text hover:text-kafe-primary transition-colors">
              Privatisation
            </Link>
            <Link href="/notre-histoire" className="text-sm font-heading font-medium text-kafe-text hover:text-kafe-primary transition-colors">
              Notre Histoire
            </Link>
            <Link href="/contact" className="text-sm font-heading font-medium text-kafe-text hover:text-kafe-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Droite: Recherche + Compte + Panier */}
          <div className="flex items-center gap-2 sm:gap-4">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher sur la carte..."
                  autoFocus
                  className="w-36 sm:w-48 px-3 py-2 text-sm border border-kafe-border rounded-refined bg-white text-kafe-text placeholder:text-kafe-muted focus:outline-none focus:ring-2 focus:ring-kafe-primary focus:border-kafe-primary"
                />
                <button type="submit" className="ml-1 p-2 text-kafe-primary hover:text-kafe-primary-dark" aria-label="Rechercher">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-kafe-text hover:text-kafe-primary" aria-label="Fermer la recherche">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button type="button" onClick={() => setSearchOpen(true)} className="p-2 text-kafe-text hover:text-kafe-primary transition-colors" aria-label="Rechercher">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full text-kafe-text hover:text-kafe-primary hover:ring-2 hover:ring-kafe-primary/30 transition-all"
                aria-label={isAuthenticated && user ? 'Mon compte' : 'Connexion'}
                aria-expanded={userMenuOpen}
              >
                {isAuthenticated && user ? (
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-kafe-primary-xlight text-kafe-primary font-semibold text-sm">
                    {(user.firstname || user.first_name || user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-kafe-border shadow-refined-hover rounded-refined py-2 z-50">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 border-b border-kafe-divider">
                        <p className="text-sm font-medium text-kafe-text">
                          {(user.firstname || user.first_name) && (user.lastname || user.last_name)
                            ? `${user.firstname || user.first_name} ${user.lastname || user.last_name}`
                            : user.name || user.email}
                        </p>
                        <p className="text-xs text-kafe-muted">{user.email}</p>
                      </div>
                      <Link href={user.role === 'admin' ? '/admin/ecommerce/dashboard' : '/dashboard'} className="block px-4 py-2.5 text-sm font-medium text-kafe-text hover:bg-kafe-primary-xlight transition-colors" onClick={() => setUserMenuOpen(false)}>
                        Mon compte
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin/users/roles" className="block px-4 py-2 text-sm text-kafe-text hover:bg-kafe-primary-xlight transition-colors" onClick={() => setUserMenuOpen(false)}>
                          Gestion des rôles
                        </Link>
                      )}
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-kafe-accent2 hover:bg-kafe-primary-xlight transition-colors">
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href={hasStoredToken ? '/dashboard' : '/login'} className="block px-4 py-2.5 text-sm font-medium text-kafe-text hover:bg-kafe-primary-xlight transition-colors" onClick={() => setUserMenuOpen(false)}>
                        Connexion
                      </Link>
                      <Link href="/register" className="block px-4 py-2 text-sm text-kafe-text hover:bg-kafe-primary-xlight transition-colors" onClick={() => setUserMenuOpen(false)}>
                        S&apos;inscrire
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/cart" className="relative p-2 text-kafe-text hover:text-kafe-primary transition-colors" aria-label="Ma commande (panier)">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-kafe-accent2 text-white text-caption font-medium rounded-capsule px-1">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-kafe-text hover:text-kafe-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
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

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-kafe-primary border-b border-kafe-primary-dark shadow-lg z-40">
          <nav className="max-w-grid mx-auto px-4 py-4 flex flex-col gap-1">
            <Link href="/" className="py-3 text-white font-heading" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
            <Link href="/carte" className="py-3 text-white font-heading" onClick={() => setMobileMenuOpen(false)}>La Carte</Link>
            <Link href="/carte?category=patisseries" className="py-3 text-white font-heading" onClick={() => setMobileMenuOpen(false)}>Pâtisseries</Link>
            <Link href="/privatisation" className="py-3 text-white font-heading" onClick={() => setMobileMenuOpen(false)}>Privatisation</Link>
            <Link href="/notre-histoire" className="py-3 text-white font-heading" onClick={() => setMobileMenuOpen(false)}>Notre Histoire</Link>
            <Link href="/contact" className="py-3 text-white font-heading" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link href={isAuthenticated ? '/dashboard' : '/login'} className="py-3 text-white font-heading" onClick={() => setMobileMenuOpen(false)}>
              {isAuthenticated ? 'Mon compte' : 'Connexion'}
            </Link>
            <Link href="/cart" className="py-3 text-white font-heading flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              Ma commande {mounted && itemCount > 0 && `(${itemCount})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

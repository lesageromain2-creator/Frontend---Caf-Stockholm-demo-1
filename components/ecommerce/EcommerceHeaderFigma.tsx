/**
 * Header Kafé Stockholm — Figma Group Header (Page acceuil new)
 * Frame 1920×119px, logo 130.69×119 at (9,0), nav DM Sans 500 19.68px white 88%, gap 27.55px, Click & Collect #F5C842 159×42 radius 4.47px
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

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'La carte', href: '/menu' },
  { label: 'Notre histoire', href: '/notre-histoire' },
  { label: 'Privatisation', href: '/privatisation' },
  { label: 'Contact', href: '/contact' },
];

export default function EcommerceHeaderFigma() {
  const router = useRouter();
  const { getItemCount } = useCartStore();
  const { user, isAuthenticated, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [carteHover, setCarteHover] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const itemCount = getItemCount();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    axios.get(`${API_URL}/ecommerce/categories`).then((res) => {
      if (res.data?.success && res.data.categories) setCategories(res.data.categories);
    }).catch(() => {});
  }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{ backgroundColor: '#233C9D' }} data-figma="Group Header">
      {/* Figma: 1920×119, padding 6px 159px — on desktop match Figma; on small screens reduce padding */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-[159px] py-1.5">
        <div className="flex items-center justify-between h-[100px] lg:h-[115px]">
          {/* Logo — Figma logo 3: 130.69×119 at (9,0) */}
          <Link href="/" className="flex-shrink-0 h-16 sm:h-20 lg:h-[119px] w-auto" style={{ maxWidth: 130.69 }}>
            <img
              src="/images/logo.png"
              alt={SITE.name}
              className="h-full w-auto max-w-[130px] object-contain object-left"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const fallback = document.createElement('span');
                fallback.className = 'font-display text-xl font-bold text-white';
                fallback.textContent = SITE.name;
                (e.target as HTMLImageElement).parentElement?.appendChild(fallback);
              }}
            />
          </Link>

          {/* Nav — Figma titre header: x:459 y:7, 1081.75×98.41, row gap 27.55px, DM Sans 500 19.68px, letterSpacing 5%, UPPER, white 88% */}
          <nav className="hidden lg:flex items-center flex-1 justify-center" style={{ gap: 27.55 }}>
            <Link
              href="/"
              className="font-medium text-white uppercase transition-all duration-300 ease-out hover:opacity-100 hover:scale-105 hover:-translate-y-0.5"
              style={{ fontFamily: 'DM Sans', fontSize: 19.68, letterSpacing: '0.05em', opacity: 0.88 }}
            >
              Accueil
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCarteHover(true)}
              onMouseLeave={() => setCarteHover(false)}
            >
              <Link
                href="/menu"
                className="font-medium text-white uppercase transition-all duration-300 ease-out hover:opacity-100 hover:scale-105 hover:-translate-y-0.5"
                style={{ fontFamily: 'DM Sans', fontSize: 19.68, letterSpacing: '0.05em', opacity: 0.88 }}
              >
                La carte
              </Link>
              {carteHover && (
                <div className="absolute top-full left-0 pt-2 -ml-2 z-50">
                  <div className="bg-white border border-kafe-border shadow-refined-hover rounded-lg py-2 min-w-[200px]">
                    <Link href="/menu" className="block px-4 py-2.5 text-sm text-kafe-text hover:bg-kafe-primary-xlight transition-colors">
                      Toute la carte
                    </Link>
                    {categories.length > 0
                      ? categories.map((cat) => (
                          <Link key={cat.id} href={`/menu#${cat.slug}`} className="block px-4 py-2.5 text-sm text-kafe-text hover:bg-kafe-primary-xlight transition-colors">
                            {cat.name}
                          </Link>
                        ))
                      : SITE.navCarte.map((link) => (
                          <Link key={link.href} href={link.href} className="block px-4 py-2.5 text-sm text-kafe-text hover:bg-kafe-primary-xlight transition-colors">
                            {link.label}
                          </Link>
                        ))}
                  </div>
                </div>
              )}
            </div>
            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-white uppercase transition-all duration-300 ease-out hover:opacity-100 hover:scale-105 hover:-translate-y-0.5"
                style={{ fontFamily: 'DM Sans', fontSize: 19.68, letterSpacing: '0.05em', opacity: 0.88 }}
              >
                {link.label}
              </Link>
            ))}
            {/* Figma: Click & Collect — 159.11×42.49, #F5C842, radius 4.47px, DM Sans 700 15.66px, #0D2A5C */}
            <Link
              href="/carte"
              className="hidden lg:inline-flex items-center justify-center flex-shrink-0 font-bold text-[#0D2A5C] uppercase rounded-[4.47px] transition-all duration-300 ease-out hover:scale-[1.04] hover:shadow-lg hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98]"
              style={{ width: 159.11, height: 42.49, backgroundColor: '#F5C842', fontFamily: 'DM Sans', fontSize: 15.66, letterSpacing: '0.05em', boxShadow: '0 4px 14px rgba(245,200,66,0.35)' }}
            >
              Click & Collect
            </Link>
          </nav>

          {/* Right: Connexion et panier — Figma x:1704, 145.75 width */}
          <div className="flex items-center gap-3 lg:gap-4">

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-white/88 hover:text-white hover:bg-white/10 transition-all"
                aria-label={isAuthenticated && user ? 'Mon compte' : 'Connexion'}
              >
                {isAuthenticated && user ? (
                  <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 text-white font-semibold text-sm">
                    {(user.first_name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-kafe-border shadow-refined-hover rounded-lg py-2 z-50">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 border-b border-kafe-divider">
                        <p className="text-sm font-medium text-kafe-text">{(user.first_name && user.last_name) ? `${user.first_name} ${user.last_name}` : user.email}</p>
                        <p className="text-xs text-kafe-muted">{user.email}</p>
                      </div>
                      <Link href={user.role === 'admin' ? '/admin/ecommerce/dashboard' : '/dashboard'} className="block px-4 py-2.5 text-sm text-kafe-text hover:bg-kafe-primary-xlight" onClick={() => setUserMenuOpen(false)}>Mon compte</Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-kafe-accent2 hover:bg-kafe-primary-xlight">
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2.5 text-sm font-medium text-kafe-text hover:bg-kafe-primary-xlight" onClick={() => setUserMenuOpen(false)}>Connexion</Link>
                      <Link href="/register" className="block px-4 py-2 text-sm text-kafe-text hover:bg-kafe-primary-xlight" onClick={() => setUserMenuOpen(false)}>S&apos;inscrire</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center justify-center w-9 h-9 rounded-lg text-white/88 hover:text-white hover:bg-white/10 transition-all" aria-label="Ma commande">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-kafe-accent text-kafe-primary-dark text-xs font-medium rounded-full">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-white/88 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 border-t border-white/10 shadow-lg z-40" style={{ backgroundColor: '#233C9D' }}>
          <nav className="max-w-[1986px] mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="py-3 font-heading font-medium text-white uppercase tracking-[0.05em] transition-all duration-300 ease-out hover:opacity-100 hover:scale-105" style={{ fontFamily: 'DM Sans' }} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/carte" className="py-3 font-heading font-bold text-kafe-accent transition-all duration-300 ease-out hover:scale-105 hover:opacity-100" onClick={() => setMobileMenuOpen(false)}>Click & Collect</Link>
            <Link href={isAuthenticated ? '/dashboard' : '/login'} className="py-3 font-heading font-medium text-white" style={{ fontFamily: 'DM Sans' }} onClick={() => setMobileMenuOpen(false)}>
              {isAuthenticated ? 'Mon compte' : 'Connexion'}
            </Link>
            <Link href="/cart" className="py-3 font-heading font-medium flex items-center gap-2 text-white" style={{ fontFamily: 'DM Sans' }} onClick={() => setMobileMenuOpen(false)}>
              Ma commande {mounted && itemCount > 0 && `(${itemCount})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

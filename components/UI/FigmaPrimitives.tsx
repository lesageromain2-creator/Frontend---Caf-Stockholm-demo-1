/**
 * Composants de base alignés maquette Figma Stockholm Kafé V3
 * Boutons (primaire rectangulaire bleu), inputs, typographie, couleurs
 */

import React from 'react';
import Link from 'next/link';

/* ----- Typographie (Figma) ----- */
export function FigmaH1({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`font-display text-h1 text-kafe-primary-dark tracking-tight ${className}`}>{children}</h1>;
}
export function FigmaH2({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`font-display text-h2 text-kafe-primary-dark tracking-tight ${className}`}>{children}</h2>;
}
export function FigmaH3({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-heading text-h3 font-semibold text-kafe-primary-dark ${className}`}>{children}</h3>;
}
export function FigmaBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-body text-kafe-text-secondary text-small md:text-body leading-relaxed ${className}`}>{children}</p>;
}
export function FigmaTagline({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-body text-kafe-text-secondary text-small ${className}`}>{children}</p>;
}

/* ----- Boutons style Figma (rectangulaires, bleu foncé) ----- */
const btnBase = 'inline-flex items-center justify-center font-heading font-semibold transition-all duration-200 rounded-lg';

export function FigmaButtonPrimary({
  children,
  href,
  className = '',
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  const c = `${btnBase} min-w-[180px] py-3.5 px-6 bg-kafe-primary-dark text-white hover:bg-kafe-primary border-2 border-kafe-primary-dark hover:border-kafe-primary shadow-md hover:shadow-lg ${className}`;
  if (href) return <Link href={href} className={c}>{children}</Link>;
  return <button type={type} onClick={onClick} className={c}>{children}</button>;
}

export function FigmaButtonSecondary({
  children,
  href,
  className = '',
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const c = `${btnBase} min-w-[180px] py-3 px-6 bg-transparent text-kafe-primary-dark border-2 border-kafe-primary-dark text-white hover:bg-white hover:text-kafe-primary-dark ${className}`;
  if (href) return <Link href={href} className={c}>{children}</Link>;
  return <button type="button" className={c}>{children}</button>;
}

export function FigmaButtonAccent({
  children,
  href,
  className = '',
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const c = `${btnBase} min-w-[180px] py-3.5 px-6 bg-kafe-accent text-kafe-primary-dark hover:bg-kafe-accent-dark font-bold ${className}`;
  if (href) return <Link href={href} className={c}>{children}</Link>;
  return <button type="button" className={c}>{children}</button>;
}

/* ----- Input style Figma ----- */
export function FigmaInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  id,
  label,
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  label?: string;
}) {
  const inputClass = `w-full px-4 py-3 font-body text-kafe-text border-2 border-kafe-border rounded-lg bg-white placeholder:text-kafe-muted focus:outline-none focus:ring-2 focus:ring-kafe-primary focus:border-kafe-primary ${className}`;
  return (
    <div>
      {label && <label htmlFor={id} className="block font-heading font-medium text-kafe-text text-small mb-1.5">{label}</label>}
      <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} className={inputClass} />
    </div>
  );
}

/* ----- Textarea style Figma ----- */
export function FigmaTextarea({
  placeholder,
  value,
  onChange,
  className = '',
  id,
  label,
  rows = 4,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  id?: string;
  label?: string;
  rows?: number;
}) {
  const textareaClass = `w-full px-4 py-3 font-body text-kafe-text border-2 border-kafe-border rounded-lg bg-white placeholder:text-kafe-muted focus:outline-none focus:ring-2 focus:ring-kafe-primary focus:border-kafe-primary resize-y ${className}`;
  return (
    <div>
      {label && <label htmlFor={id} className="block font-heading font-medium text-kafe-text text-small mb-1.5">{label}</label>}
      <textarea id={id} rows={rows} placeholder={placeholder} value={value} onChange={onChange} className={textareaClass} />
    </div>
  );
}

/* ----- Select style Figma ----- */
export function FigmaSelect({
  value,
  onChange,
  className = '',
  id,
  label,
  children,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  id?: string;
  label?: string;
  children: React.ReactNode;
}) {
  const selectClass = `w-full px-4 py-3 font-body text-kafe-text border-2 border-kafe-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-kafe-primary focus:border-kafe-primary ${className}`;
  return (
    <div>
      {label && <label htmlFor={id} className="block font-heading font-medium text-kafe-text text-small mb-1.5">{label}</label>}
      <select id={id} value={value} onChange={onChange} className={selectClass}>
        {children}
      </select>
    </div>
  );
}

/* ----- Badge style Figma ----- */
export function FigmaBadge({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'accent2' | 'success' | 'warning';
  className?: string;
}) {
  const variants = {
    default: 'bg-kafe-primary-xlight text-kafe-primary-dark',
    accent: 'bg-kafe-accent text-kafe-primary-dark',
    accent2: 'bg-kafe-accent2 text-white',
    success: 'bg-kafe-success text-white',
    warning: 'bg-kafe-warning text-white',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-small font-heading font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

/* ----- Link style Figma ----- */
export function FigmaLink({
  children,
  href,
  className = '',
  external = false,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
}) {
  const linkClass = `font-heading font-medium text-kafe-primary hover:text-kafe-primary-dark hover:underline transition-colors ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

/* ----- Carte section (3 colonnes type Figma) ----- */
export function FigmaCard({
  icon,
  title,
  text,
  className = '',
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={`text-center p-6 rounded-2xl bg-white border border-kafe-border shadow-refined hover:shadow-refined-hover transition-all ${className}`}>
      <div className="flex justify-center text-4xl mb-4">{icon}</div>
      <h3 className="font-heading font-semibold text-kafe-primary-dark text-h3">{title}</h3>
      <p className="mt-2 text-kafe-text-secondary text-small font-body leading-relaxed">{text}</p>
    </div>
  );
}

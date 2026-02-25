/**
 * Design Tokens — Stockholm Kafé V3 (Figma node 2048:2, 2048:58)
 * Extracted from get_figma_data — do not improvise.
 */

// ============ COLORS (exact hex/rgba from Figma) ============
export const colors = {
  white: '#FFFFFF',
  primaryDark: '#0D2A5C',
  primaryHeader: '#233C9D',
  primaryLink: '#1A4A8A',
  accent: '#F5C842',
  bgPage: '#FAF9F6',
  bgCream: '#F5EDE0',
  bgBeige: '#F2EDE4',
  bgSurface: '#EDE8DF',
  textDark: '#1A1A1A',
  textGray: '#4A4A4A',
  textMuted: '#888880',
  success: '#2E7D32',
  successBg: '#E8F5E9',
  overlayPrince: 'rgba(26, 74, 138, 0.8)',
  white88: 'rgba(255, 255, 255, 0.88)',
  white60: 'rgba(255, 255, 255, 0.6)',
  white50: 'rgba(255, 255, 255, 0.5)',
  white30: 'rgba(255, 255, 255, 0.3)',
  borderFooter: 'rgba(255, 255, 255, 0.08)',
} as const;

// ============ TYPOGRAPHY (exact from Figma) ============
export const fonts = {
  display: 'Playfair Display', // Headings
  body: 'DM Sans',
  button: 'Inter',
} as const;

// Font sizes (px from Figma — use in style or Tailwind arbitrary)
export const fontSizes = {
  footerTitle: 16.5,
  footerSub: 9.75,
  footerLink: 9.75,
  footerCopyright: 9,
  heroTitle: 220.57,
  heroSub: 35.88,
  heroH1: 113.13,
  heroH1Sub: 51.47,
  heroBtn: 35.39,
  sectionH2: 49.8,
  sectionH2Alt: 41.12,
  sectionH2Small: 44.79,
  sectionH3: 42.21,
  sectionH3Alt: 39.19,
  body: 19.45,
  bodySmall: 16.33,
  bodyTiny: 12.85,
  label: 11.78,
  labelVegan: 10.71,
  button: 12.21,
  nav: 22.31,
  navBtn: 22.31,
  cardTitle: 17.13,
  cardPrice: 17.13,
  cardDesc: 12.85,
  princeQuote: 39.16,
  princeBadge: 16.61,
  princeH2: 64.64,
  horaireH2: 44.79,
  horaireLabel: 18.66,
  horaireBody: 16.33,
  horaireLink: 18.66,
  fikaH2: 37.32,
  fikaH3: 42.21,
  fikaBody: 24.12,
  fikaDivider: 13.61,
} as const;

export const lineHeights = {
  tight: 1.21,
  snug: 1.25,
  normal: 1.35,
  relaxed: 1.5,
  body: 1.6,
  loose: 1.7,
  box: 0.84,
  card: 0.96,
} as const;

export const letterSpacing = {
  nav: '5%',
  hero: '-2%',
  heroSub: '2.75%',
  btn: '2%',
  label: '10%',
  card: '1.99%',
} as const;

// ============ SPACING / LAYOUT (from Figma) ============
export const layout = {
  pageWidth: 1440,
  pageHeight: 6092,
  headerHeight: 135.98,
  headerGap: 31.4,
  containerPadding: 85,
  footerHeight: 196.33,
  cardBorderRadius: 8.57,
  cardShadow: '0px 2.14px 12.85px 0px rgba(0, 0, 0, 0.06)',
  buttonBorderRadius: 4.28,
  princeBadgeRadius: 30.66,
  mapRadius: 9.33,
  dividerHeight: 1.17,
  dividerWidth: 51.4,
} as const;

// ============ BORDERS / STROKES ============
export const strokes = {
  footer: '0.75px solid rgba(255, 255, 255, 0.08)',
  btnHero: '4.72px solid #F5C842',
  btnCta: '3.36px solid #F5C842',
  mapBtn: '2.33px solid #0D2A5C',
  cardBtn: '2.14px solid #F5C842',
} as const;

export const designTokens = {
  colors,
  fonts,
  fontSizes,
  lineHeights,
  letterSpacing,
  layout,
  strokes,
} as const;

export default designTokens;

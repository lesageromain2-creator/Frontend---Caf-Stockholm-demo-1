# 🚀 Frontend - Le Sage Dev

## 📋 Vue d'ensemble

Frontend moderne Next.js avec TypeScript, Tailwind CSS, Stripe et Supabase, structuré selon les principes du design atomique.

**Version:** 2.0.0  
**Date:** Janvier 2026  
**Statut:** ✅ Architecture TypeScript complète mise en place

---

## 🎯 Technologies

- **Framework:** Next.js 16.1.4 (Pages Router)
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 3.4
- **Paiements:** Stripe (React Stripe.js 2.9)
- **Backend:** Supabase 2.50
- **Forms:** React Hook Form 7.54
- **Validation:** Zod 3.24
- **Notifications:** React Toastify 10.0
- **Icons:** Lucide React 0.263

MES STACKS DEV

Nextjs
Tailwind
Vercel frontend
Supabase
Stripe
resend
better auth
drizzle orm
shadcn ui
google analytics
sdk ia 

---

## 📁 Structure du Projet

```
frontend/
├── components/
│   ├── atoms/              ✅ Composants de base (Button, Input, Badge, Card, Spinner)
│   ├── molecules/          ✅ Composants composites (Modal, Forms, StripePaymentForm)
│   ├── organisms/          ✅ Sections complexes (Header, Footer, Hero)
│   ├── features/           ✅ Composants métier (BlogCard, OfferCard, ProjectCard)
│   ├── layouts/            ✅ Layouts (MainLayout, DashboardLayout)
│   └── providers/          ✅ Context providers (AuthProvider, StripeProvider)
│
├── hooks/                  ✅ Hooks personnalisés
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── usePayment.ts
│   ├── useReservations.ts
│   ├── useFileUpload.js (existant)
│   └── useProjectFiles.js (existant)
│
├── lib/                    ✅ Configuration des librairies
│   ├── axios.ts            ✅ Configuration Axios avec intercepteurs
│   ├── stripe.ts           ✅ Configuration Stripe
│   └── supabase.ts         ✅ Configuration Supabase Client
│
├── pages/                  ✅ Pages Next.js (mix .js et .tsx)
│   ├── _app.tsx            ✅ App wrapper avec AuthProvider
│   ├── index.tsx           ✅ Page d'accueil moderne
│   ├── login.tsx           ✅ Page de connexion
│   ├── register.tsx        ✅ Page d'inscription
│   ├── dashboard.tsx       ✅ Dashboard utilisateur
│   ├── contact.tsx         ✅ Page de contact
│   ├── offres.tsx          ✅ Liste des offres
│   ├── blog/
│   │   ├── index.tsx       ✅ Liste des articles
│   │   └── [slug].tsx      ✅ Détail d'un article
│   ├── portfolio/
│   │   └── index.tsx       ✅ Liste des projets portfolio
│   ├── payment/
│   │   ├── checkout.tsx    ✅ Page de paiement Stripe
│   │   └── success.tsx     ✅ Confirmation de paiement
│   └── ...                 🔄 Autres pages existantes à migrer
│
├── styles/
│   └── globals.css         ✅ Styles Tailwind
│
├── types/                  ✅ Types TypeScript (100% complet)
│   ├── index.ts            ✅ Export centralisé
│   ├── common.ts           ✅ Types communs (UUID, Timestamps, Pagination, etc.)
│   ├── auth.ts             ✅ Types authentification
│   ├── user.ts             ✅ Types utilisateur
│   ├── project.ts          ✅ Types projets clients
│   ├── reservation.ts      ✅ Types réservations
│   ├── blog.ts             ✅ Types blog
│   ├── portfolio.ts        ✅ Types portfolio
│   ├── payment.ts          ✅ Types Stripe/paiements
│   ├── offer.ts            ✅ Types offres de services
│   ├── testimonial.ts      ✅ Types témoignages
│   ├── contact.ts          ✅ Types messages de contact
│   ├── newsletter.ts       ✅ Types newsletter
│   └── admin.ts            ✅ Types administration
│
├── utils/                  ✅ Utilitaires
│   ├── api.js              🔄 API existante (à migrer)
│   ├── cn.ts               ✅ Classnames utility
│   └── format.ts           ✅ Formatage (currency, date, filesize, etc.)
│
├── docs/                   ✅ Documentation
│   ├── FRONTEND_GUIDE.md   ✅ Guide complet d'utilisation
│   └── MIGRATION_GUIDE.md  ✅ Guide de migration JS → TS
│
├── .env.local.example      ✅ Variables d'environnement
├── tsconfig.json           ✅ Configuration TypeScript
├── next.config.js          ✅ Configuration Next.js
├── tailwind.config.js      ✅ Configuration Tailwind
├── package.json            ✅ Dépendances
└── README.md               ✅ Ce fichier

Légende:
✅ Créé et fonctionnel
🔄 Existant, à migrer vers TypeScript
```

---

## 🚀 Installation

### 1. Installer les dépendances

```bash
cd frontend
npm install
```

### 2. Configuration des variables d'environnement

Créer `.env.local` à partir de `.env.local.example` :

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Environment
NODE_ENV=development
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Le frontend sera accessible sur http://localhost:3000

---

## 📚 Documentation

### Guides disponibles

1. **[FRONTEND_GUIDE.md](./docs/FRONTEND_GUIDE.md)**
   - Guide complet d'utilisation des composants
   - Exemples de code
   - Hooks personnalisés
   - Intégration Stripe et Supabase

2. **[MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md)**
   - Plan de migration JS → TypeScript
   - Templates de migration
   - Checklist
   - Problèmes courants

---

## 🎨 Système de Design

### Couleurs

```javascript
colors: {
  primary: '#0066FF',    // Bleu principal
  secondary: '#00D9FF',  // Cyan
  dark: '#0A0E27',       // Noir profond
  light: '#F8F9FA',      // Gris clair
  accent: '#FF6B35',     // Orange accent
}
```

### Composants Disponibles

#### Atoms (Atomiques)
- `Button` - Bouton avec variants et tailles
- `Input` - Champ de saisie avec icônes et validation
- `Badge` - Badge de statut
- `Card` - Carte conteneur
- `Spinner` - Indicateur de chargement

#### Molecules (Composites)
- `Modal` - Modale réutilisable
- `FormField` - Champ de formulaire avec react-hook-form
- `Textarea` - Zone de texte
- `Select` - Select dropdown
- `LoginForm` - Formulaire de connexion complet
- `RegisterForm` - Formulaire d'inscription complet
- `StripePaymentForm` - Formulaire de paiement Stripe

#### Organisms (Sections)
- `Header` - En-tête avec navigation
- `Footer` - Pied de page
- `Hero` - Section hero avec variants

#### Features (Métier)
- `BlogCard` - Carte article de blog
- `OfferCard` - Carte offre de service
- `ProjectCard` - Carte projet

#### Layouts
- `MainLayout` - Layout principal avec Header/Footer
- `DashboardLayout` - Layout dashboard avec sidebar

---

## 🔐 Authentification

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Utilisation...
}
```

L'authentification est gérée globalement via le `AuthProvider` dans `_app.tsx`.

---

## 💳 Paiements Stripe

### Créer un paiement

```tsx
import { StripeProvider } from '@/components/providers';
import { StripePaymentForm } from '@/components/molecules';

function PaymentPage() {
  return (
    <StripeProvider clientSecret={clientSecret}>
      <StripePaymentForm
        amount={5000}
        currency="EUR"
        onSuccess={() => console.log('Paiement réussi')}
      />
    </StripeProvider>
  );
}
```

---

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Start production
npm run start

# Linter
npm run lint

# Type checking
npm run type-check
```

---

## 🔄 Migration en Cours

### ✅ Terminé

- Configuration TypeScript complète
- Types pour toutes les entités (27 tables backend)
- Composants Atomic Design de base
- Hooks principaux (Auth, Projects, Payment, Reservations)
- Pages essentielles (Home, Login, Register, Dashboard, Blog, Portfolio, Offres, Contact, Payment)
- Layouts (Main, Dashboard)
- Configuration Stripe et Supabase

### 🔄 À faire

- Migration des pages existantes .js vers .tsx
- Migration des composants admin
- Pages de détail manquantes (Portfolio détail, etc.)
- Tests unitaires (Jest + React Testing Library)
- Tests E2E (Playwright)
- Storybook pour documentation des composants

Voir [MIGRATION_GUIDE.md](./docs/MIGRATION_GUIDE.md) pour le plan détaillé.

---

## 🐛 Débogage

### Erreurs TypeScript

```bash
# Vérifier les erreurs
npm run type-check
```

### Problèmes courants

1. **Module not found** : Vérifier les alias dans `tsconfig.json`
2. **Type errors** : Toujours typer explicitement les props et states
3. **Hydration errors** : Vérifier la cohérence client/serveur

---

## 📦 Dépendances Principales

```json
{
  "@stripe/react-stripe-js": "^2.9.0",
  "@stripe/stripe-js": "^4.11.0",
  "@supabase/supabase-js": "^2.50.1",
  "clsx": "^2.1.1",
  "next": "^16.1.4",
  "react": "^18.3.1",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.1",
  "lucide-react": "^0.263.1",
  "react-toastify": "^10.0.6"
}
```

---

## 🤝 Contribution

### Convention de nommage

- Composants : PascalCase (`Button.tsx`)
- Hooks : camelCase avec préfixe `use` (`useAuth.ts`)
- Utilitaires : camelCase (`format.ts`)
- Types : interfaces PascalCase (`User`, `BlogPost`)

### Structure d'un composant

```tsx
// ============================================
// COMPOSANT: NOM DU COMPOSANT
// ============================================

import React from 'react';
import { cn } from '@/utils/cn';

export interface ComponentProps {
  // Props typées
}

const Component: React.FC<ComponentProps> = ({ props }) => {
  // Logique du composant

  return (
    // JSX
  );
};

Component.displayName = 'Component';

export default Component;
```

---

## 📞 Support

- **Documentation:** Voir `/docs/FRONTEND_GUIDE.md`
- **Migration:** Voir `/docs/MIGRATION_GUIDE.md`
- **Issues:** Créer une issue sur le repo

---

**Développé avec ❤️ par l'équipe Le Sage Dev**

**Version:** 2.0.0  
**Date:** Janvier 2026

# Quick Start Guide: Hashtag Tech Website Redesign

**Feature**: 001-website-redesign
**Branch**: `001-website-redesign`
**Last Updated**: 2026-02-02

---

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] Git installed ([Download](https://git-scm.com/))
- [ ] VS Code or similar code editor with TypeScript support
- [ ] Read the [spec document](./spec.md)
- [ ] Reviewed the [implementation plan](./plan.md)
- [ ] Reviewed all 12 screenshots in `/screenshots/` directory

---

## Phase 1 Setup: Hardcoded Data

### Step 1: Initialize Next.js Project

```bash
# Create new Next.js project with TypeScript and Tailwind
npx create-next-app@latest hashtag-tech --typescript --tailwind --app --no-src-dir

# Navigate into project
cd hashtag-tech
```

**Options Explained**:
- `--typescript`: Enable TypeScript (strict mode required)
- `--tailwind`: Enable Tailwind CSS
- `--app`: Use App Router (Next.js 13+)
- `--no-src-dir`: Use root directory (not /src)

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install gsap framer-motion zod clsx tailwind-merge

# Email service (Brevo SDK)
npm install @brevo/brevo-sdk

# Type definitions (GSAP types are included in gsap package)
# No @types/gsap needed - types are bundled with gsap

# Sanity CMS (Phase 2 - skip for now)
# npm install sanity next-sanity
```

### Step 3: Configure TypeScript Strict Mode

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Step 4: Set Up CSS Variables (Design Tokens)

**File**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Brand Colors - Extracted from logo */
  --brand-primary: 242 107 107;      /* #F26B6B Coral Red */
  --brand-primary-dark: 185 69 72;   /* #B94548 */
  --brand-primary-hover: 163 61 64;  /* #A33D40 */
  --brand-primary-light: 253 234 234; /* #FDEAEA */
  --brand-gradient: linear-gradient(135deg, rgb(242 107 107) 0%, rgb(185 69 72) 100%);

  /* Surface Colors */
  --surface-background: 255 255 255;
  --surface-foreground: 90 90 90;     /* #5A5A5A */
  --surface-muted: 245 245 245;
  --surface-dark: 26 26 26;
  --surface-dark-foreground: 255 255 255;

  /* Animation Tokens */
  --duration-hover: 150ms;
  --duration-transition: 350ms;
  --duration-scroll: 650ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* Focus Ring */
  --ring-offset: 2px;
  --ring-width: 2px;
  --ring-color: rgb(242 107 107);
}

/* Dark mode support (future) */
@media (prefers-color-scheme: dark) {
  :root {
    --surface-background: 26 26 26;
    --surface-foreground: 255 255 255;
  }
}
```

### Step 5: Configure Tailwind

**File**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--brand-primary) / <alpha-value>)',
          dark: 'rgb(var(--brand-primary-dark) / <alpha-value>)',
          hover: 'rgb(var(--brand-primary-hover) / <alpha-value>)',
          light: 'rgb(var(--brand-primary-light) / <alpha-value>)',
        },
        surface: {
          background: 'rgb(var(--surface-background) / <alpha-value>)',
          foreground: 'rgb(var(--surface-foreground) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)',
          dark: 'rgb(var(--surface-dark) / <alpha-value>)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 6: Set Up Fonts

**File**: `app/layout.tsx`

```typescript
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const metadata = {
  title: 'Hashtag Tech - AI-Powered Software Development Agency',
  description: 'Building world-class web and mobile applications with cutting-edge AI technology.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

### Step 7: Create Directory Structure

```bash
# Create component directories
mkdir -p components/{layout,sections,ui,forms,widgets,animations}
mkdir -p hooks
mkdir -p lib
mkdir -p types
mkdir -p public/images/{placeholders,testimonials,partners}
mkdir -p screenshots
```

### Step 8: Set Up Environment Variables

**File**: `.env.local`

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Brevo Email (Phase 1 - prepared for integration)
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@hashtagstech.com
BREVO_RECIPIENT_EMAIL=contact@devmatesolutions.com
```

**File**: `.env.example`

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Brevo Email
BREVO_API_KEY=
BREVO_SENDER_EMAIL=noreply@hashtagstech.com
BREVO_RECIPIENT_EMAIL=contact@devmatesolutions.com
```

### Step 9: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the default Next.js page.

---

## Library Import Reference

**Important**: Use the correct import patterns below. These are sourced from official documentation via Context7 MCP.

### Next.js 16 (App Router)

```typescript
// Images - Correct import for Next.js 16
import Image from 'next/image';

// Fonts - Google Fonts (non-variable)
import { Roboto } from 'next/font/google';
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

// Fonts - Google Fonts (variable)
import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Dynamic imports (code splitting)
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false, // optional: disable SSR
  loading: () => <p>Loading...</p>,
});

// Link component for navigation
import Link from 'next/link';
```

### GSAP (Scroll Animations)

```typescript
// Core GSAP
import { gsap } from 'gsap';

// ScrollTrigger plugin (for scroll-based animations)
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollToPlugin (if needed for smooth scrolling)
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register plugins (required before use)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);
}

// Basic usage
gsap.to('.box', { x: 100, duration: 1 });

// ScrollTrigger usage
gsap.to('.box', {
  scrollTrigger: '.box',
  x: 100,
  duration: 1,
});
```

**Note**: GSAP types are bundled with the package - no `@types/gsap` needed!

### Motion.dev (Framer Motion)

```typescript
// Motion components and hooks (use 'framer-motion' package)
import {
  motion,
  useAnimation,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion';

// Basic motion component
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
/>

// Use animation control
const controls = useAnimation();
<motion.div animate={controls} />

// Use motion value for reactive values
const x = useMotionValue(0);
<motion.div style={{ x }} />

// AnimatePresence for exit animations
<AnimatePresence>
  {isVisible && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>
```

**Note**: Motion.dev docs use `motion/react` but for React projects, use `framer-motion` package.

### Zod (Runtime Validation)

```typescript
import { z } from 'zod';

// Define schema
const ContactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

// Infer TypeScript type from schema
type ContactForm = z.infer<typeof ContactFormSchema>;

// Validate data
const result = ContactFormSchema.safeParse(data);
if (result.success) {
  // Data is valid
} else {
  // Handle errors
  console.log(result.error);
}
```

### Tailwind CSS + clsx + tailwind-merge

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for conditional classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  'base-class',
  isActive && 'active-class',
  'another-class'
)} />
```

---

## First Implementation Steps

### 1. Create Base Types

**File**: `types/index.ts`

```typescript
// Re-export all types
export * from './service';
export * from './testimonial';
export * from './ai-service';
export * from './contact-form';
```

### 2. Create Utility Functions

**File**: `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

**Install dependencies**:
```bash
npm install clsx tailwind-merge
```

### 3. Create Animation Tokens

**File**: `lib/animations.ts`

```typescript
// Import GSAP for scroll animations
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin (required for scroll-based animations)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation duration tokens (ms)
export const DURATION = {
  hover: 150,
  transition: 350,
  scroll: 650,
} as const;

// Easing functions
export const EASING = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;
```

**Note**: For Framer Motion (Motion.dev) components, use:
```typescript
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
```

### 4. Create Reduced Motion Hook

**File**: `hooks/use-reduced-motion.ts`

```typescript
'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
```

### 5. Build Header Component

**File**: `components/layout/header.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo component here */}
          <span className="text-xl font-bold text-brand-primary">Hashtag Tech</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          <li><Link href="/" className="hover:text-brand-primary transition-colors">HOME</Link></li>
          <li><Link href="/#services" className="hover:text-brand-primary transition-colors">SERVICES</Link></li>
          <li><Link href="/#team" className="hover:text-brand-primary transition-colors">TEAM</Link></li>
          <li><Link href="/career" className="hover:text-brand-primary transition-colors">CAREER</Link></li>
        </ul>

        <a
          href="#contact"
          className="bg-brand-primary text-white px-6 py-2 rounded-full hover:bg-brand-hover transition-colors"
        >
          BOOK MEETING
        </a>

        {/* Mobile menu button here */}
      </nav>
    </header>
  );
}
```

### 6. Build Hero Section

**File**: `components/sections/hero.tsx`

```typescript
'use client';

import Link from 'next/link';

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3">
          <p className="text-muted-foreground mb-4">
            AI-Powered Software Development Agency
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            We Build <span className="text-brand-primary">Applications</span>
            <br />
            That Scale
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            From concept to deployment, we deliver world-class web and mobile applications
            powered by cutting-edge AI technology.
          </p>
          <Link
            href="#contact"
            className="inline-block bg-brand-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-brand-hover transition-colors"
          >
            Get Started
          </Link>
        </div>

        <div className="md:col-span-2">
          {/* Hero illustration here */}
          <div className="aspect-square bg-muted rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
```

### 7. Assemble Homepage

**File**: `app/page.tsx`

```typescript
import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Add more sections here */}
      </main>
    </>
  );
}
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run type-check  # or npx tsc --noEmit

# Linting
npm run lint

# Format code (if using Prettier)
npm run format

# Build for production
npm run build

# Start production server
npm start

# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

---

## Package.json Scripts

**File**: `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
```

---

## Pre-commit Setup (Optional)

```bash
# Install Husky for git hooks
npm install -D husky lint-staged

# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run type-check && npm run lint"
```

---

## Verification Checklist

Before proceeding, verify:

- [ ] Development server starts without errors
- [ ] TypeScript strict mode enabled
- [ ] CSS variables defined in globals.css
- [ ] Tailwind configured with CSS variables
- [ ] Header component displays correctly
- [ ] Hero section displays correctly
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)

---

## Next Steps

1. Build all 13 homepage sections (refer to screenshots)
2. Add GSAP scroll animations
3. Add Motion.dev micro-interactions
4. Build Chat Widget component
5. Build Contact Form with Zod validation
6. Test responsiveness (320px - 1920px)
7. Run Lighthouse audit

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill
```

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Not Working

1. Check `tailwind.config.ts` content paths
2. Verify `globals.css` has `@tailwind` directives
3. Restart dev server

---

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **GSAP**: https://greensock.com/docs
- **Motion.dev**: https://motion.dev/docs
- **TypeScript**: https://www.typescriptlang.org/docs

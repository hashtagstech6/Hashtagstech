# Hashtag Tech Project Constitution & SpecKit Plus Guide

> **Spec-Driven Development (SDD) for Production-Grade Web Applications**

---

## Mission Statement

Build a **world-class, production-grade** website for Hashtag Technology that exemplifies modern web development best practices. Every line of code, every component, and every deployment decision must align with our core principles: **Performance**, **Maintainability**, **Accessibility**, and **Developer Experience**.

---

## Core Principles

### 1. SOLID Principles

Apply these object-oriented design principles across all code:

| Principle | Description | Application |
|-----------|-------------|-------------|
| **S**ingle Responsibility | A component/function does ONE thing | Each React component handles only its UI concern |
| **O**pen/Closed | Open for extension, closed for modification | Use composition over inheritance; extend via props/slots |
| **L**iskov Substitution | Derived types must be substitutable | Component variants must work interchangeably |
| **I**nterface Segregation | Prefer small, specific interfaces | Split large prop interfaces into focused ones |
| **D**ependency Inversion | Depend on abstractions, not concretions | Use TypeScript interfaces; inject dependencies via context |

**Example - Single Responsibility:**
```tsx
// ❌ BAD - Component does too much
function ServiceCard({ service }) {
  const [formData, setFormData] = useState({});
  async function handleSubmit() { /* API call */ }
  
  return (
    <div>
      {/* Renders card AND handles its own form */}
    </div>
  );
}

// ✅ GOOD - Separated concerns
function ServiceCard({ service, onClick }) {
  return <Card onClick={onClick}>{/* Just renders */}</Card>;
}

function ServiceInquiryForm({ service, onSubmit }) {
  return <form onSubmit={onSubmit}>{/* Just form logic */}</form>;
}
```

### 2. DRY (Don't Repeat Yourself)

**Maximize code reuse, minimize duplication:**

| Strategy | Implementation |
|----------|----------------|
| **Component Library** | Create reusable UI components in `components/ui/` |
| **Custom Hooks** | Extract shared logic into `hooks/` |
| **Utility Functions** | Common helpers in `lib/utils.ts` |
| **CSS Variables** | Single source of truth for design tokens |
| **Type Definitions** | Shared types in `types/` directory |

**Pattern Recognition Rule:**
```
IF pattern appears 2+ times:
  1. Abstract into reusable component/hook/utility
  2. Document in appropriate location
  3. Create skill if it's a cross-project pattern
```

### 3. Performance First (Vercel React Best Practices)

Reference: `@.claude/skills/vercel-react-best-practices/`

#### Critical Performance Rules

| Category | Rule | Implementation |
|----------|------|----------------|
| **Waterfalls** | Eliminate sequential data fetching | Use `Promise.all()` for parallel fetches |
| **Bundle Size** | Minimize JavaScript shipped | Use `next/dynamic` for heavy components |
| **Server Components** | Default to RSC | Only add `"use client"` when necessary |
| **Images** | Optimize all images | Use `next/image` with proper `sizes` |
| **Fonts** | Prevent layout shift | Use `next/font` with `display: swap` |

```tsx
// ✅ Parallel data fetching
export default async function HomePage() {
  const [services, testimonials, partners] = await Promise.all([
    getServices(),
    getTestimonials(),
    getPartners()
  ]);
  
  return <Home services={services} testimonials={testimonials} partners={partners} />;
}

// ✅ Dynamic import for heavy components
const ChatWidget = dynamic(() => import('@/components/chat-widget'), {
  ssr: false,
  loading: () => <ChatWidgetSkeleton />
});

// ✅ Proper image optimization
<Image
  src={heroImage}
  alt="Hashtag Technology Team"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority
/>
```

### 4. Type Safety

**TypeScript is mandatory. No `any` types allowed.**

```typescript
// ✅ Define explicit types
interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  features: string[];
  category: 'web-development' | 'app-development' | 'marketing' | 'ai-services';
  order: number;
}

// ✅ Use Zod for runtime validation
const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short'),
});

type ContactFormData = z.infer<typeof ContactFormSchema>;
```

---

## CSS Variables & Theming System (CRITICAL)

> **RULE: Never use hardcoded colors. All styling MUST use CSS variables.**

### Design Token Architecture

```
globals.css (CSS Variables - Single Source of Truth)
       ↓
tailwind.config.ts (Maps variables to Tailwind classes)
       ↓
Components (Use Tailwind classes only)
```

### Variable Categories

```css
:root {
  /* === BRAND COLORS (Change these to retheme entire site) === */
  --brand-primary: 242 107 107;        /* #F26B6B - Coral Red */
  --brand-primary-dark: 185 69 72;     /* #B94548 - Dark Red */
  --brand-primary-hover: 163 61 64;    /* #A33D40 */
  --brand-primary-light: 253 234 234;  /* #FDEAEA */
  --brand-gradient: linear-gradient(135deg, rgb(242 107 107) 0%, rgb(185 69 72) 100%);
  
  /* === SURFACE COLORS === */
  --surface-background: 255 255 255;
  --surface-foreground: 90 90 90;      /* #5A5A5A */
  --surface-muted: 245 245 245;
  --surface-dark: 26 26 26;
  
  /* === COMPONENT TOKENS === */
  --card-background: 255 255 255;
  --card-border: 229 229 229;
  --input-focus: var(--brand-primary);
  
  /* === ANIMATION TOKENS === */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* === SPACING SCALE === */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

### Usage Rules

```tsx
// ✅ CORRECT - Using Tailwind with CSS variable mappings
<button className="bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg">
  Get Started
</button>

// ❌ WRONG - Hardcoded colors
<button className="bg-[#F26B6B] hover:bg-[#B94548]">
  Get Started
</button>

// ✅ CORRECT - Gradient usage
<div style={{ background: 'var(--brand-gradient)' }}>
  Branded Section
</div>
```

---

## Available Skills & Agents

### Skills Directory

**Location:** `.claude/skills/`

**Usage Rule:** ALWAYS check for existing skills BEFORE implementing any feature.

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `@frontend-designer` | Animation-first UI design | Landing pages, scroll animations, micro-interactions |
| `@building-nextjs-apps` | Next.js 14+ App Router patterns | Page structure, routing, server components |
| `@sanity-integration` | Sanity CMS integration | Blog, careers, services content |
| `@vercel-react-best-practices` | Performance optimization | Code review, bundle optimization |
| `@web-design-guidelines` | Accessibility compliance | UI review, WCAG compliance |
| `@chatbot-widget-creator` | Embeddable chat widgets | AI chat widget implementation |
| `@deployment-engineer` | CI/CD and deployment | GitHub Actions, Vercel deployment |
| `@rag-pipeline-builder` | RAG implementations | AI-powered search, chatbot knowledge base |
| `@ux-evaluator` | UX evaluation | Testing user flows, identifying friction |

### Agents Directory

**Location:** `.claude/agents/`

| Agent | Purpose | Orchestrates |
|-------|---------|--------------|
| `nextjs-frontend-architect` | Complete frontend implementation | `building-nextjs-apps`, `frontend-designer`, `theme-factory` |
| `deployment-engineer` | Production deployment | CI/CD, Docker, Kubernetes, Vercel |
| `content-writer` | Marketing and SEO content | Blog posts, metadata, social content |
| `chatkit-integrator` | Chat UI integration | OpenAI ChatKit patterns |
| `openai-agents-sdk-specialist` | AI agent development | OpenAI Agents SDK, MCP |

### Invoking Skills

```
// Reference a skill
@.claude/skills/frontend-designer

// Use in prompt
"Following the @frontend-designer skill, implement scroll animations for the hero section"
```

### Invoking Agents

```
// In Claude Code
/agent nextjs-frontend-architect
"Build the testimonials carousel section"
```

---

## File Structure & Organization

```
hashtag-tech/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Marketing pages group
│   │   ├── page.tsx              # Homepage
│   │   ├── services/
│   │   ├── blog/
│   │   └── career/
│   ├── api/                      # API routes
│   │   ├── posts/route.ts
│   │   ├── services/route.ts
│   │   └── contact/route.ts
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # CSS Variables (source of truth)
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # Robots.txt
├── components/
│   ├── layout/                   # Header, Footer, Navigation
│   ├── sections/                 # Homepage sections
│   ├── ui/                       # Reusable UI (shadcn/ui)
│   ├── forms/                    # Form components
│   └── animations/               # Animation wrappers
├── hooks/                        # Custom React hooks
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── animations.ts             # GSAP configurations
│   └── sanity/                   # Sanity client & helpers
├── sanity/
│   ├── schemaTypes/              # Sanity schemas
│   └── lib/
├── types/                        # TypeScript definitions
├── public/                       # Static assets
│   ├── images/
│   └── fonts/
├── .claude/
│   ├── skills/                   # Reusable skills
│   ├── agents/                   # Subagent definitions
│   └── commands/                 # Slash commands
└── module_prompts/               # Feature specification prompts
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ServiceCard.tsx` |
| Hooks | camelCase with `use` prefix | `useScrollAnimation.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `ServiceType.ts` |
| CSS Variables | kebab-case with prefix | `--brand-primary` |
| Sanity Schemas | camelCase with suffix | `postType.ts` |

---

## Code Quality Gates

### Before Every Commit

```bash
# Run all checks
npm lint && npm type-check && npm test

# Or use the turbo pipeline
npm turbo lint type-check test
```

### Checklist

- [ ] No TypeScript errors (`npm type-check`)
- [ ] No ESLint warnings (`npm lint`)
- [ ] Tests pass (`npm test`)
- [ ] No hardcoded colors/values
- [ ] Components use design tokens
- [ ] Images optimized with `next/image`
- [ ] Server Components used where possible
- [ ] Accessibility attributes present (alt, aria-*)
- [ ] Mobile responsive verified

---

## Animation Architecture

Reference: `@.claude/skills/frontend-designer/`

### Two Animation Engines

| Engine | Use Case | Examples |
|--------|----------|----------|
| **GSAP ScrollTrigger** | Scroll-driven storytelling | Section reveals, parallax, counters |
| **Motion.dev (Framer Motion)** | Micro-interactions | Hover states, modals, carousels |

### Animation Token System

```tsx
// lib/animations.ts
export const animations = {
  // Entrance animations
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  },
  
  // Stagger children
  staggerContainer: {
    animate: { transition: { staggerChildren: 0.1 } }
  },
  
  // GSAP ScrollTrigger config
  scrollReveal: {
    start: 'top 80%',
    end: 'top 20%',
    scrub: 1
  }
};
```

### Reduced Motion Support (MANDATORY)

```tsx
// Always respect user preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable or simplify animations
  gsap.globalTimeline.timeScale(0);
}
```

---

## Sanity CMS Integration

Reference: `@.claude/skills/sanity-integration/`

### Content Types

| Type | Schema | API Route |
|------|--------|-----------|
| Blog Posts | `postType.ts` | `/api/posts` |
| Careers | `careerType.ts` | `/api/careers` |
| Services | `serviceType.ts` | `/api/services` |
| AI Services | `aiServiceType.ts` | `/api/ai-services` |

### Caching Strategy (ISR)

```tsx
// app/api/services/route.ts
export const revalidate = 3600; // 1 hour

export async function GET() {
  const services = await sanityClient.fetch(servicesQuery);
  return Response.json(services);
}
```

### GROQ Query Patterns

```groq
// Fetch services with features
*[_type == "service" && isFeatured == true] | order(order asc) {
  _id,
  title,
  slug,
  shortDescription,
  features,
  "imageUrl": icon.asset->url
}
```

---

## Error Handling

### API Routes

```typescript
// app/api/contact/route.ts
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = ContactFormSchema.parse(data);
    
    // Process...
    return Response.json({ success: true });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Contact form error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Client-Side Error Boundaries

```tsx
// components/error-boundary.tsx
'use client';

export function ErrorBoundary({ children, fallback }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ErrorBoundaryInner fallback={fallback}>
        {children}
      </ErrorBoundaryInner>
    </Suspense>
  );
}
```

---

## Accessibility Requirements

Reference: `@.claude/skills/web-design-guidelines/`

### WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | 4.5:1 minimum for text |
| Keyboard Navigation | All interactive elements focusable |
| Screen Reader | Semantic HTML, ARIA labels |
| Focus Indicators | Visible focus states using `--ring` color |
| Alt Text | Descriptive alt for all images |
| Reduced Motion | `prefers-reduced-motion` support |

### Testing Tools

```bash
# Lighthouse accessibility audit
npx lighthouse http://localhost:3000 --only-categories=accessibility

# axe-core integration
npm add -D @axe-core/react
```

---

## Development Workflow

### 1. Feature Development

```
1. Read spec in `module_prompts/` or `specs/`
2. Check for applicable skills
3. Implement with proper typing
4. Use CSS variables for styling
5. Add animations using appropriate engine
6. Test responsiveness
7. Verify accessibility
8. Run quality gates
9. Commit with conventional commit message
```

### 2. Conventional Commits

```
feat(services): add AI services section with animations
fix(hero): correct mobile layout spacing
docs(readme): update deployment instructions
style(global): update brand colors from logo
refactor(utils): extract common animation helpers
```

### 3. Branch Strategy

```
main              ← Production
  └── develop     ← Integration
       ├── feature/hero-section
       ├── feature/sanity-integration
       └── fix/mobile-nav
```

---

## Quick Reference Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build               # Production build
npm run lint                # ESLint
npm run type-check          # TypeScript check

# Sanity
npm run sanity dev          # Sanity Studio
npm run sanity deploy       # Deploy Studio

# Testing
npm run test                # Run tests
npm run test:e2e            # E2E tests

# Deployment
npm run deploy:preview      # Vercel preview
npm run deploy:production   # Vercel production
```

---

## Goals & Success Metrics

### Technical Goals

- [ ] Lighthouse Performance Score: 90+
- [ ] Lighthouse Accessibility Score: 100
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3s
- [ ] Cumulative Layout Shift: < 0.1
- [ ] Zero TypeScript errors
- [ ] Zero accessibility violations

### Business Goals

- [ ] Pixel-perfect recreation of design
- [ ] All sections fully responsive
- [ ] Sanity CMS powering dynamic content
- [ ] Contact form functional with email integration
- [ ] AI Chat widget operational
- [ ] SEO optimized (metadata, sitemap, structured data)

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|----------|---------------|
| Hardcode colors | Use CSS variables |
| Use `any` type | Define proper TypeScript types |
| Nest ternaries deeply | Extract to helper functions |
| Ignore accessibility | Include ARIA, semantic HTML |
| Skip error handling | Implement proper try/catch |
| Forget loading states | Add Suspense with skeletons |
| Use barrel exports | Import directly from modules |
| Over-animate | Subtle, purposeful animations |
| Ignore mobile | Mobile-first development |

---

## Resources

- **Hashtag Tech Redesign Spec:** `module_prompts/hashtag-tech-website-redesign.md`
- **Skills Directory:** `.claude/skills/`
- **Agents Directory:** `.claude/agents/`
- **Vercel React Best Practices:** `.claude/skills/vercel-react-best-practices/SKILL.md`
- **Next.js Docs:** https://nextjs.org/docs
- **Sanity Docs:** https://www.sanity.io/docs
- **Motion.dev Docs:** https://motion.dev/docs/react-quick-start

---

> **Remember:** Code is read more than it's written. Write for your future self and your team. When in doubt, prioritize clarity over cleverness.

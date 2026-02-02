<!--
SYNC IMPACT REPORT
==================
Version change: Initial → 1.0.0
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (6 principles)
  - Code Standards
  - CSS Variables & Theming System
  - Animation Architecture
  - Sanity CMS Integration
  - Error Handling
  - Accessibility Requirements
  - Development Workflow
  - Quick Reference Commands
  - Goals & Success Metrics
  - Anti-Patterns to Avoid
  - Resources
Removed sections: N/A (initial creation)
Templates requiring updates:
  - plan-template.md: ✅ Constitution Check section exists, aligns with SOLID/DRY/Performance/Type Safety principles
  - spec-template.md: ✅ Requirements sections align with principle-driven constraints
  - tasks-template.md: ✅ Task organization aligns with DRY principle and independent testability
  - sp.plan.md: ✅ Constitution check gate references constitution file
  - sp.tasks.md: ✅ Task categorization reflects principle-driven development
Follow-up TODOs: None - all placeholders filled
-->

# Hashtag Tech Project Constitution

> **Spec-Driven Development (SDD) for Production-Grade Web Applications**

---

## Mission Statement

Build a **world-class, production-grade** website for Hashtag Technology that exemplifies modern web development best practices. Every line of code, every component, and every deployment decision must align with our core principles: **Performance**, **Maintainability**, **Accessibility**, and **Developer Experience**.

---

## Core Principles

### I. SOLID Principles

Apply these object-oriented design principles across all code:

| Principle | Description | Application |
|-----------|-------------|-------------|
| **S**ingle Responsibility | A component/function does ONE thing | Each React component handles only its UI concern |
| **O**pen/Closed | Open for extension, closed for modification | Use composition over inheritance; extend via props/slots |
| **L**iskov Substitution | Derived types must be substitutable | Component variants must work interchangeably |
| **I**nterface Segregation | Prefer small, specific interfaces | Split large prop interfaces into focused ones |
| **D**ependency Inversion | Depend on abstractions, not concretions | Use TypeScript interfaces; inject dependencies via context |

**Rationale**: SOLID principles ensure code is modular, testable, and maintainable. They prevent tight coupling and make the codebase resilient to change.

**Example - Single Responsibility**:
```tsx
// ✅ GOOD - Separated concerns
function ServiceCard({ service, onClick }) {
  return <Card onClick={onClick}>{/* Just renders */}</Card>;
}

function ServiceInquiryForm({ service, onSubmit }) {
  return <form onSubmit={onSubmit}>{/* Just form logic */}</form>;
}
```

### II. DRY (Don't Repeat Yourself)

Maximize code reuse, minimize duplication.

**Strategies**:
- **Component Library**: Create reusable UI components in `components/ui/`
- **Custom Hooks**: Extract shared logic into `hooks/`
- **Utility Functions**: Common helpers in `lib/utils.ts`
- **CSS Variables**: Single source of truth for design tokens
- **Type Definitions**: Shared types in `types/` directory

**Pattern Recognition Rule**:
```
IF pattern appears 2+ times:
  1. Abstract into reusable component/hook/utility
  2. Document in appropriate location
  3. Create skill if it's a cross-project pattern
```

**Rationale**: Duplication increases maintenance burden and creates inconsistency. A single source of truth ensures changes propagate automatically.

### III. Performance First (Vercel React Best Practices)

Optimize for Core Web Vitals and minimal bundle size.

**Critical Performance Rules**:

| Category | Rule | Implementation |
|----------|------|----------------|
| **Waterfalls** | Eliminate sequential data fetching | Use `Promise.all()` for parallel fetches |
| **Bundle Size** | Minimize JavaScript shipped | Use `next/dynamic` for heavy components |
| **Server Components** | Default to RSC | Only add `"use client"` when necessary |
| **Images** | Optimize all images | Use `next/image` with proper `sizes` |
| **Fonts** | Prevent layout shift | Use `next/font` with `display: swap` |

**Rationale**: Performance directly impacts user experience, SEO rankings, and conversion rates. The constitution requires aggressive optimization to meet Lighthouse 90+ performance scores.

### IV. Type Safety

TypeScript is mandatory. No `any` types allowed.

**Requirements**:
- All functions must have explicit parameter and return types
- Use Zod for runtime validation of external data
- Define interfaces for all data contracts
- Enable strict mode in tsconfig.json

**Rationale**: Type safety catches errors at compile time, serves as documentation, and enables confident refactoring.

### V. CSS Variables & Theming System

All styling MUST use CSS variables. No hardcoded colors.

**Design Token Architecture**:
```
globals.css (CSS Variables - Single Source of Truth)
       ↓
tailwind.config.ts (Maps variables to Tailwind classes)
       ↓
Components (Use Tailwind classes only)
```

**Variable Categories**:
- **Brand Colors**: Primary, secondary, accent, gradients
- **Surface Colors**: Background, foreground, muted, dark
- **Component Tokens**: Card, input, button states
- **Animation Tokens**: Duration, easing, delays
- **Spacing Scale**: Border radius, padding, margins

**Rationale**: Centralized design tokens enable consistent theming, easy design system updates, and support for future dark mode or brand changes.

### VI. Accessibility (WCAG 2.1 AA)

All components MUST meet WCAG 2.1 AA standards.

**Requirements**:
- Color contrast: 4.5:1 minimum for text
- Keyboard navigation: All interactive elements focusable
- Screen reader support: Semantic HTML, ARIA labels
- Focus indicators: Visible focus states using `--ring` color
- Alt text: Descriptive alt for all images
- Reduced motion: `prefers-reduced-motion` support

**Rationale**: Accessibility is a requirement, not a feature. It ensures all users can use the application and is often a legal requirement.

---

## Code Standards

### Code Quality Gates

Before every commit, all checks MUST pass:

```bash
npm run lint          # Zero ESLint warnings
npm run type-check    # Zero TypeScript errors
npm run test          # All tests pass
```

### Pre-Commit Checklist

- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Tests pass
- [ ] No hardcoded colors/values
- [ ] Components use design tokens
- [ ] Images optimized with `next/image`
- [ ] Server Components used where possible
- [ ] Accessibility attributes present (alt, aria-*)
- [ ] Mobile responsive verified

### Conventional Commits

Follow conventional commit format:

```
feat(scope): description
fix(scope): description
docs(scope): description
style(scope): description
refactor(scope): description
test(scope): description
```

---

## Animation Architecture

### Two Animation Engines

| Engine | Use Case | Examples |
|--------|----------|----------|
| **GSAP ScrollTrigger** | Scroll-driven storytelling | Section reveals, parallax, counters |
| **Motion.dev (Framer Motion)** | Micro-interactions | Hover states, modals, carousels |

### Animation Token System

All animations MUST use centralized tokens in `lib/animations.ts`.

### Reduced Motion Support (MANDATORY)

Always respect user preferences:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(0);
}
```

---

## Sanity CMS Integration

### Content Types

| Type | Schema | API Route |
|------|--------|-----------|
| Blog Posts | `postType.ts` | `/api/posts` |
| Careers | `careerType.ts` | `/api/careers` |
| Services | `serviceType.ts` | `/api/services` |
| AI Services | `aiServiceType.ts` | `/api/ai-services` |

### Caching Strategy (ISR)

All API routes MUST use ISR with appropriate revalidation times.

---

## Error Handling

### API Routes

All API routes MUST:
- Validate input with Zod schemas
- Return appropriate HTTP status codes
- Log errors for debugging
- Never expose sensitive information

### Client-Side Error Boundaries

All client components MUST be wrapped in error boundaries.

---

## Development Workflow

### Feature Development Process

1. Read spec in `module_prompts/` or `specs/`
2. Check for applicable skills in `.claude/skills/`
3. Implement with proper typing
4. Use CSS variables for styling
5. Add animations using appropriate engine
6. Test responsiveness
7. Verify accessibility
8. Run quality gates
9. Commit with conventional commit message

### Branch Strategy

```
main              ← Production
  └── develop     ← Integration
       ├── feature/hero-section
       ├── feature/sanity-integration
       └── fix/mobile-nav
```

---

## Goals & Success Metrics

### Technical Goals (Non-Negotiable)

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

## Governance

### Amendment Procedure

1. Proposal: Document proposed change with rationale
2. Review: Team review for impact assessment
3. Approval: Majority approval required for principles changes
4. Migration: Update all dependent templates and documentation
5. Version bump: Follow semantic versioning

### Versioning Policy

- **MAJOR**: Backward incompatible governance/principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review

- All plans MUST pass Constitution Check before Phase 0 research
- All code reviews MUST verify principle compliance
- Violations MUST be justified in Complexity Tracking table
- Complexity justification requires team approval

### Runtime Guidance

For day-to-day development decisions, reference:
- Project Constitution (this file) - Principles and governance
- `.claude/skills/` - Specialized implementation guidance
- `module_prompts/` - Feature-specific specifications

---

## Resources

- **Hashtag Tech Redesign Spec**: `module_prompts/hashtag-tech-website-redesign.md`
- **Skills Directory**: `.claude/skills/`
- **Agents Directory**: `.claude/agents/`
- **Vercel React Best Practices**: `.claude/skills/vercel-react-best-practices/SKILL.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Sanity Docs**: https://www.sanity.io/docs
- **Motion.dev Docs**: https://motion.dev/docs/react-quick-start

---

**Version**: 1.0.0 | **Ratified**: 2026-02-02 | **Last Amended**: 2026-02-02

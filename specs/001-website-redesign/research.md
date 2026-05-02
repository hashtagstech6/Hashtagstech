# Research: Hashtag Tech Website Redesign

**Feature**: 001-website-redesign
**Date**: 2026-02-02
**Status**: Complete - All clarifications resolved

---

## Executive Summary

All technical decisions for the Hashtag Tech website redesign have been clarified during the specification phase. This document summarizes the research outcomes and technology choices that inform the implementation plan.

---

## Technology Decisions

### 1. Email Service Provider

**Decision**: Brevo (formerly SendinBlue)

**Rationale**:
- Explicitly specified in spec clarifications
- Generous free tier: 300 emails/day
- Excellent Node.js SDK with TypeScript support
- Proven reliability for transactional emails
- Simple API integration with webhooks

**Alternatives Considered**:
- SendGrid: Industry standard but smaller free tier (100/day)
- Nodemailer: Provider-agnostic but requires SMTP configuration
- Deferring: Would block Phase 1 contact form implementation

**Implementation Note**: API route prepared for Brevo SDK in Phase 1, actual email delivery configured with API keys in environment variables.

---

### 2. Animation Duration Strategy

**Decision**: Tiered approach based on animation type

| Animation Type | Duration | Rationale |
|---------------|----------|-----------|
| Hover/Tap states | 100-200ms | Feels instant, provides feedback |
| Page transitions (modals, drawers) | 300-400ms | Perceivable but quick |
| Scroll-based reveals | 500-800ms | Allows visual emphasis |

**Rationale**:
- Follows Material Design motion principles
- Matches Human Interface Guidelines
- Different interaction types have appropriate perceived weight
- Supports SC-013 success criteria

**Implementation**: Centralized animation tokens in `lib/animations.ts` using CSS variables (`--duration-hover`, `--duration-transition`, `--duration-scroll`).

---

### 3. Frontend Error Logging

**Decision**: Essential errors only (console, contact form failures, API errors)

**Rationale**:
- Balances debugging needs with log volume
- Captures critical issues without overwhelming telemetry
- Sufficient for Phase 1 sample data implementation
- Can be expanded in Phase 2 if needed

**Implementation** (NFR-009):
```typescript
// Log essential errors with context
window.onerror = (message, source, lineno, colno, error) => {
  logError({ message, source, lineno, colno, error });
};
```

**Alternatives Considered**:
- Comprehensive logging: Overkill for Phase 1, adds complexity
- Minimal only: Would miss important failure patterns
- Deferred: Would lose debugging capability

---

### 4. Chat Widget Architecture

**Decision**: Reusable component with configuration props

**Rationale**:
- Supports future reusability across projects
- No hardcoding of "Devmate Solutions" branding
- Easy customization via props interface
- Aligns with SOLID Open/Closed principle

**Props Interface** (FR-066):
```typescript
interface ChatWidgetProps {
  companyName: string;
  companyLogo: string;
  primaryColor: string;
  agentName: string;
  agentAvatar: string;
  welcomeMessage: string;
}
```

**Implementation Note**: Default props configured for Hashtag Tech branding, but component remains generic for potential reuse.

---

### 5. Image Format Strategy

**Decision**: WebP with PNG/JPEG fallback (Next.js automatic)

**Rationale**:
- Industry standard for modern web performance
- Next.js Image component handles format selection automatically
- WebP provides ~25-35% size reduction over PNG
- Fallback ensures compatibility with older browsers
- Zero configuration overhead

**Implementation** (FR-055):
```tsx
<Image
  src="/images/hero.jpg"
  alt="Hero illustration"
  width={800}
  height={600}
  // Next.js automatically serves WebP to supported browsers
/>
```

**Alternatives Considered**:
- PNG only: Simpler but larger file sizes
- SVG only: Not suitable for photos/complex illustrations
- Placeholder URLs only: Would block visual implementation

---

## Technology Stack Verification

### Core Dependencies

| Package | Version | Purpose | Verification |
|---------|---------|---------|--------------|
| next | 14.0.0+ | Framework | ✅ App Router, Server Components |
| react | 18.2.0+ | UI Library | ✅ Compatible with Next.js 14 |
| typescript | 5.x | Type Safety | ✅ Strict mode required |
| tailwindcss | 3.3.0+ | Styling | ✅ CSS variables support |
| gsap | 3.12.0+ | Scroll Animations | ✅ ScrollTrigger plugin |
| framer-motion | 10.16.0+ | Micro-interactions | ✅ Compatible with React 18 |
| zod | 3.22.0+ | Validation | ✅ Runtime type safety |
| @brevo/brevo-sdk | latest | Email | ✅ Node.js SDK |

### Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 90+ | Full ES2021 support |
| Firefox | 88+ | Full ES2021 support |
| Safari | 14+ | WebP support, flexbox gap |
| Edge | 90+ | Chromium-based |
| Mobile Safari | 14+ | iOS 14+ |

**Rationale**: Targets modern browsers with >95% coverage. ES2021 and CSS Grid support enables clean implementation without polyfills.

---

## Performance Research

### Lighthouse Score Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Performance | 90+ | Server Components, ISR, code splitting |
| Accessibility | 100 | Semantic HTML, ARIA, keyboard nav |
| Best Practices | 90+ | HTTPS, secure headers, no errors |
| SEO | 90+ | Metadata, sitemap, structured data |

### Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| FCP | < 1.5s | First contentful paint |
| LCP | < 2.5s | Largest contentful paint |
| TTI | < 3s | Time to interactive |
| CLS | < 0.1 | Cumulative layout shift |

### Bundle Size Optimization

- **next/dynamic** for heavy components (GSAP, chat widget)
- **Tree-shaking** via ES modules
- **Server Components** reduce client JavaScript
- **ISR** prevents full rebuilds on content changes

---

## Accessibility Research

### WCAG 2.1 AA Compliance

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Color contrast | CSS variables with 4.5:1+ ratios | ✅ Specified in FR-065 |
| Keyboard navigation | Tab order, focus indicators | ✅ FR-062, FR-064 |
| Screen reader support | Semantic HTML, ARIA labels | ✅ FR-063, FR-067 |
| Focus management | No traps, visible focus | ✅ FR-068 |
| Reduced motion | `prefers-reduced-motion` | ✅ FR-025, FR-066 |
| Alt text | Descriptive text for images | ✅ FR-061 |

### Accessibility Testing Tools

- **Lighthouse**: Automated accessibility audit
- **axe DevTools**: Detailed violation reports
- **Keyboard navigation**: Manual testing
- **Screen reader**: NVDA (Windows), VoiceOver (Mac)

---

## Animation Architecture Research

### GSAP vs. CSS Animations

**Decision**: Hybrid approach
- **GSAP ScrollTrigger**: Complex scroll-driven storytelling
- **Motion.dev (Framer Motion)**: Micro-interactions, gestures
- **CSS transitions**: Simple hover states

**Rationale**:
- GSAP provides precise timeline control for scroll animations
- Motion.dev offers declarative gesture handling
- CSS transitions sufficient for simple state changes
- Combination optimizes for performance and developer experience

### Reduced Motion Implementation

```typescript
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Disable GSAP timeline if reduced motion preferred
if (prefersReducedMotion()) {
  gsap.globalTimeline.timeScale(0);
}
```

---

## Sanity CMS Research (Phase 2)

### Schema Design Principles

1. **Portable Text** for rich content (blog posts, job descriptions)
2. **Reference fields** for relationships (author, categories)
3. **Slug fields** with automatic generation from title
4. **Boolean flags** for content control (isActive, isFeatured)

### GROQ Query Patterns

```javascript
// Fetch all posts with author and categories
*[_type == "post" && publishedAt <= now()] {
  _id, title, slug, excerpt, publishedAt,
  author-> { name, slug, image },
  categories[]-> { name, slug }
} | order(publishedAt desc)

// Fetch active careers only
*[_type == "career" && isActive == true && publishedAt <= now()] {
  _id, title, slug, department, location, type
} | order(publishedAt desc)
```

### ISR Strategy

| Content Type | Revalidation | Rationale |
|--------------|---------------|-----------|
| Blog posts | 60s | Frequent updates, time-sensitive |
| Careers | 300s | Periodic updates, lower frequency |
| Services | 3600s | Infrequent changes, stable |
| AI Services | 3600s | Static feature list |

---

## Security Considerations

### API Route Security

1. **Rate limiting**: Prevent abuse of contact form endpoint
2. **Input validation**: Zod schemas on all inputs
3. **CORS configuration**: Restrict to origin domain
4. **Environment variables**: Secrets never exposed to client

### Email Security (Brevo)

1. **API keys**: Stored in environment variables
2. **Sender verification**: Verified sender email
3. **Recipient validation**: Single recipient for contact form
4. **Rate limiting**: Brevo applies limits automatically

---

## Development Workflow Research

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run type-check"
    }
  }
}
```

### Conventional Commits

```
feat(header): add sticky navigation with scroll shadow
fix(chat): resolve focus trap issue
docs(readme): update setup instructions
refactor(services): extract common card component
test(contact): add Zod validation tests
```

---

## Open Questions & Resolutions

| Question | Resolution | Status |
|----------|------------|--------|
| Email service provider | Brevo (SendinBlue) | ✅ Resolved |
| Animation durations | Tiered (100-200ms, 300-400ms, 500-800ms) | ✅ Resolved |
| Frontend logging scope | Essential errors only | ✅ Resolved |
| Chat widget reusability | Configurable props | ✅ Resolved |
| Image format strategy | WebP with PNG fallback | ✅ Resolved |
| Font selection | Inter or Outfit (next/font) | ✅ Resolved |
| Animation library split | GSAP for scroll, Motion.dev for UI | ✅ Resolved |

**All research complete. No outstanding questions.**

---

## References

- **Next.js 14**: https://nextjs.org/docs
- **GSAP ScrollTrigger**: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- **Motion.dev**: https://motion.dev/docs
- **Sanity CMS**: https://www.sanity.io/docs
- **Brevo SDK**: https://developers.brevo.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Material Design Motion**: https://m2.material.io/design/motion

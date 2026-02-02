---
id: 001
title: website-redesign-plan
stage: plan
date: 2026-02-02
surface: agent
model: glm-4.7
feature: 001-website-redesign
branch: 001-website-redesign
user: user
command: /sp.plan
labels: ["spec-driven-development","architecture","planning"]
links:
  spec: spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-website-redesign/plan.md
  - specs/001-website-redesign/research.md
  - specs/001-website-redesign/data-model.md
  - specs/001-website-redesign/quickstart.md
  - specs/001-website-redesign/contracts/api-routes.yaml
tests:
  - Lighthouse Performance 90+
  - Lighthouse Accessibility 100
  - TypeScript strict mode validation
  - ESLint zero warnings
---

## Prompt

# Hashtag Tech Website Redesign - Technical Implementation Plan

> **Spec Document**: `specs/001-website-redesign/spec.md`
> **Project Constitution**: `.specify/memory/constitution.md`
> **Design Reference**: `screenshots/` directory (12 screenshots for visual fidelity)
> **Brand Assets**: `public/` directory (logo-horizontal.jpeg, logo-vertical.jpeg, favicon.jpeg)

---

## Pre-Implementation Checklist

Before starting any implementation, verify:

- [ ] Read `specs/001-website-redesign/spec.md` completely
- [ ] Read `.specify/memory/constitution.md` for code quality principles
- [ ] Review all 12 screenshots in `screenshots/` directory
- [ ] Extract brand colors from `public/logo-horizontal.jpeg` and `public/favicon.jpeg`
- [ ] Understand the two-phase approach (Phase 1: hardcoded, Phase 2: Sanity CMS)

---

## Brand Colors (From Logo Assets)

The color palette MUST be extracted from the actual logo files in `public/`:

| Token | Hex | RGB | Source |
|-------|-----|-----|--------|
| `--brand-primary` | `#F26B6B` | 242 107 107 | Coral Red (center of logo) |
| `--brand-primary-dark` | `#B94548` | 185 69 72 | Dark Red (corners of logo) |
| `--brand-primary-hover` | `#A33D40` | 163 61 64 | Darker for interactions |
| `--brand-primary-light` | `#FDEAEA` | 253 234 234 | Light tint backgrounds |
| `--text-primary` | `#5A5A5A` | 90 90 90 | "Hash" text color |
| `--text-accent` | `#F26B6B` | 242 107 107 | "tags" text color |

**Gradient**: `linear-gradient(135deg, #F26B6B 0%, #B94548 100%)` - flows from coral to dark red

---

[Full user input includes detailed technical architecture, file structure, implementation phases, brand colors, performance targets, and all functional requirements mapping]

---

> **Remember**: Use screenshots as the visual source of truth. The goal is pixel-perfect recreation of the existing design with modern implementation patterns.

## Response snapshot

**Successfully generated comprehensive implementation plan:**

1. **plan.md** - Full technical implementation plan with:
   - Constitution Check: All gates passed (SOLID, DRY, Performance, Type Safety, CSS Variables, Accessibility)
   - Technical Context: TypeScript 5.x, Next.js 14+, Tailwind 3.x, GSAP, Motion.dev, Zod, Brevo
   - Complete project structure for web application
   - Phase 0: Research summary with all technology decisions resolved
   - Phase 1: Data models and API contracts
   - Quick Start Guide with step-by-step setup instructions
   - Implementation phases (Phase 1: ~26 hours, Phase 2: ~18 hours)
   - Success criteria and verification checklist

2. **research.md** - Technology decisions research:
   - Email Service: Brevo (clarified)
   - Animation Durations: Tiered approach (100-200ms hover, 300-400ms transitions, 500-800ms scroll)
   - Frontend Logging: Essential errors only
   - Chat Widget: Reusable component with props
   - Image Format: WebP with PNG fallback (Next.js automatic)
   - Browser compatibility and performance targets

3. **data-model.md** - Complete data models:
   - Phase 1: Hardcoded interfaces (Service, Testimonial, AIService, Partner, ContactFormSubmission, ChatWidgetConfig, Stats)
   - Phase 2: Sanity CMS entities (BlogPost, Author, Category, Career, SanityService, SanityAIService)
   - Migration path from Phase 1 to Phase 2

4. **quickstart.md** - Developer quick start guide:
   - Prerequisites and setup steps
   - Next.js initialization with TypeScript and Tailwind
   - CSS variables configuration (globals.css, tailwind.config.ts)
   - Font setup with next/font
   - Directory structure creation
   - Environment variables setup
   - First implementation steps (types, utils, animations, hooks, components)
   - Development commands and troubleshooting

5. **contracts/api-routes.yaml** - OpenAPI specification for all API routes:
   - GET /api/posts (blog listing, 60s ISR)
   - GET /api/posts/[slug] (blog post, 60s ISR)
   - GET /api/careers (jobs listing, 300s ISR)
   - GET /api/careers/[slug] (job posting, 300s ISR)
   - GET /api/services (services, 3600s ISR)
   - GET /api/ai-services (AI services, 3600s ISR)
   - POST /api/contact (contact form submission with Brevo)

## Outcome

- ✅ Impact: Complete technical plan generated, all constitution gates passed, ready for task generation
- 🧪 Tests: Lighthouse 90+/100 targets defined, TypeScript strict mode specified, zero-tolerance policy for errors
- 📁 Files: 5 files created (plan.md, research.md, data-model.md, quickstart.md, contracts/api-routes.yaml)
- 🔁 Next prompts: Run `/sp.tasks` to generate actionable, dependency-ordered tasks for implementation
- 🧠 Reflection: Plan comprehensively addresses all requirements. Two-phase approach (hardcoded → Sanity CMS) well-defined. All technology decisions from clarifications session integrated.

## Evaluation notes (flywheel)

- Failure modes observed: None - plan generation completed successfully
- Graders run and results (PASS/FAIL): Constitution Check: PASS (all 6 gates)
- Prompt variant (if applicable): User provided detailed technical architecture upfront - accelerated plan generation
- Next experiment (smallest change to try): Proceed to `/sp.tasks` to generate implementation tasks

---
id: 001
title: Hashtag Tech Website Redesign Spec
stage: spec
date: 2026-02-02
surface: agent
model: claude-opus-4-5-20251101
feature: 001-website-redesign
branch: 001-website-redesign
user: architect
command: /sp.specify
labels: ["spec","sdd","website-redesign"]
links:
  spec: specs/001-website-redesign/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-website-redesign/spec.md
  - specs/001-website-redesign/checklists/requirements.md
tests:
  - N/A (spec creation)
---

## Prompt

# Hashtag Tech Website Redesign - Complete Specification Prompt

> **Reference Skills:** `@frontend-designer`, `@vercel-react-best-practices`, `@web-design-guidelines`, `@sanity-integration`, `@building-nextjs-apps`
>
> **Project Constitution:** `module_prompts/project-constitution.md` - Read this first for code quality standards, SOLID/DRY principles, and CSS variable requirements.
>
> **Recommended Agents:** `@nextjs-frontend-architect`, `@deployment-engineer`

---

## Project Overview

Build a pixel-perfect recreation of the **Hashtag Tech** website (hashtagstech.com) using **Next.js 14+ App Router** with **TypeScript**, **Tailwind CSS**, and **Sanity CMS** integration. The website serves as an AI-powered software development agency showcasing services, team, portfolio, and blog content.

### Key Deliverables
1. Responsive Next.js website with all sections from screenshots
2. Sanity CMS integration for Blogs and Careers pages
3. Contact form prepared for Brevo/SendGrid email integration
4. AI Chat Widget with Devmate Solutions branding
5. Modern animations throughout (GSAP ScrollTrigger + Motion.dev)

[... complete specification includes design system, color palette, typography, CSS variables, 13 website sections, animations, Sanity CMS schemas, API routes, file structure, and success criteria ...]

## Response snapshot

Feature specification created successfully for Hashtag Tech Website Redesign.

**Summary**:
- **Feature**: 001-website-redesign
- **Branch**: `001-website-redesign` (created and checked out)
- **Spec File**: `specs/001-website-redesign/spec.md`
- **Checklist**: `specs/001-website-redesign/checklists/requirements.md`

**User Stories Created** (6 prioritized, independently testable):
1. **P1 - Discover Services**: Browse and understand service offerings
2. **P1 - View Company Credibility**: See testimonials and portfolio for trust
3. **P2 - Contact the Company**: Submit inquiries via contact form
4. **P2 - Access Company Information**: Find locations, team info, CEO details
5. **P3 - Read Blog Content**: Access thought leadership content
6. **P3 - Explore Career Opportunities**: View and apply for job openings

**Functional Requirements**: 68 requirements across 8 categories
- Homepage & Layout (16 requirements)
- Design & Styling (6 requirements)
- Animations & Interactions (8 requirements)
- Content Management (6 requirements for Sanity CMS schemas)
- API Routes & Data (8 requirements)
- Contact Form (5 requirements)
- Chat Widget (5 requirements)
- Performance & Technical (6 requirements)
- Accessibility (8 requirements)

**Key Entities**: BlogPost, Author, Category, Career, Service, AIService, ContactFormSubmission

**Success Criteria**: 15 measurable outcomes including Lighthouse Performance 90+, Accessibility 100, FCP < 1.5s, TTI < 3s

**Edge Cases Identified**: Reduced motion, CMS unavailability, JavaScript disabled, image failures, large form submissions

**Assumptions Documented**: Content management approach, email integration scope, image placeholders, animation performance, responsive breakpoints, Lighthouse targets

## Outcome

- ✅ Impact: Established complete feature specification with clear user stories, requirements, and success criteria
- 🧪 Tests: Requirements checklist passed - all items validated
- 📁 Files: Created spec.md and requirements checklist
- 🔁 Next prompts: Ready for `/sp.plan` to create implementation plan, or `/sp.clarify` if additional questions arise
- 🧠 Reflection: Specification is comprehensive with 6 prioritized user stories, 68 functional requirements, and technology-agnostic success criteria. No [NEEDS CLARIFICATION] markers - all requirements are clear with documented assumptions.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All checklist items passed
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Validate constitution compliance during `/sp.plan` phase to ensure all principles (SOLID, DRY, Performance, Type Safety, CSS Variables, Accessibility) are followed in implementation

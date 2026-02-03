# Hashtag Tech Website

Official website for Hashtag Tech - AI-Powered Software Development Agency.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📁 Project Structure

```
hashtag-tech/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # Public-facing pages
│   │   ├── page.tsx          # Homepage
│   │   ├── contact/          # Contact page
│   │   ├── blog/             # Blog pages
│   │   └── career/           # Career pages
│   ├── api/                  # API routes
│   ├── layout.tsx            # Root layout
│   ├── error.tsx             # Error boundary
│   ├── not-found.tsx         # 404 page
│   ├── sitemap.ts            # Dynamic sitemap
│   └── robots.ts             # Robots.txt
├── components/               # React components
│   ├── layout/              # Layout components (Header, Footer, PageHeader)
│   ├── sections/            # Page sections (Hero, Stats, Services, etc.)
│   ├── ui/                  # Reusable UI components
│   ├── forms/               # Form components (ContactForm)
│   ├── widgets/             # Widget components (ChatWidget)
│   └── animations/          # Animation components (ScrollReveal)
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions
├── types/                   # TypeScript type definitions
├── data/                    # Hardcoded data (Phase 1)
├── public/                  # Static assets
└── specs/                   # Specification documents
```

## 🎨 Features

- **Modern Tech Stack**: Built with Next.js 14+, TypeScript, Tailwind CSS
- **Animations**: GSAP scroll animations and Motion.dev micro-interactions
- **SEO Optimized**: Dynamic sitemap, robots.txt, and Open Graph tags
- **ISR Caching**: Incremental Static Regeneration for performance
- **Accessibility**: WCAG 2.1 AA compliant with reduced motion support
- **Contact Form**: Zod-validated form with Brevo email integration
- **Chat Widget**: Reusable, configurable chat component
- **Blog**: Dynamic blog listing and detail pages
- **Careers**: Job listings with ISR caching

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Brevo Email (optional - for contact form)
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=noreply@hashtagstech.com
BREVO_RECIPIENT_EMAIL=contact@devmatesolutions.com
```

## 📱 Pages

- **/**** - Homepage with all sections
- **/contact** - Contact form page
- **/blog** - Blog listing
- **/blog/[slug]** - Blog post detail
- **/career** - Career listings
- **/career/[slug]** - Job posting detail

## 🎨 Design System

The website uses a CSS variables-based design system defined in `app/globals.css`:

- **Brand Colors**: Primary coral red (#F26B6B)
- **Surface Colors**: Backgrounds and foregrounds
- **Animation Tokens**: Duration and easing functions
- **Border Radius**: Consistent rounded corners
- **Focus Ring**: Accessible focus indicators

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Reduced motion support
- Screen reader friendly
- Color contrast WCAG 2.1 AA compliant

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```bash
docker build -t hashtag-tech .
docker run -p 3000:3000 hashtag-tech
```

### Static Export (Optional)

To generate a static export, modify `next.config.mjs` and run:

```bash
npm run build
```

## 📝 Specifications

Project specifications, architecture decisions, and task breakdowns are documented in the `specs/` directory:

- `specs/001-website-redesign/spec.md` - Feature requirements
- `specs/001-website-redesign/plan.md` - Implementation plan
- `specs/001-website-redesign/tasks.md` - Task breakdown

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

## 📄 License

Copyright © 2024 Hashtag Tech. All rights reserved.

## 🔗 Links

- **Website**: https://hashtagstech.com
- **Documentation**: See `specs/` directory

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

---

## Design System & Brand Identity

### Color Palette (From Actual Logo)

The logo uses a **gradient** with two red tones. Use these exact colors:

| Token Name | Hex Value | RGB | Usage |
|------------|-----------|-----|-------|
| `--brand-primary` | `#F26B6B` | 242 107 107 | Coral Red - Main brand color, CTAs, accent text |
| `--brand-primary-dark` | `#B94548` | 185 69 72 | Dark Red - Gradients, hover states, depth |
| `--brand-primary-hover` | `#A33D40` | 163 61 64 | Darker hover state |
| `--brand-primary-light` | `#FDEAEA` | 253 234 234 | Light red tint for backgrounds |
| `--surface-dark` | `#1A1A1A` | 26 26 26 | Dark backgrounds (testimonials section) |
| `--surface-light` | `#FFFFFF` | 255 255 255 | Main content backgrounds |
| `--surface-muted` | `#F5F5F5` | 245 245 245 | Subtle background variations |
| `--text-primary` | `#5A5A5A` | 90 90 90 | Main text (matches "Hash" in logo) |
| `--text-secondary` | `#888888` | 136 136 136 | Secondary text |
| `--text-muted` | `#AAAAAA` | 170 170 170 | Captions, labels |
| `--text-accent` | `#F26B6B` | 242 107 107 | "tags" text color in logo |
| `--text-on-dark` | `#FFFFFF` | 255 255 255 | Text on dark backgrounds |
| `--border-subtle` | `#E5E5E5` | 229 229 229 | Subtle borders, dividers |

**Logo Gradient Direction:** The logo gradient flows from coral (#F26B6B) to dark red (#B94548) - use this for branded gradient elements.

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| H1 (Hero) | Inter or Outfit | 700 Bold | 48-64px |
| H2 (Section) | Inter or Outfit | 700 Bold | 36-42px |
| H3 (Card Titles) | Inter or Outfit | 600 SemiBold | 24-28px |
| Body | Inter | 400 Regular | 16-18px |
| Caption/Label | Inter | 500 Medium | 12-14px |
| Accent/Highlight | Same as context | Inherit | Red color applied |

**Typography Pattern:** Black text with selective **red accent words** for emphasis (e.g., "AI Powered Agency **Application**", "Hear from **Our Clients**", "Development & **Marketing**")

---

## Tailwind CSS Theme Configuration (CRITICAL)

> **Important:** All design tokens MUST be defined as CSS custom properties and extended in Tailwind config. Never use hardcoded hex/rgb values in component files.

### CSS Custom Properties (`app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ============================================
       BRAND COLORS - From actual Hashtags Technology logo
       Logo uses gradient: Coral Red (#F26B6B) to Dark Red (#B94548)
       ============================================ */
    --brand-primary: 242 107 107;        /* #F26B6B - Coral Red (main brand) */
    --brand-primary-dark: 185 69 72;     /* #B94548 - Dark Red (gradient end) */
    --brand-primary-hover: 163 61 64;    /* #A33D40 - Darker hover state */
    --brand-primary-light: 253 234 234;  /* #FDEAEA - Light red tint */
    
    /* Brand Gradient - Use for buttons, banners, accents */
    --brand-gradient: linear-gradient(135deg, rgb(242 107 107) 0%, rgb(185 69 72) 100%);
    
    /* ============================================
       SURFACE COLORS
       ============================================ */
    --surface-background: 255 255 255;   /* #FFFFFF - Main background */
    --surface-foreground: 26 26 26;      /* #1A1A1A - Main text */
    --surface-muted: 248 248 248;        /* #F8F8F8 - Muted backgrounds */
    --surface-muted-foreground: 102 102 102; /* #666666 - Muted text */
    --surface-dark: 26 26 26;            /* #1A1A1A - Dark sections */
    --surface-dark-foreground: 255 255 255;  /* #FFFFFF - Text on dark */
    
    /* ============================================
       SEMANTIC COLORS
       ============================================ */
    --accent: 230 43 30;                 /* Same as brand-primary */
    --accent-foreground: 255 255 255;    /* White text on accent */
    
    --destructive: 239 68 68;            /* Error red */
    --destructive-foreground: 255 255 255;
    
    --success: 34 197 94;                /* Success green */
    --success-foreground: 255 255 255;
    
    --warning: 234 179 8;                /* Warning yellow */
    --warning-foreground: 26 26 26;
    
    /* ============================================
       COMPONENT TOKENS
       ============================================ */
    --card: 255 255 255;
    --card-foreground: 26 26 26;
    --card-border: 229 229 229;          /* #E5E5E5 */
    
    --input: 255 255 255;
    --input-border: 229 229 229;
    --input-focus: 230 43 30;            /* Brand primary on focus */
    
    --button-primary: 230 43 30;
    --button-primary-foreground: 255 255 255;
    --button-secondary: 255 255 255;
    --button-secondary-foreground: 230 43 30;
    --button-secondary-border: 230 43 30;
    
    /* ============================================
       BORDER & RING
       ============================================ */
    --border: 229 229 229;               /* #E5E5E5 */
    --border-strong: 204 204 204;        /* #CCCCCC */
    --ring: 230 43 30;                   /* Focus ring - brand primary */
    --ring-offset: 255 255 255;
    
    /* ============================================
       SPACING & SIZING TOKENS
       ============================================ */
    --radius-sm: 0.375rem;               /* 6px */
    --radius-md: 0.5rem;                 /* 8px */
    --radius-lg: 0.75rem;                /* 12px */
    --radius-xl: 1rem;                   /* 16px */
    --radius-full: 9999px;               /* Fully rounded */
    
    /* ============================================
       SHADOW TOKENS
       ============================================ */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-card-hover: 0 20px 40px -12px rgb(230 43 30 / 0.15);
    
    /* ============================================
       ANIMATION TOKENS
       ============================================ */
    --duration-fast: 150ms;
    --duration-normal: 300ms;
    --duration-slow: 500ms;
    --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
    --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    --easing-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
    
    /* ============================================
       TYPOGRAPHY TOKENS
       ============================================ */
    --font-display: 'Outfit', 'Inter', system-ui, sans-serif;
    --font-body: 'Inter', system-ui, sans-serif;
    
    --text-xs: 0.75rem;                  /* 12px */
    --text-sm: 0.875rem;                 /* 14px */
    --text-base: 1rem;                   /* 16px */
    --text-lg: 1.125rem;                 /* 18px */
    --text-xl: 1.25rem;                  /* 20px */
    --text-2xl: 1.5rem;                  /* 24px */
    --text-3xl: 1.875rem;                /* 30px */
    --text-4xl: 2.25rem;                 /* 36px */
    --text-5xl: 3rem;                    /* 48px */
    --text-6xl: 3.75rem;                 /* 60px */
    
    /* ============================================
       Z-INDEX SCALE
       ============================================ */
    --z-dropdown: 50;
    --z-sticky: 100;
    --z-fixed: 200;
    --z-modal-backdrop: 300;
    --z-modal: 400;
    --z-popover: 500;
    --z-tooltip: 600;
    --z-chat-widget: 1000;
  }

  /* Dark mode overrides (if needed later) */
  .dark {
    --surface-background: 26 26 26;
    --surface-foreground: 255 255 255;
    --surface-muted: 38 38 38;
    --surface-muted-foreground: 163 163 163;
    --card: 38 38 38;
    --card-foreground: 255 255 255;
    --border: 64 64 64;
  }
}

/* Utility classes for brand accent text */
@layer utilities {
  .text-accent {
    color: rgb(var(--brand-primary));
  }
  
  .bg-accent {
    background-color: rgb(var(--brand-primary));
  }
  
  .border-accent {
    border-color: rgb(var(--brand-primary));
  }
  
  .ring-accent {
    --tw-ring-color: rgb(var(--brand-primary));
  }
}
```

### Tailwind Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ============================================
         COLOR TOKENS - All reference CSS variables
         ============================================ */
      colors: {
        // Brand Colors
        brand: {
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          "primary-hover": "rgb(var(--brand-primary-hover) / <alpha-value>)",
          "primary-light": "rgb(var(--brand-primary-light) / <alpha-value>)",
        },
        
        // Surface Colors
        background: "rgb(var(--surface-background) / <alpha-value>)",
        foreground: "rgb(var(--surface-foreground) / <alpha-value>)",
        
        muted: {
          DEFAULT: "rgb(var(--surface-muted) / <alpha-value>)",
          foreground: "rgb(var(--surface-muted-foreground) / <alpha-value>)",
        },
        
        dark: {
          DEFAULT: "rgb(var(--surface-dark) / <alpha-value>)",
          foreground: "rgb(var(--surface-dark-foreground) / <alpha-value>)",
        },
        
        // Semantic Colors
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        
        success: {
          DEFAULT: "rgb(var(--success) / <alpha-value>)",
          foreground: "rgb(var(--success-foreground) / <alpha-value>)",
        },
        
        warning: {
          DEFAULT: "rgb(var(--warning) / <alpha-value>)",
          foreground: "rgb(var(--warning-foreground) / <alpha-value>)",
        },
        
        // Component Colors
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
          border: "rgb(var(--card-border) / <alpha-value>)",
        },
        
        input: {
          DEFAULT: "rgb(var(--input) / <alpha-value>)",
          border: "rgb(var(--input-border) / <alpha-value>)",
          focus: "rgb(var(--input-focus) / <alpha-value>)",
        },
        
        border: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
      },
      
      /* ============================================
         TYPOGRAPHY - Font families from CSS vars
         ============================================ */
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
        "5xl": "var(--text-5xl)",
        "6xl": "var(--text-6xl)",
      },
      
      /* ============================================
         BORDER RADIUS - From CSS vars
         ============================================ */
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      
      /* ============================================
         SHADOWS - From CSS vars
         ============================================ */
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "card-hover": "var(--shadow-card-hover)",
      },
      
      /* ============================================
         ANIMATIONS & TRANSITIONS
         ============================================ */
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
      },
      
      transitionTimingFunction: {
        default: "var(--easing-default)",
        bounce: "var(--easing-bounce)",
        smooth: "var(--easing-smooth)",
      },
      
      /* ============================================
         Z-INDEX SCALE
         ============================================ */
      zIndex: {
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        fixed: "var(--z-fixed)",
        "modal-backdrop": "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
        "chat-widget": "var(--z-chat-widget)",
      },
      
      /* ============================================
         KEYFRAME ANIMATIONS
         ============================================ */
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "counter-up": {
          "0%": { "--num": "0" },
          "100%": { "--num": "var(--target)" },
        },
      },
      
      animation: {
        "fade-in": "fade-in var(--duration-normal) var(--easing-default)",
        "fade-up": "fade-up var(--duration-normal) var(--easing-default)",
        "slide-in-right": "slide-in-right var(--duration-normal) var(--easing-smooth)",
        "slide-in-left": "slide-in-left var(--duration-normal) var(--easing-smooth)",
        "scale-in": "scale-in var(--duration-normal) var(--easing-bounce)",
        pulse: "pulse 2s var(--easing-default) infinite",
        float: "float 3s var(--easing-smooth) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Usage Examples in Components

```tsx
// ✅ CORRECT - Using theme tokens
<button className="bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg px-6 py-3 transition-all duration-normal ease-default shadow-md hover:shadow-card-hover">
  Get Started
</button>

// ✅ CORRECT - Card with theme tokens
<div className="bg-card border border-card-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-normal">
  <h3 className="text-foreground font-display text-2xl font-bold">Title</h3>
  <p className="text-muted-foreground font-body">Description text</p>
</div>

// ✅ CORRECT - Accent text for red highlights
<h2 className="text-foreground">
  Development & <span className="text-brand-primary">Marketing</span>
</h2>

// ✅ CORRECT - Dark section
<section className="bg-dark text-dark-foreground py-20">
  <h2 className="text-4xl font-bold">Hear from <span className="text-brand-primary">Our Clients</span></h2>
</section>

// ❌ WRONG - Never use hardcoded colors
<button className="bg-[#E62B1E] text-white">Wrong</button>
<div className="text-[#666666]">Also wrong</div>
```

### Theming Quick Reference

**To change the entire site's color scheme:**

1. Open `app/globals.css`
2. Modify the CSS variables in `:root`
3. All components automatically update

**Example - Switch to Blue Theme:**
```css
:root {
  --brand-primary: 59 130 246;          /* Blue-500 */
  --brand-primary-hover: 37 99 235;     /* Blue-600 */
  --brand-primary-light: 239 246 255;   /* Blue-50 */
  /* ...rest stays the same */
}
```

### Logo

The Hashtag Tech logo features:
- Red rounded square with white "crosshair/hashtag" symbol inside
- Logo mark used alone in header, footer, and chat widget
- Position: Top-left in header

---

## Website Sections Specification

### 1. Navigation Header

**Structure:**
```
[Logo] ---- [HOME] [SERVICES] [TEAM] [CAREER] [BOOK MEETING] ---- [GET INSTANT CALL →] (Red CTA Button)
```

**Behavior:**
- Sticky header on scroll
- Smooth scroll navigation for anchor links
- Mobile: Hamburger menu with slide-in drawer
- CTA button uses `--brand-primary` with white text and right arrow icon

**Animation:** 
- Header slides down on page load (0.3s ease-out)
- Subtle shadow appears on scroll

---

### 2. Hero Section

**Layout:** Two-column (60% text, 40% illustration)

**Left Column Content:**
- Subtext: "Registered & Operating in **DXB, MUSCAT & NYC** ♦" (small caps, red diamond icon)
- Headline: "AI Powered Agency **Application**" (last word in red)
- CTA Button: "OUR SERVICES →" (red background, white text, rounded)

**Right Column:**
- Team illustration showing diverse professionals in office setting
- **PLACEHOLDER:** Use `{HERO_ILLUSTRATION}` - will be replaced with actual image

**Animation:**
- Hero text: Character-by-character reveal using GSAP SplitText simulation
- Illustration: Fade in from right with parallax on scroll
- CTA button: Pulse animation on idle, scale on hover

---

### 3. Stats Bar

**Full-width red banner (`--brand-primary` background)**

**Content (4 columns, evenly spaced):**
| Icon | Stat |
|------|------|
| ✓ Checkmark | Since 2019 |
| ✓ Checkmark | 40+ Global Brands |
| ✓ Checkmark | 25+ Industries |
| ✓ Checkmark | 96% Rating |

**Animation:**
- Counter animation on scroll-into-view (numbers count up)
- Staggered reveal from left to right

---

### 4. Success Stories / Portfolio Section

**Header:**
- Label: "Our Success Stories"
- Headline: "Procope AI US" (client name - scrolling marquee or carousel)

**Layout:** Split layout with text list on left, portfolio image on right

**Client List (Left):**
```
Procope AI US
Finaxe GB  
Shift-Application OM
Refurbly- Vodafone...
```

**Portfolio Preview (Right):**
- Featured project card with dark overlay
- Example: Finaxe - "People Are The Solution" tagline
- City skyline background image
- **PLACEHOLDER:** Use `{PORTFOLIO_IMAGE_1}`, `{PORTFOLIO_IMAGE_2}`, etc.

**Bottom Link:** "MORE WORKS →" (red text with arrow)

**Animation:**
- Client names: Vertical auto-scrolling marquee
- Portfolio images: Crossfade carousel or smooth slide transition
- Hover: Slight scale and shadow elevation

---

### 5. DEVMATE Section

**Layout:** Two-column (illustration left, content right)

**Left Column:**
- Chess pieces illustration (red outline style, artistic/sketched look)
- **PLACEHOLDER:** Use `{CHESS_ILLUSTRATION}`

**Right Column:**
- Label: "Pioneering Digital Revolution Since 2018"
- Headline: "Checkmate your Software and Digital Marketing goals with **DEVMATE**"
- Feature List (checkmarks):
  - ✓ Top-Notch Websites & Apps
  - ✓ Advanced AI Agents and Automation
  - ✓ NFTs & Blockchain Tokenization
  - ✓ Meta & Google Lead Generation
- CTA: "GET INSTANT CALL →" (red button)

**Animation:**
- Chess pieces: Subtle floating/bobbing animation
- Feature list: Staggered fade-in on scroll
- Headline: Text reveal with red word emphasis

---

### 6. Testimonials Section

**Dark Background (`--surface-dark`)**

**Header:**
- Label: "Success Stories"
- Headline: "Hear from **Our Clients**" (red accent)

**Testimonial Card:**
- 5-star rating (★★★★★)
- Quote: "Devmate Solutions revamped our Finaxe website with improved design and functionality. They were highly professional, delivered on time, and exceeded expectations. Highly recommend!"
- Avatar: Circular photo
- Name: "Hussain Mousa"
- Title: "MEA Director, Finaxe us"

**Navigation:** Left/Right arrow buttons for carousel

**Animation:**
- Cards slide in from sides
- Star rating: Sequential fill animation
- Quote: Typewriter effect (optional)

---

### 7. AI Services Section

**Header:**
- Label: "Your Partner In AI Transformation"
- Headline: "10x Your Business with AI!"

**Layout:** 3-column card grid

**Card 1 - AI Voice Agents (numbered 01):**
```
AI Voice Agents [01]
Automate calls with Intelligent, 24/7 AI that delivers seamless, human-like interactions for enhanced customer service.

• 24/7 Customer Care
• Cost Efficient  
• Inbound & Outbound Lead Generation
• Appointments & Bookings
```

**Card 2 - AI Smart Chatbots (numbered 02):**
```
AI Smart Chatbots [02]
Instant, AI-powered support that engages customers 24/7 with accurate, automated responses.

• Instant Responses
• Human Like Conversation
• 24/7 Lead Generation
• 70% Increased Engagement
```

**Card 3 - Custom AI Agents (numbered 03):**
```
Custom AI Agents [03]
Personalized AI Agents tailored to your business requirements, delivering seamless automation and enhanced functionalities.

• Tailored to Your Needs
• Scalable Solutions
• Cost-Effective
• Boost Efficiency
```

**Card Design:**
- White background with subtle border
- Red bullet point checkmarks
- Numbered badges (01, 02, 03) in top-right

**Animation:**
- Cards: Staggered entrance on scroll
- Hover: Elevation with shadow, subtle border color change
- Number badges: Count-up animation

---

### 8. CTA Banner Section

**Layout:** Three-column centered

**Left:** Chess knight illustration (red outline style)
**Center:**
- Headline: "Do You Want Us To Checkmate Your Software Challenges?"
- Subtext: "Get Call from FREYA our AI Assistant Now Within 60 Seconds!!"
**Right:** CTA Button "GET CALL NOW →"

**Animation:**
- Knight: Subtle bounce/shake animation
- Text: Fade up from bottom
- Button: Glow pulse effect

---

### 9. Partners Section

**Header:**
- Label: "We Are Operating Globally"
- Headline: "OUR PARTNERS"

**Layout:** Grid of partner photos with country flags

**Partner Cards:**
- Circular or rounded portrait photos
- Country flag overlay (UAE, Oman, Cyprus, etc.)
- **PLACEHOLDERS:** Use `{PARTNER_PHOTO_1}`, `{PARTNER_PHOTO_2}`, etc.

**Animation:**
- Cards: Fade in with stagger
- Flags: Subtle wave animation (CSS animation)

---

### 10. Services Grid Section

**Header:**
- Label: "Our Popular Services"
- Headline: "Development & **Marketing**" (red accent)

**Layout:** 3-column grid

**Column 1 - Web Development:**
```
Web Development
Either 3D website or Full-Stack Application with modern design. We've got you covered

[✓ Get Started] (outlined button)

• 3D Experience Websites
• Full Stack Applications
• Ecommerce Stores
• SEO Optimised
• Aesthetic Figma Designs
```

**Column 2 - Social Media Marketing:**
```
Social Media Marketing
Whether it's viral campaigns or targeted ads with custom content that you want, you are at right place!

[✓ Get Started] (red solid button)

• Meta & Google Campaigns
• Organic Followers
• Lead Generation
• Branding & Viral Content
```

**Column 3 - App Development:**
```
App Development
We build all kinds of apps—whether it's AI-powered solutions, startup apps, or apps tailored to any niche. Let's bring your idea into life!

[✓ Get Started] (outlined button)

• Android & IOS
• AI-Powered Apps
• Blockchain & Web 3.0
• Flutter & IOS
• Cross-Platform
```

**Button Styles:**
- Primary (center column): Red fill, white text
- Secondary (side columns): White fill, red border, red text

**Animation:**
- Columns: Slide up with stagger
- Checkmarks: Draw-in animation
- Buttons: Ripple effect on click

---

### 11. CEO Section

**Layout:** Two-column (photo left, content right)

**Left Column:**
- CEO professional photo
- Diagonal red accent lines as decorative background
- **PLACEHOLDER:** Use `{CEO_PHOTO}`

**Right Column:**
- Label: "Message From The CEO"
- Headline: "Zain Ul Abideen Baloch"
- Bio paragraph describing vision, partnerships, and achievements
- Social icons: Facebook, LinkedIn, X (Twitter), Instagram, YouTube
- Special Offer: "Offering 1:1 Discovery Session for Business Owners, Entrepreneurs, and Students seeking expert consultancy. (286 $ for 45 Minutes)"
- CTA: "Pay $286 & Unlock →" (red button)

**Animation:**
- Photo: Parallax scroll effect
- Red lines: Draw-in animation
- Social icons: Pop-in with stagger

---

### 12. Footer Section

**Layout:** Two-column grid

**Column 1 - Get In Touch:**
```
Get In Touch

UAE: Business Bay, Dubai
USA: Atlanta, GA
Oman: Al Mouj, Muscat

24/7 Customer Support
contact@devmatesolutions.com
```

**Column 2 - Quick Links:**
```
Quick Links

Services
Team
Career
Book Meeting with CEO
```

**Social Links:** "Connect Here: [Facebook] [Instagram]"

**Copyright Bar:**
```
Copyright & Design By @DEVMATE Solutions - 2026
```

**Animation:**
- Links: Underline animation on hover
- Social icons: Scale on hover

---

### 13. Chat Widget (Floating)

**Position:** Bottom-right corner

**Collapsed State:**
- Red circular video call button (camera icon)
- Red play/chat button below

**Expanded State (Modal):**
```
┌──────────────────────────────────┐
│ [Logo] Devmate Solutions   🔊 — × │
├──────────────────────────────────┤
│                                  │
│         [Logo Large]             │
│                                  │
│     Devmate Solutions            │
│   Hi, how can I help you today?  │
│                                  │
│         Yesterday                │
│                                  │
│  ┌─────────────────────────────┐ │
│  │ Hey, it's Angela from       │ │
│  │ DEVMATE Solutions. What     │ │
│  │ do you need help with? 😊   │ │
│  └─────────────────────────────┘ │
│                                  │
│       The chat has ended         │
│                                  │
├──────────────────────────────────┤
│      [ Start New Chat ]          │
└──────────────────────────────────┘
```

**Styling:**
- Header: Black background with white text
- Body: Light gray/white background
- Agent messages: Light blue bubbles with agent avatar
- CTA: "Start New Chat" - red full-width button

**Animation:**
- Widget: Slide up + fade in on click
- Messages: Typing indicator then reveal
- Minimize: Slide down + fade out

---

## Animations & Interactions Specification

### GSAP ScrollTrigger (Storytelling Engine)

Use for:
- Section reveals and entrance animations
- Parallax effects on images
- Pinned sections (if needed)
- Stats counter animations

### Motion.dev (Micro-interactions)

Use for:
- Button hover/tap states
- Card hover elevations
- Menu transitions
- Chat widget open/close
- `<AnimatePresence>` for modal/widget mounting

### Animation Choreography Script

```
0-5% Scroll: Header fades in, Hero text reveals character-by-character
5-15%: Hero illustration slides in from right with parallax
15-20%: Stats bar scrolls into view, counters animate
20-35%: Success stories marquee starts, portfolio carousel auto-plays
35-50%: DEVMATE section pins briefly, chess pieces float, features list stagger in
50-60%: Testimonials slide in from sides
60-75%: AI Services cards stagger entrance, number badges count up
75-85%: CTA section, knight bounces
85-95%: Services grid slides up with stagger
95-100%: CEO section with parallax photo, footer reveals
```

---

## Sanity CMS Integration

### Content Types to Create

#### 1. Blog Post Schema
```typescript
{
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: required },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', type: 'text', rows: 3 },
    { name: 'mainImage', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string' }] },
    { name: 'content', type: 'blockContent' },
    { name: 'author', type: 'reference', to: [{ type: 'author' }] },
    { name: 'categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'category' }] }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'seoTitle', type: 'string', validation: max(60) },
    { name: 'seoDescription', type: 'text', validation: max(160) },
  ]
}
```

#### 2. Career/Job Posting Schema
```typescript
{
  name: 'career',
  title: 'Career Opening',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: required },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'department', type: 'string', options: { list: ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations'] } },
    { name: 'location', type: 'string' },
    { name: 'type', type: 'string', options: { list: ['Full-time', 'Part-time', 'Contract', 'Remote'] } },
    { name: 'description', type: 'blockContent' },
    { name: 'requirements', type: 'array', of: [{ type: 'string' }] },
    { name: 'benefits', type: 'array', of: [{ type: 'string' }] },
    { name: 'isActive', type: 'boolean', initialValue: true },
    { name: 'publishedAt', type: 'datetime' },
  ]
}
```

#### 3. Author Schema
```typescript
{
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'image', type: 'image', options: { hotspot: true } },
    { name: 'bio', type: 'text' },
  ]
}
```

#### 4. Service Schema
```typescript
{
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: required },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'category', type: 'string', options: { 
      list: ['web-development', 'app-development', 'social-media-marketing', 'ai-services'] 
    }},
    { name: 'shortDescription', type: 'text', rows: 3 },
    { name: 'icon', type: 'image', options: { hotspot: true } },
    { name: 'features', type: 'array', of: [{ type: 'string' }] },  // Bullet points
    { name: 'content', type: 'blockContent' },  // Full service page content
    { name: 'ctaText', type: 'string', initialValue: 'Get Started' },
    { name: 'ctaStyle', type: 'string', options: { list: ['primary', 'secondary'] } },
    { name: 'order', type: 'number' },  // Display order on homepage
    { name: 'isFeatured', type: 'boolean', initialValue: false },
    { name: 'seoTitle', type: 'string', validation: max(60) },
    { name: 'seoDescription', type: 'text', validation: max(160) },
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }]
}
```

#### 5. AI Service Schema (for AI Services section)
```typescript
{
  name: 'aiService',
  title: 'AI Service',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: required },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'number', type: 'string' },  // "01", "02", "03"
    { name: 'shortDescription', type: 'text', rows: 3 },
    { name: 'features', type: 'array', of: [{ type: 'string' }] },
    { name: 'content', type: 'blockContent' },
    { name: 'order', type: 'number' },
    { name: 'isActive', type: 'boolean', initialValue: true },
  ],
  orderings: [{ title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }]
}
```

### API Routes

- `GET /api/posts` - List all blog posts with ISR (60s revalidation)
- `GET /api/posts/[slug]` - Single post with metadata
- `GET /api/careers` - List active job openings
- `GET /api/careers/[slug]` - Single job posting
- `GET /api/services` - List all services (for homepage grid)
- `GET /api/services/[slug]` - Single service page
- `GET /api/ai-services` - List AI services (for AI section)

---

## Contact Form Integration

### Form Structure
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: 'web-development' | 'mobile-app' | 'ai-agents' | 'marketing' | 'other';
  message: string;
}
```

### API Route (Prepared for Email Service)
```typescript
// app/api/contact/route.ts
// Ready for Brevo/SendGrid integration
// Placeholder for email service configuration

export async function POST(request: Request) {
  const data = await request.json();
  
  // TODO: Integrate with Brevo or SendGrid
  // const response = await emailService.send({
  //   to: 'contact@devmatesolutions.com',
  //   from: 'noreply@devmatesolutions.com',
  //   subject: `New Inquiry from ${data.name}`,
  //   template: 'contact-form',
  //   data: data
  // });
  
  return Response.json({ success: true });
}
```

---

## File Structure

```
hashtag-tech/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── services/page.tsx
│   │   ├── team/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx                # Blog listing
│   │   │   └── [slug]/page.tsx         # Blog post
│   │   └── career/
│   │       ├── page.tsx                # Career listings
│   │       └── [slug]/page.tsx         # Job posting
│   ├── api/
│   │   ├── posts/route.ts
│   │   ├── careers/route.ts
│   │   └── contact/route.ts
│   ├── layout.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── chat-widget.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── stats-bar.tsx
│   │   ├── success-stories.tsx
│   │   ├── devmate.tsx
│   │   ├── testimonials.tsx
│   │   ├── ai-services.tsx
│   │   ├── cta-banner.tsx
│   │   ├── partners.tsx
│   │   ├── services-grid.tsx
│   │   └── ceo-section.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...shadcn components
│   └── forms/
│       └── contact-form.tsx
├── sanity/
│   ├── schemaTypes/
│   │   ├── postType.ts
│   │   ├── careerType.ts
│   │   ├── authorType.ts
│   │   ├── categoryType.ts
│   │   └── blockContentType.ts
│   ├── lib/
│   │   ├── client.ts
│   │   └── image.ts
│   └── env.ts
├── lib/
│   ├── animations.ts                   # GSAP configurations
│   └── utils.ts
└── public/
    ├── images/
    │   └── placeholders/
    └── fonts/
```

---

## Image Placeholders

Replace these placeholders with actual images:

| Placeholder | Description | Recommended Size |
|-------------|-------------|------------------|
| `{HERO_ILLUSTRATION}` | Team office illustration | 800x600px |
| `{CHESS_ILLUSTRATION}` | Chess pieces red outline art | 600x500px |
| `{CEO_PHOTO}` | CEO professional headshot | 500x600px |
| `{PORTFOLIO_IMAGE_N}` | Portfolio project screenshots | 600x400px |
| `{PARTNER_PHOTO_N}` | Partner portraits with flags | 300x300px |
| `{TESTIMONIAL_AVATAR_N}` | Client circular photos | 80x80px |

---

## Performance Requirements

Following `@vercel-react-best-practices`:

1. **Bundle Optimization:**
   - Use `next/dynamic` for heavy components (GSAP, chat widget)
   - Avoid barrel file imports
   - Defer third-party scripts (analytics, chat)

2. **Image Optimization:**
   - Use `next/image` with Sanity image loader
   - Implement blur placeholders
   - Set proper `sizes` attribute

3. **Server Components:**
   - Use RSC for static content
   - Minimal client components
   - `React.cache()` for data deduplication

4. **ISR Strategy:**
   - Homepage: `revalidate = 3600` (1 hour)
   - Blog listing: `revalidate = 60`
   - Blog posts: `revalidate = 60`
   - Career pages: `revalidate = 300`

---

## Accessibility Requirements

Following `@web-design-guidelines`:

- All images have descriptive `alt` text
- Keyboard navigation for all interactive elements
- ARIA labels on icon-only buttons
- Focus visible states matching brand colors
- Color contrast ratio ≥ 4.5:1
- Reduced motion support (`prefers-reduced-motion`)

---

## Implementation Order

1. **Phase 1: Foundation**
   - Set up Next.js project with TypeScript and Tailwind
   - Configure design tokens and global styles
   - Create Header and Footer components

2. **Phase 2: Homepage Sections**
   - Build all 12 homepage sections with placeholder content
   - Implement responsive layouts
   - Add basic interactivity

3. **Phase 3: Animations**
   - Integrate GSAP ScrollTrigger for scroll animations
   - Add Motion.dev micro-interactions
   - Implement chat widget animations

4. **Phase 4: Sanity CMS**
   - Set up Sanity schemas
   - Create API routes with caching
   - Build Blog and Career pages

5. **Phase 5: Forms & Integration**
   - Build contact form with validation
   - Prepare email service integration structure
   - Add form success/error states

6. **Phase 6: Polish**
   - Replace image placeholders
   - Performance optimization
   - Accessibility audit
   - SEO metadata and structured data

---

## Notes for Implementation

### Code Quality (From Constitution)

1. **SOLID Principles:**
   - **Single Responsibility** - Each component handles ONE concern (e.g., `ServiceCard` renders, `ServiceForm` handles data)
   - **Open/Closed** - Use composition via props/slots, not modification
   - **Interface Segregation** - Small, focused prop interfaces
   - **Dependency Inversion** - Use TypeScript interfaces; inject via context

2. **DRY (Don't Repeat Yourself):**
   - Extract reusable components to `components/ui/`
   - Create custom hooks for shared logic in `hooks/`
   - Define shared types in `types/` directory
   - Pattern appears 2+ times? Abstract immediately

3. **CSS Variables (CRITICAL):**
   - **NEVER use hardcoded colors** (e.g., `bg-[#F26B6B]`)
   - **ALWAYS use Tailwind tokens** (e.g., `bg-brand-primary`)
   - All tokens defined in `globals.css` → mapped in `tailwind.config.ts`

### Design Rules

4. **Colors must use CSS variables** - No hex values in components
5. **Red accent pattern** - Apply `text-brand-primary` to specific words in headings
6. **Chat widget is separate** - Should work independently, client component
7. **Mobile-first** - All sections must be fully responsive
8. **Animations should enhance** - Keep duration under 0.5s for micro-interactions

### TypeScript Rules

9. **No `any` types** - Define explicit interfaces for all data
10. **Use Zod for validation** - Runtime validation on forms and API responses
11. **Strict mode enabled** - `"strict": true` in tsconfig.json

### Component Rules

12. **Server Components first** - Only add `"use client"` when necessary
13. **Use `next/dynamic`** - For heavy components (GSAP, ChatWidget)
14. **Use `next/image`** - For all images with proper `sizes` attribute
15. **Use `next/font`** - For font loading to prevent layout shift

---

## Skills & Agents Usage Guide

### Before Starting Each Section

```
1. Read the section specification above
2. Check applicable skills:
   - @frontend-designer for animations
   - @sanity-integration for CMS content
   - @vercel-react-best-practices for performance
3. Follow constitution patterns for component structure
4. Use CSS variable tokens from globals.css
5. Test responsiveness and accessibility
```

### Recommended Workflow per Section

| Phase | Action | Skill/Agent |
|-------|--------|-------------|
| Structure | Create component with proper RSC/Client split | `@building-nextjs-apps` |
| Styling | Apply CSS variable tokens via Tailwind | Constitution CSS section |
| Animation | Add scroll/micro animations | `@frontend-designer` |
| Content | Connect to Sanity if dynamic | `@sanity-integration` |
| Review | Verify accessibility | `@web-design-guidelines` |
| Optimize | Bundle size and performance | `@vercel-react-best-practices` |

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
```

---

## Success Criteria

- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 100
- [ ] No TypeScript errors
- [ ] No hardcoded colors in components
- [ ] All images use `next/image`
- [ ] Server Components used where possible
- [ ] Reduced motion support implemented
- [ ] Mobile responsive (320px - 1920px)
- [ ] Sanity CMS powering dynamic content
- [ ] Contact form with validation
- [ ] Chat widget functional

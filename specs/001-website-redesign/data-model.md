# Data Model: Hashtag Tech Website Redesign

**Feature**: 001-website-redesign
**Date**: 2026-02-02
**Phase**: 1 (Hardcoded) → 2 (Sanity CMS)

---

## Overview

This document defines all data entities used in the Hashtag Tech website. Phase 1 uses hardcoded TypeScript interfaces, while Phase 2 migrates to Sanity CMS-managed content.

---

## Phase 1: Hardcoded Data Models

### Service

**Purpose**: Service offerings displayed in homepage Services Grid section

```typescript
// types/service.ts
interface Service {
  id: string;
  title: string;
  slug: string;
  category: 'web-development' | 'app-development' | 'social-media-marketing' | 'ai-services';
  shortDescription: string;
  features: string[];
  ctaText: string;
  ctaStyle: 'primary' | 'secondary';
  order: number;
}
```

**Sample Data**:
```typescript
const services: Service[] = [
  {
    id: '1',
    title: 'Web Development',
    slug: 'web-development',
    category: 'web-development',
    shortDescription: 'Either 3D website or Full-Stack Application with modern design. We\'ve got you covered',
    features: [
      '3D Experience Websites',
      'Full Stack Applications',
      'Ecommerce Stores',
      'SEO Optimised',
      'Aesthetic Figma Designs'
    ],
    ctaText: 'Get Started',
    ctaStyle: 'secondary',
    order: 1
  },
  {
    id: '2',
    title: 'App Development',
    slug: 'app-development',
    category: 'app-development',
    shortDescription: 'Native iOS, Android, and cross-platform Flutter applications built for performance',
    features: [
      'iOS Development',
      'Android Development',
      'Flutter Apps',
      'UI/UX Design',
      'App Store Optimization'
    ],
    ctaText: 'Get Started',
    ctaStyle: 'secondary',
    order: 2
  },
  {
    id: '3',
    title: 'Social Media Marketing',
    slug: 'social-media-marketing',
    category: 'social-media-marketing',
    shortDescription: 'Strategic social media campaigns that drive engagement and growth',
    features: [
      'Content Strategy',
      'Community Management',
      'Paid Advertising',
      'Analytics & Reporting',
      'Influencer Marketing'
    ],
    ctaText: 'Get Started',
    ctaStyle: 'primary',
    order: 3
  }
];
```

---

### Testimonial

**Purpose**: Client testimonials displayed in Testimonials section

```typescript
// types/testimonial.ts
interface Testimonial {
  id: string;
  clientName: string;
  clientCompany: string;
  rating: number; // 1-5 stars
  quote: string;
  image?: string;
}
```

**Sample Data**:
```typescript
const testimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    clientCompany: 'Procope AI US',
    rating: 5,
    quote: 'Hashtag Tech delivered an exceptional AI-powered platform that exceeded our expectations. Their attention to detail and technical expertise made all the difference.',
    image: '/images/testimonials/sarah-johnson.jpg'
  },
  {
    id: '2',
    clientName: 'Michael Chen',
    clientCompany: 'Finaxe GB',
    rating: 5,
    quote: 'Outstanding work on our fintech application. The team was responsive, professional, and delivered on time. Highly recommend for any complex development project.',
    image: '/images/testimonials/michael-chen.jpg'
  }
];
```

---

### AIService

**Purpose**: AI service offerings displayed in AI Services section

```typescript
// types/ai-service.ts
interface AIService {
  id: string;
  title: string;
  slug: string;
  number: string; // "01", "02", "03"
  shortDescription: string;
  features: string[];
  order: number;
  isActive: boolean;
}
```

**Sample Data**:
```typescript
const aiServices: AIService[] = [
  {
    id: '1',
    title: 'AI Agents Development',
    slug: 'ai-agents-development',
    number: '01',
    shortDescription: 'Custom AI agents that automate tasks and enhance user experiences',
    features: [
      'Custom LLM Integration',
      'Autonomous Agents',
      'RAG Pipelines',
      'Multi-Modal AI',
      'Real-time Processing'
    ],
    order: 1,
    isActive: true
  },
  {
    id: '2',
    title: 'Machine Learning Solutions',
    slug: 'machine-learning-solutions',
    number: '02',
    shortDescription: 'End-to-end ML solutions from data pipeline to deployment',
    features: [
      'Predictive Analytics',
      'Natural Language Processing',
      'Computer Vision',
      'Recommendation Engines',
      'Model Optimization'
    ],
    order: 2,
    isActive: true
  },
  {
    id: '3',
    title: 'AI Consulting',
    slug: 'ai-consulting',
    number: '03',
    shortDescription: 'Strategic AI implementation guidance for your business',
    features: [
      'AI Strategy Development',
      'Technology Selection',
      'Proof of Concept',
      'Roadmap Planning',
      'Team Training'
    ],
    order: 3,
    isActive: true
  }
];
```

---

### Partner

**Purpose**: Partner organizations displayed in Partners section

```typescript
// types/partner.ts
interface Partner {
  id: string;
  name: string;
  logo: string;
  country: string; // Country code for flag display
  website?: string;
}
```

**Sample Data**:
```typescript
const partners: Partner[] = [
  {
    id: '1',
    name: 'Procope AI',
    logo: '/images/partners/procope-ai.png',
    country: 'US',
    website: 'https://procope.ai'
  },
  {
    id: '2',
    name: 'Finaxe',
    logo: '/images/partners/finaxe.png',
    country: 'GB',
    website: 'https://finaxe.co.uk'
  }
];
```

---

### ContactFormSubmission

**Purpose**: Contact form data structure for validation and submission

```typescript
// types/contact-form.ts
interface ContactFormSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: 'web-development' | 'mobile-app' | 'ai-agents' | 'marketing' | 'other';
  message: string;
}

// Zod validation schema
const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.enum(['web-development', 'mobile-app', 'ai-agents', 'marketing', 'other']),
  message: z.string().min(10, 'Message too short').max(5000, 'Message too long')
});
```

---

### ChatWidgetConfig

**Purpose**: Configuration props for reusable Chat Widget component

```typescript
// types/chat-widget.ts
interface ChatWidgetConfig {
  companyName: string;
  companyLogo: string;
  primaryColor: string;
  agentName: string;
  agentAvatar: string;
  welcomeMessage: string;
}

// Default configuration for Hashtag Tech
const defaultChatConfig: ChatWidgetConfig = {
  companyName: 'Hashtag Tech',
  companyLogo: '/logo-horizontal.jpeg',
  primaryColor: '#F26B6B',
  agentName: 'Sarah',
  agentAvatar: '/images/agents/sarah.jpg',
  welcomeMessage: 'Hi! How can I help you today?'
};
```

---

### Stats

**Purpose**: Company statistics displayed in Stats Bar section

```typescript
// types/stats.ts
interface Stat {
  id: string;
  label: string;
  value: number;
  suffix?: string; // e.g., "+", "%", "brands"
  icon?: string;
}
```

**Sample Data**:
```typescript
const stats: Stat[] = [
  {
    id: '1',
    label: 'Since',
    value: 2019,
    suffix: '',
    icon: 'check'
  },
  {
    id: '2',
    label: 'Global Brands',
    value: 40,
    suffix: '+',
    icon: 'check'
  },
  {
    id: '3',
    label: 'Industries',
    value: 25,
    suffix: '+',
    icon: 'check'
  },
  {
    id: '4',
    label: 'Rating',
    value: 96,
    suffix: '%',
    icon: 'star'
  }
];
```

---

## Phase 2: Sanity CMS Data Models

### BlogPost

**Purpose**: Blog articles managed via Sanity CMS

```typescript
// types/blog.ts
import { SanityImage } from './sanity';

interface BlogPost {
  _id: string;
  _type: 'post';
  title: string;
  slug: { _type: 'slug'; current: string };
  excerpt: string;
  mainImage: SanityImage;
  content: any[]; // Portable Text blocks
  author: AuthorReference;
  categories: CategoryReference[];
  publishedAt: string; // ISO 8601 datetime
  seoTitle?: string;
  seoDescription?: string;
  _createdAt: string;
  _updatedAt: string;
}

interface AuthorReference {
  _ref: string;
  _type: 'reference';
}

interface CategoryReference {
  _ref: string;
  _type: 'reference';
}
```

**Sanity Schema**:
```typescript
// sanity/schemaTypes/postType.ts
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required()
    },
    {
      name: 'mainImage',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }]
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'seoTitle',
      type: 'string'
    },
    {
      name: 'seoDescription',
      type: 'text'
    }
  ]
};
```

---

### Author

**Purpose**: Blog post authors

```typescript
// types/author.ts
interface Author {
  _id: string;
  _type: 'author';
  name: string;
  slug: { _type: 'slug'; current: string };
  image: SanityImage;
  bio: any[]; // Portable Text
}
```

**Sanity Schema**:
```typescript
// sanity/schemaTypes/authorType.ts
export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'name' }
    },
    {
      name: 'image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'bio',
      type: 'array',
      of: [{ type: 'block' }]
    }
  ]
};
```

---

### Category

**Purpose**: Blog post categories

```typescript
// types/category.ts
interface Category {
  _id: string;
  _type: 'category';
  name: string;
  slug: { _type: 'slug'; current: string };
}
```

**Sanity Schema**:
```typescript
// sanity/schemaTypes/categoryType.ts
export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'name' }
    }
  ]
};
```

---

### Career

**Purpose**: Job openings managed via Sanity CMS

```typescript
// types/career.ts
interface Career {
  _id: string;
  _type: 'career';
  title: string;
  slug: { _type: 'slug'; current: string };
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: any[]; // Portable Text
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  publishedAt: string;
  _createdAt: string;
  _updatedAt: string;
}
```

**Sanity Schema**:
```typescript
// sanity/schemaTypes/careerType.ts
export default {
  name: 'career',
  title: 'Job Opening',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'department',
      type: 'string',
      options: {
        list: ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations']
      }
    },
    {
      name: 'location',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      type: 'string',
      options: {
        list: ['Full-time', 'Part-time', 'Contract', 'Remote']
      }
    },
    {
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'requirements',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'benefits',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'isActive',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
};
```

---

### SanityService (Phase 2)

**Purpose**: Services migrated to Sanity for content management

```typescript
// types/sanity-service.ts
interface SanityService {
  _id: string;
  _type: 'service';
  title: string;
  slug: { _type: 'slug'; current: string };
  category: string;
  shortDescription: string;
  icon?: SanityImage;
  features: string[];
  content?: any[]; // Portable Text
  ctaText: string;
  ctaStyle: 'primary' | 'secondary';
  order: number;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
}
```

**Sanity Schema**:
```typescript
// sanity/schemaTypes/serviceType.ts
export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'category',
      type: 'string',
      options: {
        list: ['web-development', 'app-development', 'social-media-marketing', 'ai-services']
      }
    },
    {
      name: 'shortDescription',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'icon',
      type: 'image'
    },
    {
      name: 'features',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'ctaText',
      type: 'string'
    },
    {
      name: 'ctaStyle',
      type: 'string',
      options: { list: ['primary', 'secondary'] }
    },
    {
      name: 'order',
      type: 'number'
    },
    {
      name: 'isFeatured',
      type: 'boolean'
    },
    {
      name: 'seoTitle',
      type: 'string'
    },
    {
      name: 'seoDescription',
      type: 'text'
    }
  ]
};
```

---

### SanityAIService (Phase 2)

**Purpose**: AI services managed via Sanity

```typescript
// types/sanity-ai-service.ts
interface SanityAIService {
  _id: string;
  _type: 'aiService';
  title: string;
  slug: { _type: 'slug'; current: string };
  number: string; // "01", "02", "03"
  shortDescription: string;
  features: string[];
  content?: any[];
  order: number;
  isActive: boolean;
}
```

**Sanity Schema**:
```typescript
// sanity/schemaTypes/aiServiceType.ts
export default {
  name: 'aiService',
  title: 'AI Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'number',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'shortDescription',
      type: 'text'
    },
    {
      name: 'features',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'order',
      type: 'number'
    },
    {
      name: 'isActive',
      type: 'boolean',
      initialValue: true
    }
  ]
};
```

---

## Common Types

### SanityImage

```typescript
// types/sanity.ts
interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}
```

### PortableTextBlock

```typescript
// types/portable-text.ts
interface PortableTextBlock {
  _type: 'block';
  children: Array<{
    _type: 'span';
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _key: string;
    _type: 'link';
    href: string;
  }>;
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'blockquote';
  list?: 'bullet' | 'number';
}
```

---

## Data Migration Path (Phase 1 → Phase 2)

### Migration Strategy

1. **Export Phase 1 data** to JSON format
2. **Create Sanity import scripts** using Sanity CLI
3. **Import data** to Sanity CMS
4. **Update components** to fetch from API routes
5. **Remove hardcoded data** after verification

### API Route Updates

| Phase | Data Source | API Route |
|-------|-------------|-----------|
| 1 | Hardcoded constants | N/A (direct imports) |
| 2 | Sanity CMS | `/api/posts`, `/api/careers`, `/api/services` |

---

## References

- **Sanity Schema Docs**: https://www.sanity.io/docs/schema-types
- **Portable Text**: https://www.sanity.io/docs/presenting-block-text
- **GROQ Queries**: https://www.sanity.io/docs/groq

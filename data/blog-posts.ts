import type { BlogPost } from "@/types/blog";

/**
 * Sample blog posts data
 *
 * Hardcoded sample data for Phase 1.
 * In Phase 2, this will be replaced with Sanity CMS data.
 */
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable AI Agents with Modern Frameworks",
    slug: "building-scalable-ai-agents",
    excerpt:
      "Explore how we built production-ready AI agents using cutting-edge frameworks. Learn about architecture patterns, integration strategies, and best practices for deploying autonomous agents at scale.",
    mainImage: "/images/blog/ai-agents.jpg",
    content:
      "Artificial Intelligence agents are transforming how businesses automate complex workflows. In this comprehensive guide, we share our experience building production-ready AI agents that scale.\n\n## Understanding AI Agent Architecture\n\nAt its core, an AI agent is an autonomous system that can perceive its environment, reason about actions, and execute decisions. Modern frameworks like LangChain, AutoGPT, and custom implementations built on top of LLMs have made it easier than ever to build sophisticated agents.\n\n## Key Architecture Patterns\n\nWe've identified several patterns that consistently lead to robust agent implementations:\n\n1. **Memory Management**: Agents need to remember context across conversations. We use a combination of short-term memory (within a session) and long-term memory (persisted across sessions) using vector embeddings.\n\n2. **Tool Integration**: Effective agents need access to tools. Our architecture uses a standardized tool interface that allows agents to call APIs, query databases, and interact with external systems.\n\n3. **Planning and Execution**: Breaking down complex tasks into sub-tasks is crucial. We implement a planning layer that uses the LLM to create step-by-step plans before execution.\n\n## Implementation Best Practices\n\nBased on our experience deploying agents in production:\n\n- **Error Handling**: Always implement fallback behaviors when tools fail\n- **Rate Limiting**: Respect API limits and implement exponential backoff\n- **Monitoring**: Log all agent decisions and actions for debugging\n- **Testing**: Create comprehensive test suites for agent behaviors\n\n## Scaling Considerations\n\nAs your agent system grows, consider:\n\n- Horizontal scaling of agent instances\n- Distributed state management for multi-agent systems\n- Caching strategies for frequently accessed data\n- Queue-based task processing for async operations\n\n## Conclusion\n\nBuilding scalable AI agents requires careful architecture planning and attention to production concerns. The patterns and practices we've shared have helped us deploy robust systems that handle real-world workloads effectively.",
    publishedAt: "2024-01-15",
    author: {
      id: "1",
      name: "Alex Chen",
      slug: "alex-chen",
      image: "/images/authors/alex-chen.jpg",
      bio: "AI Architect and Lead Developer specializing in agent-based systems and LLM integration.",
    },
    categories: [
      { id: "1", name: "AI & Machine Learning", slug: "ai-ml" },
      { id: "2", name: "Development", slug: "development" },
    ],
    seoTitle: "Building Scalable AI Agents | Complete Guide with Modern Frameworks",
    seoDescription:
      "Learn how to build production-ready AI agents using modern frameworks. Covers architecture patterns, tool integration, memory management, and scaling best practices.",
  },
  {
    id: "2",
    title: "Modern Web Development: A Complete Guide to Next.js 14",
    slug: "modern-web-development-nextjs-14",
    excerpt:
      "Discover the latest features in Next.js 14 including Server Actions, partial prerendering, and improved performance. Build faster, more efficient web applications.",
    mainImage: "/images/blog/nextjs-14.jpg",
    content:
      "Next.js 14 represents a significant evolution in web development, introducing features that make building performant applications easier than ever.\n\n## What's New in Next.js 14\n\n### Server Actions\n\nServer Actions allow you to run server-side code directly from your components without creating API routes. This simplifies data mutations and reduces boilerplate.\n\n```typescript\n// Server Action example\n'use server'\n\nexport async function updateProfile(formData: FormData) {\n  const data = Object.fromEntries(formData)\n  await db.users.update({ where: { id }, data })\n}\n```\n\n### Partial Prerendering\n\nPartial Prerendering (PPR) combines static and dynamic rendering in a single page. Static shells render instantly while dynamic parts stream in as they become available.\n\n## Performance Improvements\n\n- **Turbopack**: The new Rust-based bundler provides 700x faster updates than Webpack\n- **Font Optimization**: Automatic font optimization with next/font\n- **Image Optimization**: Improved next/image with placeholder blur\n\n## Best Practices for Next.js 14\n\n1. **Leverage Server Components**: Use Server Components by default for better performance\n2. **Optimize Images**: Always use next/image for automatic optimization\n3. **Implement Caching**: Use the new fetch caching options strategically\n4. **Use App Router**: Migrate from Pages Router to take advantage of new features\n\n## Migration Tips\n\nIf you're upgrading from Next.js 13:\n\n- Review breaking changes in the migration guide\n- Update all API routes to use the new App Router patterns\n- Replace getStaticProps and getServerSideProps with direct data fetching\n\n## Conclusion\n\nNext.js 14 provides the tools needed to build world-class web applications. The combination of Server Components, Server Actions, and performance optimizations makes it an excellent choice for modern web development.",
    publishedAt: "2024-01-10",
    author: {
      id: "2",
      name: "Sarah Kim",
      slug: "sarah-kim",
      image: "/images/authors/sarah-kim.jpg",
      bio: "Full-stack developer and web performance expert. Loves React, Next.js, and building beautiful interfaces.",
    },
    categories: [
      { id: "3", name: "Web Development", slug: "web-development" },
      { id: "4", name: "JavaScript", slug: "javascript" },
    ],
    seoTitle: "Modern Web Development with Next.js 14 | Complete Guide",
    seoDescription:
      "Master Next.js 14 with our comprehensive guide. Learn about Server Actions, partial prerendering, Turbopack, and performance best practices.",
  },
  {
    id: "3",
    title: "Mobile App Development: React Native vs Flutter in 2024",
    slug: "mobile-app-development-react-native-vs-flutter",
    excerpt:
      "An in-depth comparison of React Native and Flutter for mobile development. We analyze performance, developer experience, ecosystem, and use cases for each framework.",
    mainImage: "/images/blog/mobile-frameworks.jpg",
    content:
      "Choosing the right mobile development framework is a critical decision that affects your project's success, timeline, and long-term maintainability.\n\n## Framework Overview\n\n### React Native\n\nReact Native, developed by Meta (Facebook), uses JavaScript and React to build native mobile apps. It translates React components to native views, providing near-native performance.\n\n**Pros:**\n- Large community and ecosystem\n- Code sharing with web React apps\n- Hot reloading for fast development\n- Familiar for web developers\n\n**Cons:**\n- Performance overhead for complex animations\n- Dependency on native modules for some features\n- Updating to new versions can be challenging\n\n### Flutter\n\nFlutter, created by Google, uses the Dart programming language and renders everything using its own engine (Skia). This provides consistent performance across platforms.\n\n**Pros:**\n- Excellent performance with compiled code\n- Beautiful, customizable widgets\n- Single codebase for mobile, web, and desktop\n- Strong tooling support\n\n**Cons:**\n- Smaller community compared to React Native\n- Different language (Dart) to learn\n- Larger app bundle size\n\n## Performance Comparison\n\nBased on our benchmarks:\n\n| Metric | React Native | Flutter |\n|--------|-------------|---------|\n| Startup Time | ~1.5s | ~1.2s |\n| Frame Rate | 58-60 FPS | 60 FPS |\n| App Size | ~15MB | ~20MB |\n| Memory Usage | ~120MB | ~100MB |\n\n## When to Choose Which\n\n**Choose React Native if:**\n- Your team already knows JavaScript/React\n- You need to share code with web applications\n- You want access to a vast npm ecosystem\n- Platform-specific native modules are important\n\n**Choose Flutter if:**\n- Performance is your top priority\n- You need consistent UI across all platforms\n- You're starting fresh without React dependencies\n- You want to target mobile, web, and desktop from one codebase\n\n## Our Recommendation\n\nFor most startups and teams transitioning from web development, React Native offers the smoothest path to mobile. Its JavaScript foundation and React patterns reduce learning curves significantly.\n\nHowever, for performance-critical applications or when targeting multiple platforms beyond mobile, Flutter's superior performance and cross-platform capabilities make it the better choice.\n\n## Conclusion\n\nBoth frameworks are excellent choices in 2024. The decision ultimately depends on your team's expertise, project requirements, and long-term goals. Consider building a small prototype with each before making your final decision.",
    publishedAt: "2024-01-05",
    author: {
      id: "1",
      name: "Alex Chen",
      slug: "alex-chen",
      image: "/images/authors/alex-chen.jpg",
      bio: "AI Architect and Lead Developer specializing in agent-based systems and LLM integration.",
    },
    categories: [
      { id: "5", name: "Mobile Development", slug: "mobile-development" },
      { id: "6", name: "Technology", slug: "technology" },
    ],
    seoTitle: "React Native vs Flutter 2024 | Mobile Development Comparison",
    seoDescription:
      "Compare React Native and Flutter for mobile development in 2024. Performance, ecosystem, developer experience, and when to choose each framework.",
  },
];

/**
 * Get all blog posts sorted by published date (newest first)
 */
export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get a blog post by its slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/**
 * Get related blog posts based on categories
 */
export function getRelatedBlogPosts(
  currentPostId: string,
  limit = 3
): BlogPost[] {
  const currentPost = blogPosts.find((p) => p.id === currentPostId);
  if (!currentPost) return [];

  const categoryIds = currentPost.categories.map((c) => c.id);

  return blogPosts
    .filter((p) => p.id !== currentPostId)
    .filter((p) => p.categories.some((c) => categoryIds.includes(c.id)))
    .slice(0, limit);
}

/**
 * Get blog posts by category
 */
export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {
  return blogPosts.filter((post) =>
    post.categories.some((c) => c.slug === categorySlug)
  );
}

import type { Career } from "@/types/career";

/**
 * Sample job postings data
 *
 * Hardcoded sample data for Phase 1.
 * In Phase 2, this will be replaced with Sanity CMS data.
 */
export const careers: Career[] = [
  {
    id: "1",
    title: "Senior Full-Stack Developer",
    slug: "senior-full-stack-developer",
    department: "Engineering",
    location: "Remote",
    type: "Remote",
    description: `
We are looking for a talented Senior Full-Stack Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications using modern technologies like Next.js, React, and Node.js.

## What You'll Do

- Design and implement scalable web applications
- Collaborate with cross-functional teams to define feature requirements
- Write clean, maintainable code following best practices
- Mentor junior developers and conduct code reviews
- Participate in architecture decisions and technical planning

## What We're Looking For

- 5+ years of professional full-stack development experience
- Strong proficiency in TypeScript, React, and Node.js
- Experience with Next.js and modern CSS frameworks (Tailwind CSS)
- Knowledge of RESTful APIs and database design
- Excellent problem-solving and communication skills

## Why Join Us

- Competitive salary and benefits package
- Flexible remote work environment
- Opportunities for professional growth
- Work on cutting-edge projects with AI integration
- Collaborative and supportive team culture
    `,
    requirements: [
      "5+ years of professional full-stack development experience",
      "Strong proficiency in TypeScript, React, and Node.js",
      "Experience with Next.js and Tailwind CSS",
      "Knowledge of RESTful APIs and database design (PostgreSQL, MongoDB)",
      "Familiarity with Git and CI/CD pipelines",
      "Excellent communication and collaboration skills",
      "Bachelor's degree in Computer Science or equivalent experience",
    ],
    benefits: [
      "Competitive salary ($80,000 - $120,000 based on experience)",
      "Health insurance and wellness benefits",
      "Flexible working hours and remote work",
      "Professional development budget",
      "Generous paid time off",
      "401(k) retirement plan",
    ],
    isActive: true,
    publishedAt: "2024-01-10T09:00:00Z",
    salary: {
      min: 80000,
      max: 120000,
      currency: "USD",
    },
  },
  {
    id: "2",
    title: "AI/ML Engineer",
    slug: "ai-ml-engineer",
    department: "Engineering",
    location: "Dubai, UAE (Remote Optional)",
    type: "Full-time",
    description: `
We're seeking an experienced AI/ML Engineer to help us build the next generation of AI-powered applications. You will work on integrating LLMs, building RAG pipelines, and developing autonomous agents.

## What You'll Do

- Design and implement AI/ML solutions for client projects
- Build and maintain RAG (Retrieval-Augmented Generation) pipelines
- Integrate with LLM APIs (OpenAI, Anthropic, etc.)
- Develop custom AI agents for automation tasks
- Optimize model performance and reduce costs

## What We're Looking For

- 3+ years of experience in AI/ML development
- Strong understanding of LLMs and prompt engineering
- Experience with vector databases (Qdrant, Pinecone, Weaviate)
- Proficiency in Python and TensorFlow/PyTorch
- Knowledge of NLP and computer vision techniques
- Familiarity with LangChain, LlamaIndex, or similar frameworks

## Why Join Us

- Work on cutting-edge AI projects
- Competitive compensation package
- Exposure to diverse industries and use cases
- Collaborate with a team of AI experts
- Opportunities to publish and speak at conferences
    `,
    requirements: [
      "3+ years of experience in AI/ML development",
      "Strong understanding of LLMs and prompt engineering",
      "Experience with vector databases (Qdrant, Pinecone, Weaviate)",
      "Proficiency in Python and TensorFlow/PyTorch",
      "Knowledge of NLP and computer vision techniques",
      "Familiarity with LangChain or LlamaIndex",
      "MS in Computer Science, AI, or related field preferred",
    ],
    benefits: [
      "Competitive salary ($90,000 - $140,000 based on experience)",
      "Health insurance and wellness benefits",
      "Flexible remote work options",
      "Conference and training budget",
      "Research time for personal AI projects",
      "Stock options",
    ],
    isActive: true,
    publishedAt: "2024-01-08T09:00:00Z",
    salary: {
      min: 90000,
      max: 140000,
      currency: "USD",
    },
  },
  {
    id: "3",
    title: "UI/UX Designer",
    slug: "ui-ux-designer",
    department: "Design",
    location: "New York, USA (Hybrid)",
    type: "Full-time",
    description: `
We are looking for a creative UI/UX Designer to create beautiful, user-centered designs for our web and mobile applications. You will work closely with developers and product managers to deliver exceptional user experiences.

## What You'll Do

- Create wireframes, prototypes, and high-fidelity designs
- Conduct user research and usability testing
- Develop and maintain design systems
- Collaborate with developers to ensure design implementation
- Present design concepts to stakeholders

## What We're Looking For

- 3+ years of UI/UX design experience
- Proficiency in Figma and Adobe Creative Suite
- Strong portfolio demonstrating design process
- Understanding of responsive design principles
- Experience with design systems and component libraries
- Excellent communication and presentation skills

## Why Join Us

- Creative freedom and ownership of projects
- Competitive salary and benefits
- Modern tools and equipment
- Collaborative design team
- Opportunities to grow into leadership roles
    `,
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma and Adobe Creative Suite",
      "Strong portfolio demonstrating design process",
      "Understanding of responsive design principles",
      "Experience with design systems and component libraries",
      "Knowledge of accessibility standards (WCAG)",
      "Bachelor's degree in Design or equivalent experience",
    ],
    benefits: [
      "Competitive salary ($70,000 - $100,000 based on experience)",
      "Health insurance and wellness benefits",
      "Hybrid work model",
      "Design tool subscriptions",
      "Professional development budget",
      "Creative workspace",
    ],
    isActive: true,
    publishedAt: "2024-01-05T09:00:00Z",
    salary: {
      min: 70000,
      max: 100000,
      currency: "USD",
    },
  },
  {
    id: "4",
    title: "DevOps Engineer",
    slug: "devops-engineer",
    department: "Engineering",
    location: "Remote",
    type: "Remote",
    description: `
We're seeking a skilled DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You will ensure our applications are highly available, secure, and performing optimally.

**Note: This position is currently on hold. We're not actively hiring but accepting applications for future consideration.**
    `,
    requirements: [
      "3+ years of DevOps experience",
      "Experience with AWS, GCP, or Azure",
      "Knowledge of Docker and Kubernetes",
      "Familiarity with CI/CD tools (GitHub Actions, GitLab CI)",
      "Understanding of infrastructure as code (Terraform, Pulumi)",
    ],
    benefits: [
      "Competitive salary",
      "Remote work",
      "Professional development opportunities",
    ],
    isActive: false, // Not actively hiring
    publishedAt: "2023-12-15T09:00:00Z",
  },
];

/**
 * Get all active career openings sorted by publication date (newest first)
 * T087 [US6] Filter job listings to show only `isActive: true` postings
 */
export function getActiveCareers(): Career[] {
  return careers
    .filter((career) => career.isActive)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

/**
 * Get career opening by slug
 */
export function getCareerBySlug(slug: string): Career | undefined {
  return careers.find((career) => career.slug === slug);
}

/**
 * Get all careers (including inactive)
 */
export function getAllCareers(): Career[] {
  return [...careers].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

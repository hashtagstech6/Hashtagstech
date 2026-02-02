/**
 * AI Service type for homepage AI Services section
 */

/**
 * AI Service interface
 *
 * Represents an AI service offering displayed in the homepage AI Services section.
 */
export interface AIService {
  /** Unique identifier */
  id: string;
  /** Service title */
  title: string;
  /** URL-friendly slug */
  slug: string;
  /** Numbered badge (01, 02, 03) */
  number: string;
  /** Short description */
  shortDescription: string;
  /** List of key features/capabilities */
  features: string[];
  /** Display order */
  order: number;
  /** Whether this service is currently active */
  isActive: boolean;
}

/**
 * Sample AI services data
 *
 * Three main AI service offerings for Hashtag Tech
 */
export const aiServices: AIService[] = [
  {
    id: "1",
    title: "AI Agents Development",
    slug: "ai-agents-development",
    number: "01",
    shortDescription:
      "Custom AI agents that automate tasks and enhance user experiences",
    features: [
      "Custom LLM Integration",
      "Autonomous Agents",
      "RAG Pipelines",
      "Multi-Modal AI",
      "Real-time Processing",
    ],
    order: 1,
    isActive: true,
  },
  {
    id: "2",
    title: "Machine Learning Solutions",
    slug: "machine-learning-solutions",
    number: "02",
    shortDescription: "End-to-end ML solutions from data pipeline to deployment",
    features: [
      "Predictive Analytics",
      "Natural Language Processing",
      "Computer Vision",
      "Recommendation Engines",
      "Model Optimization",
    ],
    order: 2,
    isActive: true,
  },
  {
    id: "3",
    title: "AI Consulting",
    slug: "ai-consulting",
    number: "03",
    shortDescription:
      "Strategic AI implementation guidance for your business",
    features: [
      "AI Strategy Development",
      "Technology Selection",
      "Proof of Concept",
      "Roadmap Planning",
      "Team Training",
    ],
    order: 3,
    isActive: true,
  },
];

export default AIService;

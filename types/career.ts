/**
 * Career/Job Opening Interface
 *
 * Used for job postings displayed on the website.
 * In Phase 1, uses hardcoded data. In Phase 2, migrates to Sanity CMS.
 */
export interface Career {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: string;
  requirements: string[];
  benefits: string[];
  isActive: boolean;
  publishedAt: string; // ISO 8601 datetime
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
}

/**
 * Career List Item Interface
 * Lightweight version for listing pages
 */
export interface CareerListItem {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  publishedAt: string;
}

/**
 * Blog Post Interface
 *
 * Used for blog posts displayed on the website.
 * In Phase 1, uses hardcoded data. In Phase 2, migrates to Sanity CMS.
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: string;
  content: string;
  author: Author;
  categories: Category[];
  publishedAt: string; // ISO 8601 datetime
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Author Interface
 */
export interface Author {
  id: string;
  name: string;
  slug: string;
  image: string;
  bio: string;
}

/**
 * Category Interface
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
}

/**
 * Blog Post List Item Interface
 * Lightweight version for listing pages
 */
export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: string;
  author: Author;
  categories: Category[];
  publishedAt: string;
}

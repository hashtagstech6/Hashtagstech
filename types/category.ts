/**
 * Category Interface
 *
 * Blog post category information
 */
export interface Category {
  id: string;
  name?: string; // Can be undefined from Sanity
  slug: string;
}

/**
 * Sanity Environment Configuration
 *
 * Environment variables for Sanity CMS connection.
 * These values are loaded from .env.local in production.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

/**
 * Validate that required environment variables are set
 */
export function validateSanityConfig(): { valid: boolean; error?: string } {
  if (!projectId) {
    return {
      valid: false,
      error: "NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Please add it to your .env.local file.",
    };
  }
  if (!dataset) {
    return {
      valid: false,
      error: "NEXT_PUBLIC_SANITY_DATASET is not set. Please add it to your .env.local file.",
    };
  }
  return { valid: true };
}

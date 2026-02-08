/**
 * Sanity Client Configuration
 *
 * Next.js Sanity client with proper configuration for ISR and caching.
 * Uses Stega for visual editing in development.
 * Following Next.js 15 caching best practices.
 */

import { createClient, SanityClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId, validateSanityConfig } from "../env";

// Lazy-loaded client instance
let _client: SanityClient | null = null;

/**
 * Get Sanity client (lazy-loaded)
 *
 * This function creates the client on first use rather than at module load,
 * which prevents build errors when Sanity is not configured.
 *
 * @returns Sanity client or null if not configured
 */
export function getClient(): SanityClient | null {
  const config = validateSanityConfig();
  if (!config.valid) {
    return null;
  }

  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === "production", // Enable CDN in production for better performance
      stega: {
        enabled: process.env.NODE_ENV === "development",
        studioUrl: "/studio",
        filter: (props) => {
          // Disable Stega for URLs to prevent hydration issues
          if (props.sourcePath.at(-1) === "url") return false;
          return props.filterDefault(props);
        },
      },
    });
  }

  return _client;
}

/**
 * Sanity Fetch Helper with Next.js Caching
 *
 * Centralized caching configuration supporting both time-based and tag-based revalidation.
 * This is the recommended pattern for Next.js 15 App Router with Sanity CMS.
 *
 * Features:
 * - Time-based revalidation (default) for automatic refresh
 * - Tag-based revalidation for on-demand updates via webhooks
 * - Automatic cache configuration for Next.js 15
 * - Type-safe query parameters
 *
 * @example Time-based revalidation (most common)
 * ```typescript
 * const posts = await sanityFetch({
 *   query: `*[_type == "post"]`,
 *   revalidate: 3600, // 1 hour
 * });
 * ```
 *
 * @example Tag-based revalidation (for immediate updates)
 * ```typescript
 * const post = await sanityFetch({
 *   query: `*[_type == "post" && slug.current == $slug]`,
 *   params: { slug },
 *   tags: ['posts', 'post'], // Revalidate when these tags are triggered
 * });
 * ```
 *
 * @param query - GROQ query string
 * @param params - Query parameters for GROQ
 * @param revalidate - Cache lifetime in seconds (false for tag-based only)
 * @param tags - Cache tags for on-demand revalidation
 * @returns Fetched data from Sanity
 */
export async function sanityFetch<constQueryString extends string>({
  query,
  params = {},
  revalidate = 3600, // Default: 1 hour for most content
  tags = [],
}: {
  query: constQueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}) {
  const client = getClient();
  if (!client) {
    throw new Error("Sanity client is not configured");
  }

  // Next.js 15 cache configuration:
  // When tags are provided, use tag-based caching (revalidate: false)
  // Otherwise, use time-based revalidation
  // Note: Don't specify cache option when using revalidate to avoid warnings
  const nextConfig: { revalidate?: number | false; tags?: string[] } = {
    tags,
  };
  if (tags.length) {
    nextConfig.revalidate = false;
  } else {
    nextConfig.revalidate = revalidate;
  }

  return client.fetch(query, params, {
    next: nextConfig,
  });
}

/**
 * Legacy client export for backward compatibility
 * WARNING: This may fail at build time if Sanity is not configured.
 * Prefer using getClient() or sanityFetch() for safer access.
 */
export const client = projectId ? createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  stega: {
    enabled: process.env.NODE_ENV === "development",
    studioUrl: "/studio",
    filter: (props) => {
      if (props.sourcePath.at(-1) === "url") return false;
      return props.filterDefault(props);
    },
  },
}) : null as unknown as SanityClient;

/**
 * Fetch content with GROQ query
 *
 * @deprecated Use sanityFetch() instead for proper Next.js 15 caching
 * @param query - GROQ query string
 * @param params - Query parameters
 * @returns Fetched data
 */
export async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  const sanityClient = getClient();
  if (!sanityClient) {
    throw new Error("Sanity client is not configured");
  }

  if (params && Object.keys(params).length > 0) {
    return sanityClient.fetch<T>(query, params);
  }
  return sanityClient.fetch<T>(query);
}

/**
 * Sanity Image URL Builder
 *
 * Utility for building optimized image URLs from Sanity image assets.
 * Uses @sanity/image-url for URL generation with transformations.
 */

import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

/**
 * Image URL builder for Sanity images
 *
 * Usage:
 * ```ts
 * urlFor(post.mainImage).width(800).height(450).url()
 * urlFor(post.mainImage).fit('crop').quality(80).url()
 * ```
 */
export const urlFor = (source: any) => {
  const builder = createImageUrlBuilder({ projectId, dataset });

  return builder.image(source);
};

/**
 * Get optimized image URL for Next.js Image component
 *
 * @param source - Sanity image object
 * @param width - Image width
 * @param height - Image height
 * @param quality - Image quality (default: 80)
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  source: any,
  width: number,
  height: number,
  quality = 80
): string {
  return urlFor(source).width(width).height(height).quality(quality).url();
}

/**
 * Get srcset for responsive images
 *
 * @param source - Sanity image object
 * @param sizes - Array of widths
 * @returns Srcset string
 */
export function getSrcset(source: any, sizes: number[]): string {
  return sizes
    .map(
      (size) => `${getOptimizedImageUrl(source, size, size * 0.75)} ${size}w`
    )
    .join(", ");
}

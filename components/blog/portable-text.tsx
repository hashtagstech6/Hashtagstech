"use client";

import { PortableText as SanityPortableText, type PortableTextReactComponents } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

/**
 * Portable Text Renderer Component
 *
 * Renders Sanity Portable Text content with custom styling for:
 * - Headings (h1-h4)
 * - Paragraphs
 * - Lists (bullet, numbered)
 * - Links
 * - Code blocks
 * - Inline images
 * - Blockquotes
 */

/**
 * Custom components for Portable Text rendering
 */
const components: Partial<PortableTextReactComponents> = {
  // Block types
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-12 mb-4 first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-10 mb-4 first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mt-8 mb-3 first:mt-0">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold mt-6 mb-3 first:mt-0">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-relaxed mb-4 last:mb-0">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 italic text-gray-600 bg-gray-50 rounded-r">
        {children}
      </blockquote>
    ),
  },

  // Marks (inline formatting)
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600">
        {children}
      </code>
    ),
    underline: ({ children }) => (
      <u className="underline">{children}</u>
    ),
    link: ({ value, children }) => (
      <Link
        href={value?.href || "#"}
        className="text-primary hover:underline underline-offset-2"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    ),
  },

  // Lists
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-6 space-y-2">{children}</ol>
    ),
  },

  // List items
  listItem: ({ children }) => <li className="text-gray-700">{children}</li>,

  // Images in Portable Text
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;

      const imageUrl = urlFor(value).width(800).auto("format").url();

      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={value?.alt || "Blog image"}
            width={800}
            height={450}
            className="rounded-lg shadow-md"
          />
          {value?.alt && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface PortableTextProps {
  value: any;
  className?: string;
}

/**
 * Portable Text Component
 *
 * Renders Sanity Portable Text content with custom styling.
 *
 * @example
 * ```tsx
 * <PortableText value={post.content} />
 * ```
 */
export default function PortableText({ value, className }: PortableTextProps) {
  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <SanityPortableText value={value} components={components} />
    </div>
  );
}

/**
 * Portable Text for Excerpts
 *
 * Simplified version for short excerpts without images.
 */
export function PortableTextExcerpt({ value, className }: PortableTextProps) {
  if (!value || value.length === 0) {
    return null;
  }

  // Filter out images for excerpts
  const textOnly = value.filter((block: any) => block._type === "block");

  return (
    <div className={className}>
      <SanityPortableText value={textOnly} components={components} />
    </div>
  );
}

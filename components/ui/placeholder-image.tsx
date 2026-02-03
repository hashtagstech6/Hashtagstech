import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Placeholder Image Component
 *
 * Generates a placeholder SVG image for missing assets.
 * Displays a visual placeholder with dimensions and optional label.
 *
 * @example
 * ```tsx
 * <PlaceholderImage width={400} height={300} label="Blog Post" />
 * ```
 */
interface PlaceholderImageProps {
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
  /** Optional label to display on the placeholder */
  label?: string;
  /** Optional CSS className */
  className?: string;
  /** Background color (default: gray-200) */
  backgroundColor?: string;
  /** Text color (default: gray-500) */
  textColor?: string;
}

/**
 * Generate a data URI SVG placeholder image
 */
function generatePlaceholderSvg(
  width: number,
  height: number,
  label?: string,
  backgroundColor = "#e5e7eb",
  textColor = "#6b7280"
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      ${label ? `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="${textColor}">${label}</text>` : ""}
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function PlaceholderImage({
  width,
  height,
  label,
  className,
  backgroundColor = "#e5e7eb",
  textColor = "#6b7280",
}: PlaceholderImageProps) {
  const src = generatePlaceholderSvg(width, height, label, backgroundColor, textColor);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        className
      )}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={src}
        alt={label || `Placeholder ${width}x${height}`}
        className="opacity-75"
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
      />
    </div>
  );
}

/**
 * Generate a placeholder image URL for use in img src attributes
 */
export function getPlaceholderUrl(
  width: number,
  height: number,
  label?: string,
  backgroundColor = "#e5e7eb",
  textColor = "#6b7280"
): string {
  return generatePlaceholderSvg(width, height, label, backgroundColor, textColor);
}

export default PlaceholderImage;

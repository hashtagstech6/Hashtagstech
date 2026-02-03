import { cn } from "@/lib/utils";

/**
 * Heading Component Props
 */
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

/**
 * Heading Component
 *
 * Renders semantic HTML headings with consistent styling.
 * Supports all heading levels (h1-h6) and accepts all standard HTML attributes.
 *
 * @example
 * ```tsx
 * <Heading level="h1">Page Title</Heading>
 * <Heading level="h2" className="text-xl">Section Title</Heading>
 * ```
 */
export function Heading({
  level,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = level;

  const baseStyles = {
    h1: "text-4xl md:text-5xl font-bold",
    h2: "text-3xl md:text-4xl font-bold",
    h3: "text-2xl md:text-3xl font-bold",
    h4: "text-xl md:text-2xl font-bold",
    h5: "text-lg md:text-xl font-bold",
    h6: "text-base md:text-lg font-bold",
  };

  return (
    <Tag
      className={cn(baseStyles[level], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * Default export
 */
export default Heading;

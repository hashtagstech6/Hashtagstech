/**
 * Testimonial Type Definition
 *
 * Represents a client testimonial with rating, quote, and client details.
 * Used in the Testimonials section to build social proof and credibility.
 *
 * @example
 * ```tsx
 * const testimonial: Testimonial = {
 *   id: '1',
 *   clientName: 'Sarah Johnson',
 *   clientCompany: 'Procope AI',
 *   clientTitle: 'CTO',
 *   rating: 5,
 *   quote: 'Hashtag Tech delivered exceptional results...',
 *   image: '/testimonials/sarah-johnson.jpg',
 *   project: 'AI Platform Development',
 *   date: '2024-01-15'
 * };
 * ```
 */

/**
 * Testimonial interface
 */
export interface Testimonial {
  /** Unique identifier */
  id: string;
  /** Client's full name */
  clientName: string;
  /** Client's company name */
  clientCompany: string;
  /** Client's job title (optional) */
  clientTitle?: string;
  /** Star rating (1-5) */
  rating: number;
  /** Client testimonial quote */
  quote: string;
  /** Client headshot image path */
  image: string;
  /** Project/service context (optional) */
  project?: string;
  /** When testimonial was given (ISO date string) */
  date: string;
}

/**
 * Testimonial card props for component usage
 */
export interface TestimonialCardProps {
  /** Testimonial data */
  testimonial: Testimonial;
  /** Whether to show full card or compact version */
  variant?: 'default' | 'compact';
  /** Additional CSS classes */
  className?: string;
}

export default Testimonial;

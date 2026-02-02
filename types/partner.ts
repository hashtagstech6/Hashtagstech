/**
 * Partner Type Definition
 *
 * Represents a partner company or client logo displayed in the Partners section.
 * Used to showcase existing relationships and build trust with potential clients.
 *
 * @example
 * ```tsx
 * const partner: Partner = {
 *   id: '1',
 *   name: 'Procope AI',
 *   logo: '/partners/procope-ai.svg',
 *   country: 'US',
 *   website: 'https://procope.ai'
 * };
 * ```
 */

/**
 * Country codes for partner locations
 */
export type CountryCode =
  | 'US' // United States
  | 'GB' // United Kingdom
  | 'CA' // Canada
  | 'AU' // Australia
  | 'DE' // Germany
  | 'FR' // France
  | 'JP' // Japan
  | 'SG' // Singapore
  | 'AE' // United Arab Emirates
  | 'PK'; // Pakistan (Hashtag Tech origin)

/**
 * Partner interface
 */
export interface Partner {
  /** Unique identifier */
  id: string;
  /** Partner company name */
  name: string;
  /** Partner logo image path (SVG preferred for crispness) */
  logo: string;
  /** Partner's country of origin */
  country: CountryCode;
  /** Partner website URL (optional) */
  website?: string;
  /** Whether this is a featured partner (optional) */
  featured?: boolean;
}

/**
 * Partner logo component props
 */
export interface PartnerLogoProps {
  /** Partner data */
  partner: Partner;
  /** Additional CSS classes */
  className?: string;
  /** Whether to link to partner website */
  linkToWebsite?: boolean;
}

export default Partner;

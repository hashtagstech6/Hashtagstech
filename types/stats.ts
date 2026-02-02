/**
 * Stats Type Definition
 *
 * Represents a single statistic displayed in the Stats Bar section.
 * Used to showcase company achievements and build credibility.
 *
 * @example
 * ```tsx
 * const stat: Stat = {
 *   id: '1',
 *   label: 'Projects Completed',
 *   value: 150,
 *   suffix: '+',
 *   icon: 'check-circle'
 * };
 * ```
 */

/**
 * Icon names for stats (using Lucide icon names)
 */
export type StatIconName =
  | 'check-circle' // Completed projects
  | 'users' // Team members
  | 'globe' // Countries served
  | 'star' // Client satisfaction
  | 'clock' // Years in business
  | 'code' // Lines of code
  | 'rocket' // Products launched
  | 'trophy' // Awards won
  | 'heart' // Happy clients
  | 'trending-up'; // Growth rate

/**
 * Stat interface
 */
export interface Stat {
  /** Unique identifier */
  id: string;
  /** Label describing the statistic */
  label: string;
  /** Numeric value to display (animated) */
  value: number;
  /** Suffix to display after value (e.g., '+', '%', 'M') */
  suffix?: string;
  /** Prefix to display before value (e.g., '$') */
  prefix?: string;
  /** Lucide icon name (optional) */
  icon?: StatIconName;
  /** Whether to animate the counter on scroll (default: true) */
  animate?: boolean;
  /** Number of decimal places for display (default: 0) */
  decimals?: number;
}

/**
 * Stat card component props
 */
export interface StatCardProps {
  /** Stat data */
  stat: Stat;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show icon */
  showIcon?: boolean;
  /** Animation duration in seconds (default: 2) */
  animationDuration?: number;
}

export default Stat;

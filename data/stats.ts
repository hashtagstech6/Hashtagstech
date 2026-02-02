/**
 * Stats Data
 *
 * Company statistics for the Stats Bar section.
 * These showcase achievements and build credibility.
 *
 * TODO: Phase 2 - Replace with Sanity CMS data
 */

import { Stat } from '@/types/stats';

/**
 * Sample stats data
 */
export const stats: Stat[] = [
  {
    id: '1',
    label: 'Projects Completed',
    value: 150,
    suffix: '+',
    icon: 'check-circle',
    animate: true,
    decimals: 0,
  },
  {
    id: '2',
    label: 'Happy Clients',
    value: 98,
    suffix: '%',
    icon: 'heart',
    animate: true,
    decimals: 0,
  },
  {
    id: '3',
    label: 'Team Members',
    value: 50,
    suffix: '+',
    icon: 'users',
    animate: true,
    decimals: 0,
  },
  {
    id: '4',
    label: 'Years Experience',
    value: 8,
    suffix: '+',
    icon: 'clock',
    animate: true,
    decimals: 0,
  },
];

export default stats;

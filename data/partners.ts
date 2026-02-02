/**
 * Partners Data
 *
 * Sample partner and client logos for the Partners section.
 * Using local placeholder.svg for logos.
 *
 * TODO: Phase 2 - Replace with Sanity CMS data
 */

import { Partner } from '@/types/partner';

/**
 * Sample partners data
 */
export const partners: Partner[] = [
  {
    id: '1',
    name: 'Procope AI',
    logo: '/placeholder.svg',
    country: 'US',
    website: 'https://procope.ai',
    featured: true,
  },
  {
    id: '2',
    name: 'Finaxe GB',
    logo: '/placeholder.svg',
    country: 'GB',
    website: 'https://finaxe.co.uk',
    featured: true,
  },
  {
    id: '3',
    name: 'CloudScale Solutions',
    logo: '/placeholder.svg',
    country: 'US',
    website: 'https://cloudscale.io',
  },
  {
    id: '4',
    name: 'TechVenture Inc',
    logo: '/placeholder.svg',
    country: 'CA',
    website: 'https://techventure.ca',
  },
  {
    id: '5',
    name: 'DataFlow Systems',
    logo: '/placeholder.svg',
    country: 'AU',
    website: 'https://dataflow.au',
  },
  {
    id: '6',
    name: 'InnovateTech GmbH',
    logo: '/placeholder.svg',
    country: 'DE',
    website: 'https://innovatetech.de',
  },
  {
    id: '7',
    name: 'SmartSoft Japan',
    logo: '/placeholder.svg',
    country: 'JP',
    website: 'https://smartsoft.jp',
  },
  {
    id: '8',
    name: 'Apex Solutions',
    logo: '/placeholder.svg',
    country: 'SG',
    website: 'https://apex.sg',
  },
];

export default partners;

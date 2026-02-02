/**
 * Testimonials Data
 *
 * Sample client testimonials for the Testimonials section.
 * Using local placeholder.svg for images.
 *
 * TODO: Phase 2 - Replace with Sanity CMS data
 */

import { Testimonial } from '@/types/testimonial';

/**
 * Sample testimonials data
 */
export const testimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Hussain Mousa',
    clientCompany: 'Finaxe.ae',
    clientTitle: 'MEA Director',
    rating: 5,
    quote: 'Devmate Solutions revamped our Finaxe website with improved design and functionality. They were highly professional, delivered on time, and exceeded expectations. Highly recommend!',
    image: '/placeholder.svg',
    project: 'Website Redesign',
    date: '2024-01-15',
  },
  {
    id: '2',
    clientName: 'Michael Chen',
    clientCompany: 'Procope AI',
    clientTitle: 'CTO',
    rating: 5,
    quote: 'Hashtag Tech delivered exceptional results on our AI platform. Their team\'s expertise in machine learning and web development helped us launch our product ahead of schedule.',
    image: '/placeholder.svg',
    project: 'AI Platform Development',
    date: '2024-02-20',
  },
  {
    id: '3',
    clientName: 'Emma Williams',
    clientCompany: 'CloudScale Solutions',
    clientTitle: 'CEO',
    rating: 5,
    quote: 'The team at Hashtag Tech understood our vision from day one. Their agile approach and technical excellence exceeded our expectations.',
    image: '/placeholder.svg',
    project: 'Cloud Platform',
    date: '2024-03-10',
  },
  {
    id: '4',
    clientName: 'David Rodriguez',
    clientCompany: 'TechVenture Inc',
    clientTitle: 'Product Lead',
    rating: 5,
    quote: 'Hashtag Tech\'s expertise in modern web technologies helped us transform our digital presence. Highly recommend their services.',
    image: '/placeholder.svg',
    project: 'Web Application',
    date: '2024-04-05',
  },
];

export default testimonials;

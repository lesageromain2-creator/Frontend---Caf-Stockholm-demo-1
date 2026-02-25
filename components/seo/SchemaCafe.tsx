/**
 * Schema.org JSON-LD — CafeOrCoffeeShop
 * Pour le référencement et les résultats enrichis (Google)
 */

import Head from 'next/head';
import { SITE } from '@/lib/site-config';

export default function SchemaCafe() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: SITE.name,
    description: SITE.description,
    url: SITE.baseUrl,
    telephone: SITE.phone.replace(/\s/g, ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: '10 rue Saint-Polycarpe',
      addressLocality: 'Lyon',
      postalCode: '69001',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 45.7676,
      longitude: 4.8343,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '10:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '18:00' },
    ],
    priceRange: '€€',
    aggregateRating: SITE.googleRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: SITE.googleRating,
          reviewCount: SITE.googleReviewsCount,
          bestRating: '5',
        }
      : undefined,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

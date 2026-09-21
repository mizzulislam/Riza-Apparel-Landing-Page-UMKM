import React from 'react';

/**
 * Schema.org Structured Data Component (FR-A3)
 * Menghasilkan JSON-LD untuk LocalBusiness, Product & Offer, serta FAQPage
 * agar terindeks sempurna di Google Search Console & Google Maps.
 */
export const SEOStructuredData: React.FC = () => {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Riza Apparel Ende',
    image: 'https://rizaapparel-2026.web.app/logos/logo-riza-apparel-dark.svg',
    '@id': 'https://rizaapparel-2026.web.app/#localbusiness',
    url: 'https://rizaapparel-2026.web.app/',
    telephone: '+6281246917740',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'JL. Gatot Subroto Gg. Sabar RT.022/RW.011, Mautapaga',
      addressLocality: 'Ende Timur',
      addressRegion: 'Nusa Tenggara Timur',
      postalCode: '86317',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -8.843675,
      longitude: 121.670762,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
    sameAs: [
      'https://maps.app.goo.gl/9qd4THZzMF9231wv7',
      'https://wa.me/6281246917740',
    ],
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Custom Jersey Sublimasi Ende Diamond Zawo',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
    description: 'Custom jersey dan sportswear sublimasi presisi bermotif tenun ikat Ende Diamond Zawo dan Flores Ocean Waves.',
    brand: {
      '@type': 'Brand',
      name: 'Riza Apparel',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'IDR',
      lowPrice: '90000',
      highPrice: '145000',
      offerCount: '6',
      availability: 'https://schema.org/InStock',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Berapa minimal jumlah pemesanan (minimal order) di Riza Apparel?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tidak ada minimum order! Anda bisa memesan Satuan (1 Pcs) maupun per tim.',
        },
      },
      {
        '@type': 'Question',
        name: 'Berapa lama estimasi waktu pengerjaan jersey custom?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Estimasi produksi presisi berkisar 3 hingga 5 hari kerja.',
        },
      },
      {
        '@type': 'Question',
        name: 'Bagaimana cara klaim Promo Beli 2 Bonus 1 Pcs & Gratis Ongkir NTT?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Promo Beli 2 Bonus 1 Pcs dan Gratis Ongkir area Ende & NTT otomatis berlaku untuk pemesanan kelipatan 2 pcs.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};

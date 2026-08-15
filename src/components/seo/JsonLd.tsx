import { getBaseUrl } from '@/utils/siteUrl';

export function JsonLd() {
  const baseUrl = getBaseUrl();

  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${baseUrl}/#localbusiness`,
        name: 'DsterGame Studio',
        alternateName: 'Dster Game Ungaran - Rental PS & Racing Simulator Lounge',
        description:
          'Pusat rental PlayStation 3, PS4, PS5, Nintendo Switch, dan Simulator Balap Logitech G29 di Ungaran & Salatiga. Fasilitas TV 4K, full AC, sofa empuk, dan layanan sewa konsol bawa pulang.',
        url: baseUrl,
        logo: `${baseUrl}/Logo/DsterGameLogo.png`,
        image: [
          `${baseUrl}/LandingPage.jpg`,
          `${baseUrl}/Logo/DsterGameLogo.png`,
          `${baseUrl}/Other/Event-Poster.jpg`,
        ],
        telephone: '+6281234567890',
        priceRange: 'Rp 6.000 - Rp 240.000',
        currenciesAccepted: 'IDR',
        paymentAccepted: 'Cash, QRIS, Transfer Bank',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '09:00',
            closes: '23:00',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Jl. Pemuda No. 12, Bandarjo',
          addressLocality: 'Ungaran Barat',
          addressRegion: 'Jawa Tengah',
          postalCode: '50511',
          addressCountry: 'ID',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -7.13386,
          longitude: 110.398851,
        },
        hasMap: 'https://maps.app.goo.gl/ygUFrbeKupStPAEm7',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          bestRating: '5',
          worstRating: '1',
          ratingCount: '128',
        },
        department: [
          {
            '@type': 'LocalBusiness',
            name: 'DsterGame Cabang 2 Ungaran',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Jl. Gedongsongo No. 17, Mijen, Candirejo',
              addressLocality: 'Ungaran Barat',
              addressRegion: 'Jawa Tengah',
              postalCode: '50513',
              addressCountry: 'ID',
            },
            telephone: '+6285172412206',
          },
          {
            '@type': 'LocalBusiness',
            name: 'DsterGame Cabang 3 Salatiga',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Pertokoan Pandawa Pujasera, Jl. Ahmad Yani No.9, Kalicacing',
              addressLocality: 'Sidomukti',
              addressRegion: 'Kota Salatiga',
              addressCountry: 'ID',
            },
            telephone: '+6285111392206',
          },
        ],
        sameAs: [
          'https://instagram.com/dster.game',
          'https://instagram.com/sewa_playstation_ungaran',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'DsterGame Studio',
        description: 'Rental PS & Racing Simulator Lounge Ungaran - Salatiga',
        publisher: {
          '@id': `${baseUrl}/#localbusiness`,
        },
        inLanguage: 'id-ID',
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/faq/#faqpage`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Konsol apa saja yang tersedia untuk rental di DsterGame?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'DsterGame menyediakan PlayStation 5 (PS5), PlayStation 4 Pro, PlayStation 4 Slim, PlayStation 3, Nintendo Switch OLED, dan Simulator Balap Mobil Logitech G29.',
            },
          },
          {
            '@type': 'Question',
            name: 'Apakah bisa sewa konsol PS5 / Nintendo Switch untuk dibawa pulang?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Bisa! Kami menyediakan paket sewa bawa pulang (Home Rental) 12 Jam dan 24 Jam dengan jaminan 2 identitas resmi (KTP/SIM/Kartu Pelajar/STNK).',
            },
          },
          {
            '@type': 'Question',
            name: 'Di mana saja lokasi cabang DsterGame Studio?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'DsterGame memiliki cabang di Bandarjo Ungaran Barat, Candirejo Ungaran Barat, dan Pujasera Kalicacing Kota Salatiga.',
            },
          },
          {
            '@type': 'Question',
            name: 'Berapa tarif rental main di tempat di DsterGame Ungaran?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tarif rental mulai dari Rp 6.000/jam untuk PS3, Rp 9.000/jam untuk PS4, Rp 14.000/jam untuk PS5 dan Nintendo Switch, serta Rp 25.000/jam untuk Simulator Balap Logitech G29.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

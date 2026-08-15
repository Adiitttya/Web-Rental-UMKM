import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/seo/JsonLd';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dstergame.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DsterGame Studio | Rental PS5, PS4, Nintendo Switch & Simulator Balap Ungaran',
    template: '%s | DsterGame Studio',
  },
  description:
    'Pusat rental PlayStation 3, PS4, PS5, Nintendo Switch, dan Simulator Balap Logitech G29 terbaik di Ungaran & Salatiga. Tempat nyaman ber-AC, TV 4K, sofa empuk, dan sewa bawa pulang.',
  keywords: [
    'Rental PS Ungaran',
    'Rental PS5 Ungaran',
    'Sewa PS5 Ungaran',
    'Rental PlayStation Ungaran',
    'Rental PS Salatiga',
    'Rental Nintendo Switch Ungaran',
    'Simulator Balap Ungaran',
    'Logitech G29 Rental Ungaran',
    'Game Lounge Ungaran',
    'Game Center Ungaran',
    'Rental PS Murah Ungaran',
    'Sewa PS Harian Ungaran',
    'DsterGame Ungaran',
    'DsterGame Studio',
  ],
  authors: [{ name: 'DsterGame Studio', url: siteUrl }],
  creator: 'DsterGame Studio',
  publisher: 'DsterGame Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DsterGame Studio | Rental PS5, PS4, Nintendo Switch & Simulator Balap Ungaran',
    description:
      'Pusat rental PlayStation 3, PS4, PS5, Nintendo Switch, dan Simulator Balap Logitech G29 di Ungaran & Salatiga. Fasilitas TV 4K, AC dingin, sofa empuk, dan turnamen gaming.',
    url: siteUrl,
    siteName: 'DsterGame Studio',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/Logo/DsterGameLogo.png',
        width: 1200,
        height: 630,
        alt: 'DsterGame Studio - Console & Racing Simulator Lounge Ungaran',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DsterGame Studio | Rental PS & Racing Simulator Lounge Ungaran',
    description:
      'Rental PS3, PS4, PS5, Nintendo Switch, dan Simulator Balap Logitech G29 terlengkap di Ungaran & Salatiga.',
    images: ['/Logo/DsterGameLogo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  verification: {
    google: 'q6iuYAPEgXrj_GoI0inIq5WM5IaV3C4c_mJpeB5xHrY',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="google-site-verification"
          content="q6iuYAPEgXrj_GoI0inIq5WM5IaV3C4c_mJpeB5xHrY"
        />
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}



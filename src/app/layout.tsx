import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'DsterGame Studio | Console & Racing Simulator Lounge Ungaran',
  description:
    'Pusat rental PS3, PS4, PS5, Nintendo Switch, dan Simulator Balap Logitech G29 di Ungaran. Tempat nyaman, ber-AC, TV 4K, dan koleksi game original terlengkap.',
  keywords: [
    'DsterGame',
    'Rental PS Ungaran',
    'Sewa PS5 Ungaran',
    'Racing Simulator Lounge',
    'Logitech G29',
    'Nintendo Switch Rental',
    'Rental Game Ungaran',
  ],
  authors: [{ name: 'DsterGame Studio' }],
  openGraph: {
    title: 'DsterGame Studio | Console & Racing Simulator Lounge Ungaran',
    description:
      'Pusat rental PS3, PS4, PS5, Nintendo Switch, dan Simulator Balap Logitech G29 di Ungaran.',
    url: 'https://dstergame.com',
    siteName: 'DsterGame Studio',
    locale: 'id_ID',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

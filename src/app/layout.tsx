import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CharacterProvider } from '@/contexts/CharacterContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Hermeln - 感じたことが、ことばになる',
  description: '感情駆動型音声日記言語学習アプリ',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hermeln'
  }
};

// ✅ viewport と themeColor を分離して書く
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ff6b35',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="format-detection" content="telephone=no" />
        {/* ✅ 新しい推奨タグ */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.variable}>
        <AuthProvider>
          <CharacterProvider>
            {children}
          </CharacterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
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
  themeColor: '#ff6b35',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hermeln'
  }
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

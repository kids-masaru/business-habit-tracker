import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '業務習慣化アプリ',
  description: '複数の副業を時間管理しながら習慣化するためのツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}

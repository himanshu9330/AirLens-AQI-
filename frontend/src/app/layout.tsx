import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'AirLens AQI | AI Pollution Intelligence',
  description: 'Real-time pollution insights, AI predictions, and smarter environmental monitoring.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="bg-slate-950 text-slate-50 font-sans antialiased selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}

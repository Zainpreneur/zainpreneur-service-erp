import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppShell } from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zainpreneur Service ERP',
  description: 'Service Catalogue → Service Request → Help Desk',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
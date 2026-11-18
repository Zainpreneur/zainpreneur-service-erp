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
      <head>
        <script type="text/tailwind-config" dangerouslySetInnerHTML={{ __html: "tailwind.config = { darkMode: 'class' };" }} />
        <script src="https://cdn.tailwindcss.com" />
      </head>
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
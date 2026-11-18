import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppShell } from '@/components/AppShell';
import { ERPProvider } from '@/lib/erpContext';

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
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.tailwindcss.com" />
      </head>
      <body className={inter.className}>
        <ERPProvider>
          <AppShell>{children}</AppShell>
        </ERPProvider>
      </body>
    </html>
  );
}
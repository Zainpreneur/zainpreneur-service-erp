'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, Layers, FileText, Ticket, Building2, Users,
  Menu, X, Sun, Moon, Monitor, Search, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Toaster } from 'sonner';

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/services', label: 'Services', icon: Package },
  { href: '/attributes', label: 'Attributes', icon: Layers },
  { href: '/requests', label: 'Requests', icon: FileText },
  { href: '/tickets', label: 'Help Desk', icon: Ticket },
  { href: '/businesses', label: 'Businesses', icon: Building2 },
  { href: '/people', label: 'People', icon: Users },
];

const bottomNav = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/requests', label: 'Requests', icon: FileText },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/services', label: 'Services', icon: Package },
  { href: '/businesses', label: 'More', icon: Building2 },
];

type Theme = 'light' | 'dark' | 'system';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  // load persisted preferences
  useEffect(() => {
    const t = (localStorage.getItem('theme') as Theme) || 'system';
    const c = localStorage.getItem('sidebar-collapsed') === 'true';
    setTheme(t);
    setCollapsed(c);
  }, []);

  // resolve theme
  useEffect(() => {
    const apply = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
      setResolvedTheme(resolved);
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    };
    apply();
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => apply();
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  const cycleTheme = () => {
    setTheme((t) => (t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system'));
  };

  const ThemeIcon = theme === 'system' ? Monitor : theme === 'light' ? Sun : Moon;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-400" />
                <span className="text-lg font-semibold">Zainpreneur</span>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close menu">
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-1 p-3">
              {nav.map((n) => {
                const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
                const Icon = n.icon;
                return (
                  <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}`}>
                    <Icon size={18} /> {n.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-400" />
            {!collapsed && <span className="text-lg font-semibold truncate">Zainpreneur</span>}
          </div>
          <button onClick={() => setCollapsed((c) => !c)} className="rounded-md p-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100" aria-label="Toggle sidebar">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
            const Icon = n.icon;
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'} ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? n.label : undefined}>
                <Icon size={18} />
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 dark:border-slate-800 p-3">
          <button onClick={cycleTheme} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 ${collapsed ? 'justify-center' : ''}`} title="Theme">
            <ThemeIcon size={18} />
            {!collapsed && <span className="capitalize">{theme}</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 backdrop-blur px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 hidden sm:block">Service Request Module</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100" aria-label="Search">
              <Search size={18} />
            </button>
            <button onClick={cycleTheme} className="rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 lg:hidden" aria-label="Theme">
              <ThemeIcon size={18} />
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-400" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur lg:hidden">
        {bottomNav.map((n) => {
          const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
          const Icon = n.icon;
          return (
            <Link key={n.href} href={n.href} className={`flex flex-1 flex-col items-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`} aria-label={n.label}>
              <Icon size={20} className="hover:text-indigo-500 dark:hover:text-indigo-300" />
              <span className="hidden sm:block">{n.label}</span>
            </Link>
          );
        })</nav>

      <Toaster theme={resolvedTheme} position="top-right" />
    </div>
  );
}

'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, Layers, FileText, Ticket, Building2, Users,
  Menu, X, Sun, Moon, Monitor, Search, ChevronLeft, ChevronRight, Tag,
  Banknote, SlidersHorizontal,
} from 'lucide-react';
import { Toaster } from 'sonner';
import { useERP } from '@/lib/erpContext';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Package, Layers, FileText, Ticket, Building2, Users,
  Tag, Banknote, SlidersHorizontal,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('sidebar-collapsed') === 'true' : false));
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => (typeof window !== 'undefined' ? (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system' : 'system'));
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const erp = useERP();

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
        {/* Toast */}
        {erp.toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#161618] border border-violet-500/40 text-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-5">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <p className="text-sm font-medium">{erp.toastMessage}</p>
            <button onClick={erp.dismissToast} className="text-zinc-400 hover:text-white ml-2">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <aside className="glass absolute inset-y-0 left-0 w-72 border-r border-slate-200/60 dark:border-slate-700/60 shadow-xl">
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
                {erp.visibleModules.map((n) => {
                  const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
                  const Icon = iconMap[n.iconName] || LayoutDashboard;
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
        <aside className={`hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 glass transition-all duration-200 ${collapsed ? 'w-20' : 'w-64'}`}>
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
            {erp.visibleModules.map((n) => {
              const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
              const Icon = iconMap[n.iconName] || LayoutDashboard;
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
            {!collapsed && (
              <div className="mt-3 p-2">
                <button
                  onClick={erp.resetToCategoryDefaults}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Reset modules"
                >
                  <SlidersHorizontal size={14} />
                  <span>Reset modules</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col min-w-0">
          <header className="glass flex h-16 items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 px-4 lg:px-6">
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
        <nav className="glass fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-slate-200/60 dark:border-slate-700/60 lg:hidden">
          {[
            { href: '/', label: 'Home', icon: LayoutDashboard },
            { href: '/requests', label: 'Requests', icon: FileText },
            { href: '/tickets', label: 'Tickets', icon: Ticket },
            { href: '/services', label: 'Services', icon: Package },
          ].map((n) => {
            const active = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
            const Icon = iconMap[n.iconName] || LayoutDashboard;
            return (
              <Link key={n.href} href={n.href} className={`flex flex-1 flex-col items-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`} aria-label={n.label}>
                <Icon size={20} className="hover:text-indigo-500 dark:hover:text-indigo-300" />
                <span className="hidden sm:block">{n.label}</span>
              </Link>
            );
          })}</nav>

        <Toaster theme={resolvedTheme} position="top-right" />
      </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Video,
  PawPrint,
  Users,
  X,
  Menu,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '@/providers/auth-provider';
import { LogoMark } from '@/components/ui/logo';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Videos', href: '/videos', icon: Video },
  { label: 'Animales', href: '/animals', icon: PawPrint },
  { label: 'Usuarios', href: '/users', icon: Users, adminOnly: true },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !('adminOnly' in item && item.adminOnly) || user?.role === 'ADMIN',
  );

  const renderContent = (variant: 'desktop' | 'mobile') => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-5">
        <LogoMark size={36} id={`kt-sidebar-${variant}`} className="drop-shadow" />
        <span className="text-lg font-extrabold text-gray-900">
          Kotosh<span className="text-green-600">Tech</span>
        </span>
        <button
          onClick={onClose}
          className="ml-auto rounded-md p-1 text-gray-400 hover:text-gray-600 lg:hidden"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'text-green-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`sidebar-active-${variant}`}
                  className="absolute inset-0 rounded-lg bg-green-50 ring-1 ring-green-100"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <item.icon className="relative h-5 w-5" />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-400">UNHEVAL · Centro de Producción Kotosh</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
        {renderContent('desktop')}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              className="fixed inset-0 bg-black/30"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              {renderContent('mobile')}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
      aria-label="Abrir menú"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { SidebarTrigger } from './sidebar';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { ROLE_LABELS } from '@/lib/auth';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/videos': 'Videos',
  '/videos/upload': 'Subir video',
  '/animals': 'Animales',
  '/animals/new': 'Registrar animal',
  '/users': 'Usuarios',
  '/profile': 'Mi cuenta',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/analysis/')) return 'Detalle de Analisis';
  if (pathname.startsWith('/animals/')) return 'Detalle de Animal';
  return 'KotoshTech';
}

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  ENCARGADO: 'bg-blue-100 text-blue-700',
  OPERARIO: 'bg-gray-100 text-gray-700',
};

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
      <SidebarTrigger onClick={onMenuClick} />
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        {user && (
          <>
            <Link
              href="/profile"
              className="hidden text-sm text-gray-600 hover:text-gray-900 sm:block"
              title="Mi cuenta"
            >
              {user.name}
            </Link>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleBadge[user.role] || 'bg-gray-100 text-gray-700'}`}
            >
              {ROLE_LABELS[user.role]}
            </span>
            <button
              onClick={logout}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Cerrar sesion"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

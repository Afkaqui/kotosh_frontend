'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from './sidebar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/videos': 'Videos',
  '/videos/upload': 'Subir Video',
  '/animals': 'Animales',
  '/animals/new': 'Registrar Animal',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/analysis/')) return 'Detalle de Analisis';
  if (pathname.startsWith('/animals/')) return 'Detalle de Animal';
  return 'KotoshTech';
}

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
      <SidebarTrigger onClick={onMenuClick} />
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
    </header>
  );
}

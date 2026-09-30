'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { LogoMark } from '@/components/ui/logo';

const ease = [0.22, 1, 0.36, 1] as const;

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [isLoading, user, router]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('expired')) {
      setError('Tu sesión expiró. Vuelve a iniciar sesión.');
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gray-950 lg:block">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
        >
          <Image src="/img/andes-hato.webp" alt="Ganado en un valle andino" fill preload sizes="50vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-gray-950/40" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <a href="https://sistema-kotosh.com" className="inline-flex w-fit items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> sistema-kotosh.com
          </a>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-green-300">Centro de Producción Kotosh · UNHEVAL</p>
            <h2 className="mt-3 max-w-md text-4xl font-extrabold leading-tight">
              Peso, estado y comportamiento de cada animal, en un solo lugar.
            </h2>
            <div className="mt-8 flex gap-3">
              {['Control de peso', 'Visión artificial', 'Acceso por roles'].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.12 }}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <span className="text-[10px] text-white/40">Imagen referencial</span>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

        <motion.div
          className="relative w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="mb-8 flex items-center gap-3">
            <motion.div
              initial={{ rotate: -12, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
            >
              <LogoMark size={52} id="kt-login" className="drop-shadow-lg" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Kotosh<span className="text-green-600">Tech</span>
              </h1>
              <p className="text-sm text-gray-500">Plataforma de gestión ganadera</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900">Iniciar sesión</h2>
          <p className="mt-1 text-sm text-gray-500">Ingresa con la cuenta que te asignó el administrador.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', x: [0, -6, 6, -4, 4, 0] }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm transition-shadow focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.15)] focus:outline-none"
                  placeholder="usuario@correo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm transition-shadow focus:border-green-500 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.15)] focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition-shadow hover:shadow-green-600/40 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </motion.button>
          </form>

          <p className="mt-10 text-center text-xs text-gray-400">UNHEVAL · Centro de Producción Kotosh</p>
        </motion.div>
      </div>
    </div>
  );
}

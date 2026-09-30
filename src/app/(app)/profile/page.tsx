'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/providers/auth-provider';
import { ROLE_LABELS } from '@/lib/auth';
import PageHeader from '@/components/ui/page-header';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none';

export default function ProfilePage() {
  const { user } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [localError, setLocalError] = useState('');

  const change = useMutation({
    mutationFn: async () =>
      (await api.patch('/auth/password', { currentPassword: current, newPassword: next })).data,
    onSuccess: () => {
      setCurrent('');
      setNext('');
      setConfirmPwd('');
    },
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError('');
    if (next !== confirmPwd) {
      setLocalError('Las contraseñas nuevas no coinciden');
      return;
    }
    change.mutate();
  }

  if (!user) return null;

  return (
    <div className="max-w-xl">
      <PageHeader title="Mi cuenta" description="Datos de acceso a la plataforma" />

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <dl className="grid grid-cols-3 gap-y-3 text-sm">
          <dt className="text-gray-500">Nombre</dt>
          <dd className="col-span-2 font-medium text-gray-900">{user.name}</dd>
          <dt className="text-gray-500">Correo</dt>
          <dd className="col-span-2 text-gray-900">{user.email}</dd>
          <dt className="text-gray-500">Rol</dt>
          <dd className="col-span-2 text-gray-900">{ROLE_LABELS[user.role]}</dd>
        </dl>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Cambiar contraseña</h2>
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Contraseña actual"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Nueva contraseña (mínimo 8 caracteres)"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Repite la nueva contraseña"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          className={inputClass}
        />
        {(localError || change.isError) && (
          <p className="text-sm text-red-600">{localError || change.error?.message}</p>
        )}
        {change.isSuccess && <p className="text-sm text-green-700">Contraseña actualizada.</p>}
        <button
          type="submit"
          disabled={change.isPending}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {change.isPending ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
}

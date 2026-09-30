'use client';

import { useState } from 'react';
import { UserPlus, Power } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import {
  useUsers,
  useRegisterUser,
  useUpdateUserRole,
  useToggleUserActive,
} from '@/hooks/use-auth-api';
import PageHeader from '@/components/ui/page-header';
import Skeleton from '@/components/ui/skeleton';
import { ROLE_LABELS } from '@/lib/auth';

const roles = ['ADMIN', 'ENCARGADO', 'OPERARIO'] as const;

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const registerMut = useRegisterUser();
  const roleMut = useUpdateUserRole();
  const toggleMut = useToggleUserActive();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'OPERARIO',
  });

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-500">
          Solo los administradores pueden gestionar usuarios.
        </p>
      </div>
    );
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    await registerMut.mutateAsync(form);
    setForm({ name: '', email: '', password: '', role: 'OPERARIO' });
    setShowForm(false);
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Usuarios"
        description="Cuentas del personal del centro de producción"
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <UserPlus className="h-4 w-4" />
            Nuevo usuario
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleRegister}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Registrar usuario
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
            <input
              required
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
            <input
              required
              type="password"
              placeholder="Contraseña inicial (mínimo 8 caracteres)"
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={registerMut.isPending}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {registerMut.isPending ? 'Registrando...' : 'Registrar'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
          {registerMut.isError && (
            <p className="mt-2 text-sm text-red-600">
              {(registerMut.error as Error).message}
            </p>
          )}
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users?.map((u) => (
              <tr key={u.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {u.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {u.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      roleMut.mutate({ id: u.id, role: e.target.value })
                    }
                    disabled={u.id === currentUser?.id}
                    className="rounded border border-gray-200 bg-transparent px-2 py-1 text-xs disabled:opacity-50"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {u.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  {u.id !== currentUser?.id && (
                    <button
                      onClick={() => toggleMut.mutate(u.id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      title={u.isActive ? 'Desactivar' : 'Activar'}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(roleMut.isError || toggleMut.isError) && (
        <p className="mt-2 text-sm text-red-600">{(roleMut.error ?? toggleMut.error)?.message}</p>
      )}
      <p className="mt-4 text-xs text-gray-500">
        Administrador: todo, incluida la gestión de usuarios. Encargado: registra, edita y elimina animales y videos.
        Operario: sube videos, lanza análisis, registra pesajes y asigna detecciones.
      </p>
    </div>
  );
}

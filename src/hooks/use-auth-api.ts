import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { User } from '@/lib/auth';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<User[]>('/auth/users');
      return data;
    },
  });
}

export function useRegisterUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      email: string;
      password: string;
      name: string;
      role: string;
    }) => {
      const { data } = await api.post('/auth/register', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { data } = await api.patch(`/auth/users/${id}/role`, { role });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useToggleUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/auth/users/${id}/toggle-active`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

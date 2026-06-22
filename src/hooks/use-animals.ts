'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Animal } from '@/lib/types';

export function useAnimals() {
  return useQuery<Animal[]>({
    queryKey: ['animals'],
    queryFn: async () => {
      const { data } = await api.get('/animals');
      return data;
    },
  });
}

export function useAnimal(id: string) {
  return useQuery<Animal>({
    queryKey: ['animals', id],
    queryFn: async () => {
      const { data } = await api.get(`/animals/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateAnimal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (animal: Omit<Animal, 'id'>) => {
      const { data } = await api.post('/animals', animal);
      return data as Animal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}

export function useUpdateAnimal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...animal }: Animal) => {
      const { data } = await api.put(`/animals/${id}`, animal);
      return data as Animal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}

export function useDeleteAnimal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/animals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}

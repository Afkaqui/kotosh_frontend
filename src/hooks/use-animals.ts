'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type {
  Animal,
  AnimalInput,
  AnimalStats,
  BehaviorHistoryEntry,
  WeightRecord,
} from '@/lib/types';

export function useAnimals() {
  return useQuery<Animal[]>({
    queryKey: ['animals'],
    queryFn: async () => {
      const { data } = await api.get('/animals', { params: { take: 100 } });
      return data.data;
    },
  });
}

export function useAnimal(id: string) {
  return useQuery<Animal>({
    queryKey: ['animals', id],
    queryFn: async () => (await api.get(`/animals/${id}`)).data,
    enabled: !!id,
  });
}

export function useAnimalStats() {
  return useQuery<AnimalStats>({
    queryKey: ['animals', 'stats'],
    queryFn: async () => (await api.get('/animals/stats')).data,
  });
}

export function useAnimalBehavior(id: string) {
  return useQuery<BehaviorHistoryEntry[]>({
    queryKey: ['animals', id, 'behavior'],
    queryFn: async () => (await api.get(`/animals/${id}/behavior`)).data,
    enabled: !!id,
  });
}

export function useCreateAnimal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (animal: AnimalInput) => (await api.post('/animals', animal)).data as Animal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['animals'] }),
  });
}

export function useUpdateAnimal(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (animal: Partial<AnimalInput>) =>
      (await api.patch(`/animals/${id}`, animal)).data as Animal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['animals'] }),
  });
}

export function useDeleteAnimal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/animals/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['animals'] }),
  });
}

export function useAddWeight(animalId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { weight: number; date?: string; notes?: string }) =>
      (await api.post(`/animals/${animalId}/weight`, body)).data as WeightRecord,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['animals'] }),
  });
}

export function useDeleteWeight(animalId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recordId: string) => {
      await api.delete(`/animals/${animalId}/weight/${recordId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['animals'] }),
  });
}

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Analysis } from '@/lib/types';

export function useAnalyses() {
  return useQuery<Analysis[]>({
    queryKey: ['analyses'],
    queryFn: async () => {
      const { data } = await api.get('/analyses', { params: { take: 100 } });
      return data.data;
    },
  });
}

export function useAnalysis(id: string) {
  return useQuery<Analysis>({
    queryKey: ['analyses', id],
    queryFn: async () => (await api.get(`/analyses/${id}`)).data,
    enabled: !!id,
    refetchInterval: (query) => (query.state.data?.status === 'PROCESSING' ? 3000 : false),
  });
}

export function useAssignDetection(analysisId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ detectionId, animalId }: { detectionId: string; animalId: string | null }) =>
      (await api.patch(`/detections/${detectionId}/animal`, { animalId })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses', analysisId] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}

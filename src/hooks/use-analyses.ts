'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Analysis } from '@/lib/types';

export function useAnalyses() {
  return useQuery<Analysis[]>({
    queryKey: ['analyses'],
    queryFn: async () => {
      const { data } = await api.get('/analyses');
      return data;
    },
  });
}

export function useAnalysis(id: string) {
  return useQuery<Analysis>({
    queryKey: ['analyses', id],
    queryFn: async () => {
      const { data } = await api.get(`/analyses/${id}`);
      return data;
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const analysis = query.state.data;
      if (analysis && analysis.status === 'PROCESSING') {
        return 3000;
      }
      return false;
    },
  });
}

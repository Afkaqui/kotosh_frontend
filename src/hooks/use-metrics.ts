'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { DashboardMetrics } from '@/lib/types';

export function useDashboardMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const { data } = await api.get('/metrics/dashboard');
      return data;
    },
    refetchInterval: 30000,
  });
}

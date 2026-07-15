import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/** Clears all React Query caches (e.g. on logout or account deletion). */
export function useClearAppQueryCache() {
  const client = useQueryClient();
  return useCallback(() => client.clear(), [client]);
}

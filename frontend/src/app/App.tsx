import { useEffect } from 'react';
import { AppProviders } from './providers';
import { AppRouter } from './router';
import { useAuthStore } from '@/features/auth/authStore';

export function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

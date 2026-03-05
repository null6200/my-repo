import { useEffect, useState } from 'react';
import AppRouter from './Router';

export default function ClientRouter() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
          <p className="mt-4 font-paragraph text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return <AppRouter />;
}

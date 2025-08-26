import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from '@/components/ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
export function RootLayout() {
  const { currentUser } = useAuthStore();
  const location = useLocation();
  if (!currentUser) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // When backend is down we don't want queries to keep retrying or
      // refetching on window focus/reconnect which can create loops.
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Outlet />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

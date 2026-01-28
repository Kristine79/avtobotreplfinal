import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

interface BrandingSettings {
  primaryColor: string;
  accentColor: string;
}

function BrandingProvider({ children }: { children: React.ReactNode }) {
  const { data: branding } = useQuery<BrandingSettings>({
    queryKey: ["/api/admin/branding"],
  });

  useEffect(() => {
    if (branding) {
      const root = document.documentElement;
      if (branding.primaryColor) {
        root.style.setProperty('--primary', branding.primaryColor);
      }
      if (branding.accentColor) {
        root.style.setProperty('--accent', branding.accentColor);
      }
    }
  }, [branding]);

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrandingProvider>
          <Router />
          <Toaster />
        </BrandingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense, useEffect, useState } from "react";
import NotFound from "@/pages/not-found";
import About from "@/pages/About";

// Lazy load the Home component to prevent audio resources from loading on the About page
const Home = lazy(() => import("@/pages/Home"));

function Router() {
  const [location] = useLocation();
  const [isHome, setIsHome] = useState(location === '/');
  
  // Update isHome when location changes
  useEffect(() => {
    setIsHome(location === '/');
  }, [location]);
  
  return (
    <Switch>
      <Route path="/">
        {isHome && (
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
            <Home />
          </Suspense>
        )}
      </Route>
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const showToaster = location === '/'; // Only show toaster on the home page
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full w-full">
        <Router />
        {showToaster && <Toaster />}
      </div>
    </QueryClientProvider>
  );
}

export default App;

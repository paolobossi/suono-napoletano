import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full w-full">
        <WouterRouter hook={useHashLocation}>
          <Router />
        </WouterRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;

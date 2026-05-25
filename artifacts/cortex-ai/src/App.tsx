import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/dashboard";
import Assistant from "./pages/assistant";
import Memory from "./pages/memory";
import Analytics from "./pages/analytics";
import Tasks from "./pages/tasks";
import Notes from "./pages/notes";
import System from "./pages/system";
import Commands from "./pages/commands";
import Insights from "./pages/insights";
import Notifications from "./pages/notifications";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/assistant" component={Assistant} />
      <Route path="/memory" component={Memory} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/notes" component={Notes} />
      <Route path="/system" component={System} />
      <Route path="/commands" component={Commands} />
      <Route path="/insights" component={Insights} />
      <Route path="/notifications" component={Notifications} />
      <Route>
        <div className="flex h-full items-center justify-center font-heading text-2xl text-destructive glow-destructive">
          404 - SECTOR NOT FOUND
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Layout>
          <Router />
        </Layout>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;

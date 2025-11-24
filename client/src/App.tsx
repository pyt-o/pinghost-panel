import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNodes from "./pages/admin/AdminNodes";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminServers from "./pages/admin/AdminServers";
import AdminTickets from "./pages/admin/AdminTickets";
import UserDashboard from "./pages/user/UserDashboard";
import UserServers from "./pages/user/UserServers";
import UserServerDetails from "./pages/user/UserServerDetails";
import UserTickets from "./pages/user/UserTickets";
import UserTicketDetails from "./pages/user/UserTicketDetails";
import UserCredits from "./pages/user/UserCredits";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      
      {/* Admin routes */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/users"} component={AdminUsers} />
      <Route path={"/admin/nodes"} component={AdminNodes} />
      <Route path={"/admin/packages"} component={AdminPackages} />
      <Route path={"/admin/servers"} component={AdminServers} />
      <Route path={"/admin/tickets"} component={AdminTickets} />
      
      {/* User routes */}
      <Route path={"/dashboard"} component={UserDashboard} />
      <Route path={"/servers"} component={UserServers} />
      <Route path={"/servers/:id"} component={UserServerDetails} />
      <Route path={"/tickets"} component={UserTickets} />
      <Route path={"/tickets/:id"} component={UserTicketDetails} />
      <Route path={"/credits"} component={UserCredits} />
      
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

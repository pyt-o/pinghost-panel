import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNodes from "./pages/admin/AdminNodes";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminServers from "./pages/admin/AdminServers";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminEggs from "./pages/admin/AdminEggs";
import AdminMarketplace from "./pages/admin/AdminMarketplace";
import AdminAdministrators from "./pages/admin/AdminAdministrators";
import UserDashboard from "./pages/user/UserDashboard";
import UserServers from "./pages/user/UserServers";
import UserServerDetails from "./pages/user/UserServerDetails";
import UserTickets from "./pages/user/UserTickets";
import UserTicketDetails from "./pages/user/UserTicketDetails";
import UserCredits from "./pages/user/UserCredits";
import UserMarketplace from "./pages/user/UserMarketplace";
import Settings from "./pages/Settings";
import Settings2FA from "./pages/Settings2FA";
import ServerConsole from "./pages/user/ServerConsole";
import ServerFiles from "./pages/user/ServerFiles";
import ServerBackups from "./pages/user/ServerBackups";
import ServerSettings from "./pages/user/ServerSettings";
import { ChatWidget } from "./components/ChatWidget";

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
      <Route path={"/admin/eggs"} component={AdminEggs} />
      <Route path={"/admin/marketplace"} component={AdminMarketplace} />
      <Route path={"/admin/administrators"} component={AdminAdministrators} />
      
      {/* User routes */}
      <Route path={"/dashboard"} component={UserDashboard} />
      <Route path={"/servers"} component={UserServers} />
      <Route path={"/servers/:id"} component={UserServerDetails} />
      <Route path={"/servers/:id/console"} component={ServerConsole} />
      <Route path={"/servers/:id/files"} component={ServerFiles} />
      <Route path={"/servers/:id/backups"} component={ServerBackups} />
      <Route path={"/servers/:id/settings"} component={ServerSettings} />
      <Route path={"/tickets"} component={UserTickets} />
      <Route path={"/tickets/:id"} component={UserTicketDetails} />
      <Route path={"/credits"} component={UserCredits} />
      <Route path={"/marketplace"} component={UserMarketplace} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/settings/2fa"} component={Settings2FA} />
      
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
            <ChatWidget />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;

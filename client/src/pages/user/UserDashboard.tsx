import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Server, Ticket, CreditCard, Activity, LayoutDashboard } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function UserDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: stats } = trpc.stats.userDashboard.useQuery();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/');
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading || !user) return null;

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Servers', href: '/servers', icon: Server },
    { label: 'Support Tickets', href: '/tickets', icon: Ticket },
    { label: 'Credits', href: '/credits', icon: CreditCard },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name || 'User'}!</h1>
          <p className="text-muted-foreground">Here's an overview of your account</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Servers</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stats?.totalServers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Running Servers</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stats?.runningServers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Credits Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stats?.credits || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Open Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stats?.openTickets || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <button
                onClick={() => setLocation('/servers')}
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left"
              >
                <Server className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="font-semibold text-card-foreground">Manage Servers</h3>
                <p className="text-sm text-muted-foreground">View and control your servers</p>
              </button>

              <button
                onClick={() => setLocation('/tickets')}
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left"
              >
                <Ticket className="w-8 h-8 text-orange-500 mb-2" />
                <h3 className="font-semibold text-card-foreground">Support Tickets</h3>
                <p className="text-sm text-muted-foreground">Get help from our team</p>
              </button>

              <button
                onClick={() => setLocation('/credits')}
                className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left"
              >
                <CreditCard className="w-8 h-8 text-green-500 mb-2" />
                <h3 className="font-semibold text-card-foreground">Buy Credits</h3>
                <p className="text-sm text-muted-foreground">Add credits to your account</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

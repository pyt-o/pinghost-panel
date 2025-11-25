import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, Server, HardDrive, AlertCircle, Activity, ShoppingCart, Package, Settings as SettingsIcon, DollarSign, Cpu } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
   const { data: stats, isLoading: statsLoading } = trpc.system.getStats.useQuery();
  const { data: advancedStats, isLoading: isAdvancedLoading } = trpc.system.getAdvancedStats.useQuery();
  const { data: logs } = trpc.logs.allActivity.useQuery({ limit: 10 });

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      setLocation('/');
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading || !user) return null;

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: Activity },
    { label: 'Użytkownicy', href: '/admin/users', icon: Users },
    { label: 'Administratorzy', href: '/admin/administrators', icon: SettingsIcon },
    { label: 'Nody', href: '/admin/nodes', icon: HardDrive },
    { label: 'Pakiety', href: '/admin/packages', icon: Package },
    { label: 'Szablony (Eggs)', href: '/admin/eggs', icon: Server },
    { label: 'Marketplace', href: '/admin/marketplace', icon: ShoppingCart },
    { label: 'Serwery', href: '/admin/servers', icon: Server },
    { label: 'Tickety', href: '/admin/tickets', icon: AlertCircle },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel Administracyjny</h1>
          <p className="text-muted-foreground">Przegląd systemu i statystyki</p>
        </div>

        {/* Advanced Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Całkowity Przychód</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isAdvancedLoading ? '...' : `${advancedStats?.totalRevenue || 0} PLN`}
              </div>
              <p className="text-xs text-muted-foreground">
                Całkowita suma płatności
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Średni Uptime Serwerów</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isAdvancedLoading ? '...' : `${advancedStats?.avgUptime.toFixed(2) || 0}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                Ostatnie 30 dni
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Zużycie Dysku</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isAdvancedLoading ? '...' : `${(advancedStats?.usedDisk / 1024).toFixed(2) || 0} GB`}
              </div>
              <p className="text-xs text-muted-foreground">
                Całkowicie zaalokowane
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Nowi Użytkownicy (7 dni)</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {isAdvancedLoading ? '...' : advancedStats?.newUsersLastWeek || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Całkowita liczba użytkowników
              </p>
            </CardContent>
          </Card>
        </div>


        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Razem Użytkowników</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {statsLoading ? '...' : stats?.totalUsers || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Razem Serwerów</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {statsLoading ? '...' : stats?.totalServers || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Aktywne Serwery</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {statsLoading ? '...' : stats?.activeServers || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Razem Nodów</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {statsLoading ? '...' : stats?.totalNodes || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Otwarte Tickety</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {statsLoading ? '...' : stats?.openTickets || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Ostatnia Aktywność</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm border-b border-border pb-3 last:border-0">
                    <Activity className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-card-foreground font-medium">{log.action}</p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
	              ) : (
	                <p className="text-muted-foreground text-center py-4">Brak ostatniej aktywności</p>
	              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

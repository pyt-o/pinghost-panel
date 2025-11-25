import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Ticket, CreditCard, LayoutDashboard, Terminal, HardDrive, Database, Settings as SettingsIcon, Archive } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function UserServerDetails() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const serverId = params.id;

  // Mock server data for demonstration
  const mockServer = {
    id: serverId,
    name: `Serwer #${serverId}`,
    status: 'running',
    ram: '8GB',
    disk: '100GB',
    cpu: '4 Cores',
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/');
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading || !user || !mockServer) return null;

  const navItems = [
    { label: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { label: t('nav.my_servers'), href: '/servers', icon: Server },
    { label: t('nav.support'), href: '/tickets', icon: Ticket },
    { label: t('nav.credits'), href: '/credits', icon: CreditCard },
  ];

  const serverNavItems = [
    { label: t('servers.console'), href: `/servers/${serverId}/console`, icon: Terminal },
    { label: t('servers.files'), href: `/servers/${serverId}/files`, icon: HardDrive },
    { label: t('servers.databases'), href: `/servers/${serverId}/databases`, icon: Database },
    { label: t('backups.title'), href: `/servers/${serverId}/backups`, icon: Archive },
    { label: t('servers.settings'), href: `/servers/${serverId}/settings`, icon: SettingsIcon },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t('servers.details')} - {mockServer.name}</h1>
        <div className="flex gap-4 border-b pb-4">
          {serverNavItems.map(item => (
            <Button 
              key={item.href} 
              variant="ghost" 
              onClick={() => setLocation(item.href)}
              className="flex items-center gap-2"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Informacje o Serwerze</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">Status:</span> <span className="capitalize">{mockServer.status}</span></div>
              <div><span className="font-medium">RAM:</span> {mockServer.ram}</div>
              <div><span className="font-medium">Dysk:</span> {mockServer.disk}</div>
              <div><span className="font-medium">CPU:</span> {mockServer.cpu}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}


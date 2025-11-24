import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Server, Ticket, CreditCard, LayoutDashboard, Play, Square, RotateCw, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function UserServers() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: servers, refetch } = trpc.servers.list.useQuery();
  const updateStatus = trpc.servers.updateStatus.useMutation();
  const deleteServer = trpc.servers.delete.useMutation();

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

  const handleAction = async (serverId: number, action: 'start' | 'stop' | 'restart') => {
    try {
      await updateStatus.mutateAsync({ id: serverId, action });
      toast.success(`Server ${action} initiated`);
      refetch();
    } catch (error) {
      toast.error(`Failed to ${action} server`);
    }
  };

  const handleDelete = async (serverId: number) => {
    if (!confirm('Are you sure you want to delete this server?')) return;
    try {
      await deleteServer.mutateAsync({ id: serverId });
      toast.success('Server deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete server');
    }
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Servers</h1>
            <p className="text-muted-foreground">Manage your game servers</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast.info('Create server feature coming soon')}>
            Create Server
          </Button>
        </div>

        <div className="grid gap-4">
          {servers && servers.length > 0 ? (
            servers.map((server) => (
              <Card key={server.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-card-foreground">{server.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{server.serverType}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm ${
                      server.status === 'running' ? 'bg-green-500/20 text-green-400' :
                      server.status === 'stopped' ? 'bg-gray-500/20 text-gray-400' :
                      server.status === 'error' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {server.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">RAM</p>
                        <p className="font-medium text-card-foreground">{server.allocatedRam} MB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Disk</p>
                        <p className="font-medium text-card-foreground">{server.allocatedDisk} MB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CPU</p>
                        <p className="font-medium text-card-foreground">{server.allocatedCpu}%</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleAction(server.id, 'start')} disabled={server.status === 'running'}>
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAction(server.id, 'stop')} disabled={server.status === 'stopped'}>
                        <Square className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAction(server.id, 'restart')}>
                        <RotateCw className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(server.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" onClick={() => setLocation(`/servers/${server.id}`)}>
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">You don't have any servers yet</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => toast.info('Create server feature coming soon')}>
                  Create Your First Server
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

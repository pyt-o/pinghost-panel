import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Users, HardDrive, Server, AlertCircle, Activity } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminServers() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: servers } = trpc.servers.list.useQuery();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      setLocation('/');
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading || !user) return null;

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: Activity },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Nodes', href: '/admin/nodes', icon: HardDrive },
    { label: 'Packages', href: '/admin/packages', icon: Server },
    { label: 'Servers', href: '/admin/servers', icon: Server },
    { label: 'Tickets', href: '/admin/tickets', icon: AlertCircle },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Server Management</h1>
          <p className="text-muted-foreground">View and manage all servers</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Servers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-card-foreground">ID</TableHead>
                  <TableHead className="text-card-foreground">Name</TableHead>
                  <TableHead className="text-card-foreground">Type</TableHead>
                  <TableHead className="text-card-foreground">User ID</TableHead>
                  <TableHead className="text-card-foreground">Status</TableHead>
                  <TableHead className="text-card-foreground">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servers && servers.length > 0 ? (
                  servers.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell className="text-card-foreground">{server.id}</TableCell>
                      <TableCell className="text-card-foreground font-medium">{server.name}</TableCell>
                      <TableCell className="text-card-foreground">{server.serverType}</TableCell>
                      <TableCell className="text-card-foreground">{server.userId}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          server.status === 'running' ? 'bg-green-500/20 text-green-400' :
                          server.status === 'stopped' ? 'bg-gray-500/20 text-gray-400' :
                          server.status === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {server.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {new Date(server.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No servers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

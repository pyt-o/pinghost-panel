import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Users, HardDrive, Server, AlertCircle, Activity } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminPackages() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: packages } = trpc.packages.listAll.useQuery();

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
          <h1 className="text-3xl font-bold text-foreground">Package Management</h1>
          <p className="text-muted-foreground">Manage hosting packages and pricing</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-card-foreground">Name</TableHead>
                  <TableHead className="text-card-foreground">RAM</TableHead>
                  <TableHead className="text-card-foreground">Disk</TableHead>
                  <TableHead className="text-card-foreground">CPU</TableHead>
                  <TableHead className="text-card-foreground">Price/Month</TableHead>
                  <TableHead className="text-card-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages && packages.length > 0 ? (
                  packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="text-card-foreground font-medium">{pkg.name}</TableCell>
                      <TableCell className="text-card-foreground">{pkg.ram} MB</TableCell>
                      <TableCell className="text-card-foreground">{pkg.disk} MB</TableCell>
                      <TableCell className="text-card-foreground">{pkg.cpu}%</TableCell>
                      <TableCell className="text-card-foreground">{pkg.pricePerMonth} credits</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          pkg.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No packages found
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

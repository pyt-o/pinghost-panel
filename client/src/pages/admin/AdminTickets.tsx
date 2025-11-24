import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Users, HardDrive, Server, AlertCircle, Activity } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminTickets() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: tickets } = trpc.tickets.list.useQuery();

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
          <h1 className="text-3xl font-bold text-foreground">Ticket Management</h1>
          <p className="text-muted-foreground">View and respond to support tickets</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-card-foreground">ID</TableHead>
                  <TableHead className="text-card-foreground">Subject</TableHead>
                  <TableHead className="text-card-foreground">User ID</TableHead>
                  <TableHead className="text-card-foreground">Priority</TableHead>
                  <TableHead className="text-card-foreground">Status</TableHead>
                  <TableHead className="text-card-foreground">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets && tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="text-card-foreground">{ticket.id}</TableCell>
                      <TableCell className="text-card-foreground font-medium">{ticket.subject}</TableCell>
                      <TableCell className="text-card-foreground">{ticket.userId}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                          ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ticket.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          ticket.status === 'open' ? 'bg-green-500/20 text-green-400' :
                          ticket.status === 'closed' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ticket.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No tickets found
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

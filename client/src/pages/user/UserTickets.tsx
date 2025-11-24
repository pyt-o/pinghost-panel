import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Server, Ticket, CreditCard, LayoutDashboard, Plus } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function UserTickets() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: tickets } = trpc.tickets.list.useQuery();

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
            <p className="text-muted-foreground">Get help from our support team</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast.info('Create ticket feature coming soon')}>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">My Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-card-foreground">ID</TableHead>
                  <TableHead className="text-card-foreground">Subject</TableHead>
                  <TableHead className="text-card-foreground">Priority</TableHead>
                  <TableHead className="text-card-foreground">Status</TableHead>
                  <TableHead className="text-card-foreground">Created</TableHead>
                  <TableHead className="text-card-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets && tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="text-card-foreground">{ticket.id}</TableCell>
                      <TableCell className="text-card-foreground font-medium">{ticket.subject}</TableCell>
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
                      <TableCell>
                        <Button size="sm" onClick={() => setLocation(`/tickets/${ticket.id}`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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

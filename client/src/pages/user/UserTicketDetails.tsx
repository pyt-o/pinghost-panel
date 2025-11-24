import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Ticket, CreditCard, LayoutDashboard } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function UserTicketDetails() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

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
        <h1 className="text-3xl font-bold text-foreground">Ticket Details</h1>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Ticket Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Ticket details coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

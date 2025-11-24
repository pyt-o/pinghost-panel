import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Server, Ticket, CreditCard, LayoutDashboard, Plus, Check } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function UserCredits() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: credits } = trpc.users.myCredits.useQuery();
  const { data: history } = trpc.users.myCreditHistory.useQuery();
  const { data: packages } = trpc.payment.packages.useQuery();
  const createCheckout = trpc.payment.createCheckout.useMutation();

  const handleBuyCredits = async (packageId: string) => {
    try {
      const result = await createCheckout.mutateAsync({ packageId });
      if (result.url) {
        window.open(result.url, '_blank');
        toast.info('Redirecting to checkout...');
      }
    } catch (error) {
      toast.error('Failed to create checkout session');
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">Credits & Billing</h1>
          <p className="text-muted-foreground">Manage your account balance</p>
        </div>

        <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-card-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-card-foreground">{credits?.credits || 0}</p>
                <p className="text-muted-foreground">Available Credits</p>
              </div>
              <div className="text-sm text-muted-foreground">Purchase credits to use hosting services</div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Packages */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Buy Credits</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {packages && packages.map((pkg) => (
              <Card key={pkg.id} className={`bg-card border-border ${'popular' in pkg && pkg.popular ? 'border-blue-500' : ''}`}>
                <CardHeader>
                  {'popular' in pkg && pkg.popular && (
                    <div className="text-xs text-blue-400 font-semibold mb-2">MOST POPULAR</div>
                  )}
                  <CardTitle className="text-card-foreground">{pkg.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-card-foreground">${pkg.price}</p>
                    <p className="text-sm text-muted-foreground">{pkg.credits} credits</p>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    onClick={() => handleBuyCredits(pkg.id)}
                    disabled={createCheckout.isPending}
                  >
                    {createCheckout.isPending ? 'Processing...' : 'Buy Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-card-foreground">Date</TableHead>
                  <TableHead className="text-card-foreground">Type</TableHead>
                  <TableHead className="text-card-foreground">Description</TableHead>
                  <TableHead className="text-card-foreground">Amount</TableHead>
                  <TableHead className="text-card-foreground">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history && history.length > 0 ? (
                  history.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-card-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          transaction.type === 'purchase' ? 'bg-green-500/20 text-green-400' :
                          transaction.type === 'usage' ? 'bg-red-500/20 text-red-400' :
                          transaction.type === 'refund' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-card-foreground">{transaction.description}</TableCell>
                      <TableCell className={transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {transaction.amount >= 0 ? '+' : ''}{transaction.amount}
                      </TableCell>
                      <TableCell className="text-card-foreground">{transaction.balanceAfter}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No transactions yet
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

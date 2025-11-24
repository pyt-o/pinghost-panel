import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Users, HardDrive, Server, AlertCircle, Activity, Shield, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminUsers() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: users, refetch } = trpc.users.list.useQuery();
  const updateCredits = trpc.users.updateCredits.useMutation();
  const updateRole = trpc.users.updateRole.useMutation();
  
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newCredits, setNewCredits] = useState<number>(0);

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

  const handleUpdateCredits = async (userId: number) => {
    try {
      await updateCredits.mutateAsync({ userId, credits: newCredits });
      toast.success('Credits updated successfully');
      setEditingUserId(null);
      refetch();
    } catch (error) {
      toast.error('Failed to update credits');
    }
  };

  const handleUpdateRole = async (userId: number, role: 'user' | 'admin') => {
    try {
      await updateRole.mutateAsync({ userId, role });
      toast.success('Role updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage all users and their permissions</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-card-foreground">ID</TableHead>
                  <TableHead className="text-card-foreground">Name</TableHead>
                  <TableHead className="text-card-foreground">Email</TableHead>
                  <TableHead className="text-card-foreground">Role</TableHead>
                  <TableHead className="text-card-foreground">Credits</TableHead>
                  <TableHead className="text-card-foreground">Joined</TableHead>
                  <TableHead className="text-card-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="text-card-foreground">{u.id}</TableCell>
                      <TableCell className="text-card-foreground">{u.name || 'N/A'}</TableCell>
                      <TableCell className="text-card-foreground">{u.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Select
                          value={u.role}
                          onValueChange={(value) => handleUpdateRole(u.id, value as 'user' | 'admin')}
                        >
                          <SelectTrigger className="w-32 bg-background text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {editingUserId === u.id ? (
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              value={newCredits}
                              onChange={(e) => setNewCredits(Number(e.target.value))}
                              className="w-24 bg-background text-foreground"
                            />
                            <Button size="sm" onClick={() => handleUpdateCredits(u.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingUserId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingUserId(u.id);
                              setNewCredits(u.credits);
                            }}
                          >
                            {u.credits} credits
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => setLocation(`/admin/users/${u.id}`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No users found
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

import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Users, HardDrive, Server, AlertCircle, Activity, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminNodes() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: nodes, refetch } = trpc.nodes.list.useQuery();
  const createNode = trpc.nodes.create.useMutation();
  const updateNode = trpc.nodes.update.useMutation();
  const deleteNode = trpc.nodes.delete.useMutation();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    ipAddress: '',
    port: 2022,
    totalRam: 8192,
    totalDisk: 102400,
    totalCpu: 400,
    isPublic: true,
  });

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

  const handleCreateNode = async () => {
    try {
      await createNode.mutateAsync(formData);
      toast.success('Node created successfully');
      setIsDialogOpen(false);
      refetch();
      setFormData({
        name: '',
        location: '',
        ipAddress: '',
        port: 2022,
        totalRam: 8192,
        totalDisk: 102400,
        totalCpu: 400,
        isPublic: true,
      });
    } catch (error) {
      toast.error('Failed to create node');
    }
  };

  const handleDeleteNode = async (id: number) => {
    if (!confirm('Are you sure you want to delete this node?')) return;
    try {
      await deleteNode.mutateAsync({ id });
      toast.success('Node deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete node');
    }
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Node Management</h1>
            <p className="text-muted-foreground">Manage physical servers and resources</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Node
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-popover text-popover-foreground">
              <DialogHeader>
                <DialogTitle className="text-popover-foreground">Create New Node</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-popover-foreground">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-popover-foreground">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="ipAddress" className="text-popover-foreground">IP Address</Label>
                  <Input
                    id="ipAddress"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="bg-background text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalRam" className="text-popover-foreground">RAM (MB)</Label>
                    <Input
                      id="totalRam"
                      type="number"
                      value={formData.totalRam}
                      onChange={(e) => setFormData({ ...formData, totalRam: Number(e.target.value) })}
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalDisk" className="text-popover-foreground">Disk (MB)</Label>
                    <Input
                      id="totalDisk"
                      type="number"
                      value={formData.totalDisk}
                      onChange={(e) => setFormData({ ...formData, totalDisk: Number(e.target.value) })}
                      className="bg-background text-foreground"
                    />
                  </div>
                </div>
                <Button onClick={handleCreateNode} className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Node
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-card-foreground">Name</TableHead>
                  <TableHead className="text-card-foreground">Location</TableHead>
                  <TableHead className="text-card-foreground">IP Address</TableHead>
                  <TableHead className="text-card-foreground">RAM Usage</TableHead>
                  <TableHead className="text-card-foreground">Disk Usage</TableHead>
                  <TableHead className="text-card-foreground">Status</TableHead>
                  <TableHead className="text-card-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodes && nodes.length > 0 ? (
                  nodes.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell className="text-card-foreground font-medium">{node.name}</TableCell>
                      <TableCell className="text-card-foreground">{node.location}</TableCell>
                      <TableCell className="text-card-foreground">{node.ipAddress}</TableCell>
                      <TableCell className="text-card-foreground">
                        {node.usedRam} / {node.totalRam} MB
                      </TableCell>
                      <TableCell className="text-card-foreground">
                        {node.usedDisk} / {node.totalDisk} MB
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          node.status === 'online' ? 'bg-green-500/20 text-green-400' :
                          node.status === 'offline' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {node.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteNode(node.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No nodes found
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

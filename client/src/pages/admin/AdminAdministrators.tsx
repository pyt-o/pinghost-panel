import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, UserMinus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/LanguageContext";

export default function AdminAdministrators() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [isDemoteDialogOpen, setIsDemoteDialogOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => trpc.users.list.query(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: { userId: number; role: "user" | "admin" }) =>
      trpc.users.updateRole.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setIsPromoteDialogOpen(false);
      setIsDemoteDialogOpen(false);
      toast.success(t("admin.administrators.roleUpdated"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("admin.administrators.roleUpdateError"));
    },
  });

  const handlePromote = () => {
    if (!selectedUser) return;
    updateRoleMutation.mutate({ userId: selectedUser.id, role: "admin" });
  };

  const handleDemote = () => {
    if (!selectedUser) return;
    updateRoleMutation.mutate({ userId: selectedUser.id, role: "user" });
  };

  const admins = users?.filter((u: any) => u.role === "admin") || [];
  const regularUsers = users?.filter((u: any) => u.role === "user") || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            {t("admin.administrators.title")}
          </h1>
          <p className="text-muted-foreground">{t("admin.administrators.description")}</p>
        </div>
      </div>

      {/* Current Administrators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t("admin.administrators.current")}
          </CardTitle>
          <CardDescription>{t("admin.administrators.currentDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("common.loading")}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("users.name")}</TableHead>
                  <TableHead>{t("users.email")}</TableHead>
                  <TableHead>{t("users.role")}</TableHead>
                  <TableHead>{t("users.joined")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary">
                        <Shield className="h-3 w-3 mr-1" />
                        {t("users.admin")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDemoteDialogOpen(true);
                        }}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        {t("admin.administrators.demote")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Regular Users */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.administrators.regularUsers")}</CardTitle>
          <CardDescription>{t("admin.administrators.regularUsersDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("common.loading")}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("users.name")}</TableHead>
                  <TableHead>{t("users.email")}</TableHead>
                  <TableHead>{t("users.role")}</TableHead>
                  <TableHead>{t("users.credits")}</TableHead>
                  <TableHead>{t("users.joined")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regularUsers.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t("users.user")}</Badge>
                    </TableCell>
                    <TableCell>{user.credits}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsPromoteDialogOpen(true);
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t("admin.administrators.promote")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Promote Dialog */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.administrators.promoteTitle")}</DialogTitle>
            <DialogDescription>{t("admin.administrators.promoteDescription")}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedUser.name || "N/A"}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email || "N/A"}</p>
              </div>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-700 dark:text-yellow-400">
                      {t("admin.administrators.promoteWarning")}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {t("admin.administrators.promoteWarningDetails")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handlePromote} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? t("common.saving") : t("admin.administrators.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Demote Dialog */}
      <Dialog open={isDemoteDialogOpen} onOpenChange={setIsDemoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.administrators.demoteTitle")}</DialogTitle>
            <DialogDescription>{t("admin.administrators.demoteDescription")}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedUser.name || "N/A"}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email || "N/A"}</p>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-700 dark:text-red-400">
                      {t("admin.administrators.demoteWarning")}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {t("admin.administrators.demoteWarningDetails")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDemoteDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDemote} 
              disabled={updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending ? t("common.saving") : t("admin.administrators.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

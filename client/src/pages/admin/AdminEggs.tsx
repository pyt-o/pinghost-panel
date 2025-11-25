import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Download, Package } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/LanguageContext";

export default function AdminEggs() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEgg, setSelectedEgg] = useState<any>(null);

  const { data: eggs, isLoading } = useQuery({
    queryKey: ["admin", "eggs"],
    queryFn: () => trpc.eggs.listAll.query(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => trpc.eggs.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "eggs"] });
      setIsCreateDialogOpen(false);
      toast.success(t("admin.eggs.created"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("admin.eggs.createError"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => trpc.eggs.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "eggs"] });
      setIsEditDialogOpen(false);
      toast.success(t("admin.eggs.updated"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("admin.eggs.updateError"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => trpc.eggs.delete.mutate({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "eggs"] });
      toast.success(t("admin.eggs.deleted"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("admin.eggs.deleteError"));
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      author: formData.get("author") as string,
      dockerImage: formData.get("dockerImage") as string,
      startupCommand: formData.get("startupCommand") as string,
      category: formData.get("category") as string,
      minRam: parseInt(formData.get("minRam") as string),
      minDisk: parseInt(formData.get("minDisk") as string),
      minCpu: parseInt(formData.get("minCpu") as string),
      isActive: formData.get("isActive") === "true",
    });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      id: selectedEgg.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      author: formData.get("author") as string,
      dockerImage: formData.get("dockerImage") as string,
      startupCommand: formData.get("startupCommand") as string,
      category: formData.get("category") as string,
      minRam: parseInt(formData.get("minRam") as string),
      minDisk: parseInt(formData.get("minDisk") as string),
      minCpu: parseInt(formData.get("minCpu") as string),
      isActive: formData.get("isActive") === "true",
    });
  };

  const handleDelete = (id: number) => {
    if (confirm(t("admin.eggs.deleteConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      minecraft: "bg-green-500",
      csgo: "bg-orange-500",
      nodejs: "bg-blue-500",
      python: "bg-yellow-500",
      rust: "bg-red-500",
      other: "bg-gray-500",
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.eggs.title")}</h1>
          <p className="text-muted-foreground">{t("admin.eggs.description")}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.eggs.create")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t("admin.eggs.list")}
          </CardTitle>
          <CardDescription>{t("admin.eggs.listDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("common.loading")}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.eggs.name")}</TableHead>
                  <TableHead>{t("admin.eggs.category")}</TableHead>
                  <TableHead>{t("admin.eggs.author")}</TableHead>
                  <TableHead>{t("admin.eggs.requirements")}</TableHead>
                  <TableHead>{t("admin.eggs.downloads")}</TableHead>
                  <TableHead>{t("admin.eggs.status")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eggs?.map((egg: any) => (
                  <TableRow key={egg.id}>
                    <TableCell className="font-medium">{egg.name}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryBadge(egg.category)}>
                        {egg.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{egg.author || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {egg.minRam}MB RAM / {egg.minDisk}MB Disk / {egg.minCpu}% CPU
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {egg.downloadCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={egg.isActive ? "default" : "secondary"}>
                        {egg.isActive ? t("common.active") : t("common.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEgg(egg);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(egg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin.eggs.createTitle")}</DialogTitle>
            <DialogDescription>{t("admin.eggs.createDescription")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("admin.eggs.name")}</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">{t("admin.eggs.author")}</Label>
                <Input id="author" name="author" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("admin.eggs.description")}</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">{t("admin.eggs.category")}</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.eggs.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minecraft">Minecraft</SelectItem>
                    <SelectItem value="csgo">CS:GO</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="other">{t("common.other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dockerImage">{t("admin.eggs.dockerImage")}</Label>
                <Input id="dockerImage" name="dockerImage" required placeholder="ghcr.io/pterodactyl/yolks:java_17" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startupCommand">{t("admin.eggs.startupCommand")}</Label>
              <Textarea id="startupCommand" name="startupCommand" required rows={2} placeholder="java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minRam">{t("admin.eggs.minRam")} (MB)</Label>
                <Input id="minRam" name="minRam" type="number" defaultValue={512} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minDisk">{t("admin.eggs.minDisk")} (MB)</Label>
                <Input id="minDisk" name="minDisk" type="number" defaultValue={1024} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minCpu">{t("admin.eggs.minCpu")} (%)</Label>
                <Input id="minCpu" name="minCpu" type="number" defaultValue={50} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">{t("admin.eggs.status")}</Label>
              <Select name="isActive" defaultValue="true">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">{t("common.active")}</SelectItem>
                  <SelectItem value="false">{t("common.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? t("common.creating") : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("admin.eggs.editTitle")}</DialogTitle>
            <DialogDescription>{t("admin.eggs.editDescription")}</DialogDescription>
          </DialogHeader>
          {selectedEgg && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">{t("admin.eggs.name")}</Label>
                  <Input id="edit-name" name="name" defaultValue={selectedEgg.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-author">{t("admin.eggs.author")}</Label>
                  <Input id="edit-author" name="author" defaultValue={selectedEgg.author} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">{t("admin.eggs.description")}</Label>
                <Textarea id="edit-description" name="description" defaultValue={selectedEgg.description} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">{t("admin.eggs.category")}</Label>
                  <Select name="category" defaultValue={selectedEgg.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minecraft">Minecraft</SelectItem>
                      <SelectItem value="csgo">CS:GO</SelectItem>
                      <SelectItem value="nodejs">Node.js</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="other">{t("common.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dockerImage">{t("admin.eggs.dockerImage")}</Label>
                  <Input id="edit-dockerImage" name="dockerImage" defaultValue={selectedEgg.dockerImage} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-startupCommand">{t("admin.eggs.startupCommand")}</Label>
                <Textarea id="edit-startupCommand" name="startupCommand" defaultValue={selectedEgg.startupCommand} required rows={2} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-minRam">{t("admin.eggs.minRam")} (MB)</Label>
                  <Input id="edit-minRam" name="minRam" type="number" defaultValue={selectedEgg.minRam} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minDisk">{t("admin.eggs.minDisk")} (MB)</Label>
                  <Input id="edit-minDisk" name="minDisk" type="number" defaultValue={selectedEgg.minDisk} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minCpu">{t("admin.eggs.minCpu")} (%)</Label>
                  <Input id="edit-minCpu" name="minCpu" type="number" defaultValue={selectedEgg.minCpu} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-isActive">{t("admin.eggs.status")}</Label>
                <Select name="isActive" defaultValue={selectedEgg.isActive ? "true" : "false"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{t("common.active")}</SelectItem>
                    <SelectItem value="false">{t("common.inactive")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? t("common.saving") : t("common.save")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

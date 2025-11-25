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
import { Plus, Pencil, Trash2, Download, Store, Star } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/LanguageContext";

export default function AdminMarketplace() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin", "marketplace"],
    queryFn: () => trpc.marketplace.listAll.query(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => trpc.marketplace.create.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace"] });
      setIsCreateDialogOpen(false);
      toast.success(t("admin.marketplace.created"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("admin.marketplace.createError"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => trpc.marketplace.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace"] });
      setIsEditDialogOpen(false);
      toast.success(t("admin.marketplace.updated"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("admin.marketplace.updateError"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => trpc.marketplace.delete.mutate({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace"] });
      toast.success(t("admin.marketplace.deleted"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("admin.marketplace.deleteError"));
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      serverType: formData.get("serverType") as string,
      version: formData.get("version") as string,
      downloadUrl: formData.get("downloadUrl") as string,
      installScript: formData.get("installScript") as string,
      price: parseInt(formData.get("price") as string),
      isActive: formData.get("isActive") === "true",
    });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      id: selectedItem.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      serverType: formData.get("serverType") as string,
      version: formData.get("version") as string,
      downloadUrl: formData.get("downloadUrl") as string,
      installScript: formData.get("installScript") as string,
      price: parseInt(formData.get("price") as string),
      isActive: formData.get("isActive") === "true",
    });
  };

  const handleDelete = (id: number) => {
    if (confirm(t("admin.marketplace.deleteConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      plugin: "bg-purple-500",
      mod: "bg-blue-500",
      theme: "bg-pink-500",
      script: "bg-green-500",
      addon: "bg-orange-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("admin.marketplace.title")}</h1>
          <p className="text-muted-foreground">{t("admin.marketplace.description")}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("admin.marketplace.create")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            {t("admin.marketplace.list")}
          </CardTitle>
          <CardDescription>{t("admin.marketplace.listDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">{t("common.loading")}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.marketplace.name")}</TableHead>
                  <TableHead>{t("admin.marketplace.category")}</TableHead>
                  <TableHead>{t("admin.marketplace.serverType")}</TableHead>
                  <TableHead>{t("admin.marketplace.version")}</TableHead>
                  <TableHead>{t("admin.marketplace.price")}</TableHead>
                  <TableHead>{t("admin.marketplace.downloads")}</TableHead>
                  <TableHead>{t("admin.marketplace.rating")}</TableHead>
                  <TableHead>{t("admin.marketplace.status")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryBadge(item.category)}>
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.serverType}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">v{item.version}</TableCell>
                    <TableCell>
                      {item.price === 0 ? (
                        <Badge variant="secondary">{t("common.free")}</Badge>
                      ) : (
                        <span className="font-medium">{item.price} {t("common.credits")}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {item.downloadCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {parseFloat(item.rating).toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? t("common.active") : t("common.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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
            <DialogTitle>{t("admin.marketplace.createTitle")}</DialogTitle>
            <DialogDescription>{t("admin.marketplace.createDescription")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("admin.marketplace.name")}</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">{t("admin.marketplace.author")}</Label>
                <Input id="author" name="author" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("admin.marketplace.description")}</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">{t("admin.marketplace.category")}</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.marketplace.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plugin">Plugin</SelectItem>
                    <SelectItem value="mod">Mod</SelectItem>
                    <SelectItem value="theme">Theme</SelectItem>
                    <SelectItem value="script">Script</SelectItem>
                    <SelectItem value="addon">Addon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serverType">{t("admin.marketplace.serverType")}</Label>
                <Select name="serverType" required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("admin.marketplace.selectServerType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minecraft">Minecraft</SelectItem>
                    <SelectItem value="csgo">CS:GO</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">{t("admin.marketplace.version")}</Label>
                <Input id="version" name="version" required placeholder="1.0.0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t("admin.marketplace.price")} ({t("common.credits")})</Label>
                <Input id="price" name="price" type="number" defaultValue={0} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="downloadUrl">{t("admin.marketplace.downloadUrl")}</Label>
              <Input id="downloadUrl" name="downloadUrl" required placeholder="https://example.com/plugin.zip" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="installScript">{t("admin.marketplace.installScript")}</Label>
              <Textarea id="installScript" name="installScript" rows={4} placeholder="#!/bin/bash&#10;unzip plugin.zip -d /server/plugins/" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">{t("admin.marketplace.status")}</Label>
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
            <DialogTitle>{t("admin.marketplace.editTitle")}</DialogTitle>
            <DialogDescription>{t("admin.marketplace.editDescription")}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">{t("admin.marketplace.name")}</Label>
                  <Input id="edit-name" name="name" defaultValue={selectedItem.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-author">{t("admin.marketplace.author")}</Label>
                  <Input id="edit-author" name="author" defaultValue={selectedItem.author} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">{t("admin.marketplace.description")}</Label>
                <Textarea id="edit-description" name="description" defaultValue={selectedItem.description} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">{t("admin.marketplace.category")}</Label>
                  <Select name="category" defaultValue={selectedItem.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plugin">Plugin</SelectItem>
                      <SelectItem value="mod">Mod</SelectItem>
                      <SelectItem value="theme">Theme</SelectItem>
                      <SelectItem value="script">Script</SelectItem>
                      <SelectItem value="addon">Addon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-serverType">{t("admin.marketplace.serverType")}</Label>
                  <Select name="serverType" defaultValue={selectedItem.serverType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minecraft">Minecraft</SelectItem>
                      <SelectItem value="csgo">CS:GO</SelectItem>
                      <SelectItem value="nodejs">Node.js</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="all">{t("common.all")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-version">{t("admin.marketplace.version")}</Label>
                  <Input id="edit-version" name="version" defaultValue={selectedItem.version} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">{t("admin.marketplace.price")} ({t("common.credits")})</Label>
                  <Input id="edit-price" name="price" type="number" defaultValue={selectedItem.price} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-downloadUrl">{t("admin.marketplace.downloadUrl")}</Label>
                <Input id="edit-downloadUrl" name="downloadUrl" defaultValue={selectedItem.downloadUrl} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-installScript">{t("admin.marketplace.installScript")}</Label>
                <Textarea id="edit-installScript" name="installScript" defaultValue={selectedItem.installScript} rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-isActive">{t("admin.marketplace.status")}</Label>
                <Select name="isActive" defaultValue={selectedItem.isActive ? "true" : "false"}>
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

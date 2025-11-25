import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Store, Download, Star, Search, Filter, Package, Coins } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/LanguageContext";
import MarketplaceReviews from "@/components/MarketplaceReviews";

export default function UserMarketplace() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isInstallDialogOpen, setIsInstallDialogOpen] = useState(false);
  const [selectedServerId, setSelectedServerId] = useState<number | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ["marketplace", "list"],
    queryFn: () => trpc.marketplace.list.query(),
  });

  const { data: servers } = useQuery({
    queryKey: ["servers", "list"],
    queryFn: () => trpc.servers.list.query(),
  });

  const { data: userCredits } = useQuery({
    queryKey: ["users", "credits"],
    queryFn: () => trpc.users.myCredits.query(),
  });

  const installMutation = useMutation({
    mutationFn: (data: { serverId: number; itemId: number }) =>
      trpc.marketplace.install.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "credits"] });
      queryClient.invalidateQueries({ queryKey: ["servers"] });
      setIsInstallDialogOpen(false);
      toast.success(t("marketplace.installSuccess"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("marketplace.installError"));
    },
  });

  const handleInstall = () => {
    if (!selectedServerId || !selectedItem) return;
    installMutation.mutate({
      serverId: selectedServerId,
      itemId: selectedItem.id,
    });
  };

  const filteredItems = items?.filter((item: any) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { value: "all", label: t("common.all") },
    { value: "plugin", label: "Plugin" },
    { value: "mod", label: "Mod" },
    { value: "theme", label: "Theme" },
    { value: "script", label: "Script" },
    { value: "addon", label: "Addon" },
  ];

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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-8 w-8" />
            {t("marketplace.title")}
          </h1>
          <p className="text-muted-foreground">{t("marketplace.description")}</p>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">{userCredits?.credits || 0}</span>
          <span className="text-sm text-muted-foreground">{t("common.credits")}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("marketplace.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="text-center py-12">{t("common.loading")}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems?.map((item: any) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {item.author && `${t("marketplace.by")} ${item.author}`}
                    </CardDescription>
                  </div>
                  <Badge className={getCategoryBadge(item.category)}>
                    {item.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.description || t("marketplace.noDescription")}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {item.downloadCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {parseFloat(item.rating).toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    v{item.version}
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="outline">{item.serverType}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="font-semibold">
                  {item.price === 0 ? (
                    <Badge variant="secondary">{t("common.free")}</Badge>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      {item.price}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItem(item)}
                  >
                    {t("marketplace.reviews")}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsInstallDialogOpen(true);
                    }}
                  >
                    {t("marketplace.install")}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {filteredItems?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Store className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
          <p className="text-muted-foreground">{t("marketplace.noItems")}</p>
        </div>
      )}

      {/* Reviews Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('marketplace.reviews_for')} {selectedItem?.name}</DialogTitle>
            <DialogDescription>{t('marketplace.reviews_description')}</DialogDescription>
          </DialogHeader>
          
          {selectedItem && <MarketplaceReviews itemId={selectedItem.id} />}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Install Dialog */}
      <Dialog open={isInstallDialogOpen} onOpenChange={setIsInstallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("marketplace.installTitle")}</DialogTitle>
            <DialogDescription>{t("marketplace.installDescription")}</DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold">{selectedItem.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={getCategoryBadge(selectedItem.category)}>
                    {selectedItem.category}
                  </Badge>
                  <Badge variant="outline">{selectedItem.serverType}</Badge>
                  <span className="text-sm">v{selectedItem.version}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("marketplace.selectServer")}</label>
                <Select
                  value={selectedServerId?.toString()}
                  onValueChange={(value) => setSelectedServerId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("marketplace.chooseServer")} />
                  </SelectTrigger>
                  <SelectContent>
                    {servers
                      ?.filter((s: any) => 
                        selectedItem.serverType === "all" || 
                        s.serverType === selectedItem.serverType
                      )
                      .map((server: any) => (
                        <SelectItem key={server.id} value={server.id.toString()}>
                          {server.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("marketplace.cost")}:</span>
                  <div className="flex items-center gap-2">
                    {selectedItem.price === 0 ? (
                      <Badge variant="secondary">{t("common.free")}</Badge>
                    ) : (
                      <>
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">{selectedItem.price}</span>
                        <span className="text-sm text-muted-foreground">{t("common.credits")}</span>
                      </>
                    )}
                  </div>
                </div>
                {selectedItem.price > 0 && (
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("marketplace.balanceAfter")}:</span>
                    <span className="font-medium">
                      {(userCredits?.credits || 0) - selectedItem.price} {t("common.credits")}
                    </span>
                  </div>
                )}
              </div>

              {selectedItem.price > (userCredits?.credits || 0) && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{t("marketplace.insufficientCredits")}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInstallDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleInstall}
              disabled={
                !selectedServerId ||
                installMutation.isPending ||
                (selectedItem?.price > (userCredits?.credits || 0))
              }
            >
              {installMutation.isPending ? t("marketplace.installing") : t("marketplace.install")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

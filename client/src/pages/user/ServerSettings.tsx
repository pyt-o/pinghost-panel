import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Terminal, HardDrive, Database, Settings as SettingsIcon, Archive, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ServerSettings() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const serverId = params.id;

  // Mock server data
  const [serverName, setServerName] = useState(`Serwer #${serverId}`);
  const [autoRenew, setAutoRenew] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  // Mock server data for navigation
  const mockServer = {
    id: serverId,
    name: serverName,
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/');
    }
  }, [loading, isAuthenticated, setLocation]);

  useEffect(() => {
    if (!serverId) {
      toast.error(t('messages.not_found'));
      setLocation('/servers');
      return;
    }
    // In a real app, fetch server settings
  }, [serverId, setLocation, t]);

  const handleSaveSettings = () => {
    toast.success(t('servers.settings_saved') || "Ustawienia serwera zapisane pomyślnie!");
    // In a real app, this would call a tRPC mutation
  };

  const handleReinstall = () => {
    toast.warning(t('servers.reinstall_confirm') || "Czy na pewno chcesz przeinstalować serwer? Spowoduje to utratę wszystkich danych.");
    // In a real app, this would call a tRPC mutation
  };

  if (loading || !user || !mockServer) return null;

  const navItems = [
    { label: t('servers.console'), href: `/servers/${serverId}/console`, icon: Terminal },
    { label: t('servers.files'), href: `/servers/${serverId}/files`, icon: HardDrive },
    { label: t('servers.databases'), href: `/servers/${serverId}/databases`, icon: Database },
    { label: t('servers.settings'), href: `/servers/${serverId}/settings`, icon: SettingsIcon },
    { label: t('backups.title'), href: `/servers/${serverId}/backups`, icon: Archive },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('servers.settings')} - {mockServer.name}</h1>
          <p className="text-muted-foreground">{t('servers.settings_description') || "Zarządzaj podstawowymi ustawieniami serwera."}</p>
        </div>

        {/* General Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Ustawienia Ogólne</CardTitle>
            <CardDescription>Zmień nazwę serwera i inne podstawowe opcje.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-name">{t('servers.server_name')}</Label>
              <Input
                id="server-name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder={t('servers.server_name')}
              />
            </div>
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="auto-start" className="flex flex-col space-y-1">
                <span>{t('servers.auto_start') || "Automatyczny Start"}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {t('servers.auto_start_description') || "Automatycznie uruchamiaj serwer po restarcie noda."}
                </span>
              </Label>
              <Switch id="auto-start" checked={false} disabled />
            </div>
            <Button onClick={handleSaveSettings}>{t('common.save')}</Button>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Ustawienia Rozliczeń</CardTitle>
            <CardDescription>Zarządzaj cyklem rozliczeniowym i odnawianiem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="auto-renew" className="flex flex-col space-y-1">
                <span>{t('servers.auto_renew') || "Automatyczne Odnawianie"}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {t('servers.auto_renew_description') || "Automatycznie odnawiaj serwer z kredytów przed wygaśnięciem."}
                </span>
              </Label>
              <Switch id="auto-renew" checked={autoRenew} onCheckedChange={setAutoRenew} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing-cycle">{t('servers.billing_cycle')}</Label>
              <Select value={billingCycle} onValueChange={setBillingCycle}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('servers.billing_cycle')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">{t('servers.hourly')}</SelectItem>
                  <SelectItem value="daily">{t('servers.daily')}</SelectItem>
                  <SelectItem value="monthly">{t('servers.monthly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveSettings}>{t('common.save')}</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card border-border border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Strefa Zagrożenia</CardTitle>
            <CardDescription>Nieodwracalne akcje, które mogą spowodować utratę danych.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
              <Label htmlFor="reinstall" className="flex flex-col space-y-1">
                <span>{t('servers.reinstall') || "Przeinstaluj Serwer"}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {t('servers.reinstall_warning') || "Spowoduje to usunięcie wszystkich plików i ponowną instalację systemu serwera."}
                </span>
              </Label>
              <Button variant="destructive" onClick={handleReinstall}>
                <RefreshCw className="h-4 w-4 mr-2" /> {t('servers.reinstall')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

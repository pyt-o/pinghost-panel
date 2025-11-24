import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Server, Ticket, CreditCard, LayoutDashboard, Settings as SettingsIcon } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Settings() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const updateUserLanguage = trpc.users.updateLanguage.useMutation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/');
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading || !user) return null;

  const navItems = [
    { label: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { label: t('nav.my_servers'), href: '/servers', icon: Server },
    { label: t('nav.support'), href: '/tickets', icon: Ticket },
    { label: t('nav.credits'), href: '/credits', icon: CreditCard },
    { label: t('nav.profile'), href: '/settings', icon: SettingsIcon },
  ];

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'pl' | 'en');
    updateUserLanguage.mutate(
      { language: newLanguage as 'pl' | 'en' },
      {
        onSuccess: () => {
          toast.success(t('settings.settings_saved'));
        },
        onError: () => {
          toast.error(t('messages.error_saving'));
          setLanguage(language);
        },
      }
    );
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.preferences')}</p>
        </div>

        {/* Language Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">{t('settings.language_preference')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">{t('settings.select_language')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('common.language')}
                </p>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-48 bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="pl">{t('settings.polish')}</SelectItem>
                  <SelectItem value="en">{t('settings.english')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">{t('settings.account')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">{t('users.name')}</label>
              <div className="p-3 bg-background rounded border border-border text-card-foreground">
                {user.name || 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">{t('users.email')}</label>
              <div className="p-3 bg-background rounded border border-border text-card-foreground">
                {user.email || 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">{t('settings.security')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              {t('settings.change_password')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              {t('settings.enable_2fa')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

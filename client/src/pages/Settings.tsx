import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Server, Ticket, CreditCard, LayoutDashboard, Settings as SettingsIcon, User, Lock, Mail, ShoppingCart } from 'lucide-react';
import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Settings() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const updateUserLanguage = trpc.users.updateLanguage.useMutation();
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  
  const [profileName, setProfileName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation('/');
    }
  }, [loading, isAuthenticated, setLocation]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setNewEmail(user.email || "");
    }
  }, [user]);

  if (loading || !user) return null;

  const navItems = [
    { label: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { label: t('nav.my_servers'), href: '/servers', icon: Server },
    { label: t('nav.support'), href: '/tickets', icon: Ticket },
    { label: t('nav.credits'), href: '/credits', icon: CreditCard },
    { label: t('nav.marketplace'), href: '/marketplace', icon: ShoppingCart },
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

  const handleUpdateProfile = () => {
    // This would call a tRPC mutation to update profile
    toast.success(t('settings.profile_updated'));
    setIsEditProfileOpen(false);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('settings.passwords_dont_match'));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t('settings.password_too_short'));
      return;
    }
    // This would call a tRPC mutation to change password
    toast.success(t('settings.password_changed'));
    setIsChangePasswordOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangeEmail = () => {
    if (!newEmail.includes('@')) {
      toast.error(t('settings.invalid_email'));
      return;
    }
    // This would call a tRPC mutation to change email
    toast.success(t('settings.email_changed'));
    setIsChangeEmailOpen(false);
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
            <CardDescription>{t('settings.language_description')}</CardDescription>
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
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('settings.account')}
            </CardTitle>
            <CardDescription>{t('settings.account_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">{t('users.name')}</label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-background rounded border border-border text-card-foreground">
                  {user.name || 'N/A'}
                </div>
                <Button onClick={() => setIsEditProfileOpen(true)}>
                  {t('common.edit')}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">{t('users.email')}</label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-background rounded border border-border text-card-foreground">
                  {user.email || 'N/A'}
                </div>
                <Button onClick={() => setIsChangeEmailOpen(true)}>
                  {t('common.change')}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">{t('users.role')}</label>
              <div className="p-3 bg-background rounded border border-border text-card-foreground capitalize">
                {user.role}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t('settings.security')}
            </CardTitle>
            <CardDescription>{t('settings.security_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsChangePasswordOpen(true)}
            >
              {t('settings.change_password')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setLocation('/settings/2fa')}
            >
              {t('2fa.title')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.edit_profile')}</DialogTitle>
            <DialogDescription>{t('settings.edit_profile_description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">{t('users.name')}</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder={t('settings.enter_name')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleUpdateProfile}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.change_password')}</DialogTitle>
            <DialogDescription>{t('settings.change_password_description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">{t('settings.current_password')}</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('settings.enter_current_password')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{t('settings.new_password')}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('settings.enter_new_password')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t('settings.confirm_password')}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('settings.confirm_new_password')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleChangePassword}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Email Dialog */}
      <Dialog open={isChangeEmailOpen} onOpenChange={setIsChangeEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.change_email')}</DialogTitle>
            <DialogDescription>{t('settings.change_email_description')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">{t('settings.new_email')}</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={t('settings.enter_new_email')}
              />
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {t('settings.email_verification_notice')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeEmailOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleChangeEmail}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

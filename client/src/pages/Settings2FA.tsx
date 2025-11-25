import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/shared/translations';
import { trpc } from '@/utils/trpc';
import { useToast } from '@/components/ui/use-toast';
import QRCode from 'qrcode.react';

const Settings2FA: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [otpauth, setOtpauth] = useState('');

  const { data: statusData, refetch: refetchStatus } = trpc.twoFactorAuth.twoFactorAuth.status.useQuery();
  const isEnabled = statusData?.enabled;

  const generateMutation = trpc.twoFactorAuth.twoFactorAuth.generate.useMutation({
    onSuccess: (data) => {
      setSecret(data.secret);
      setOtpauth(data.otpauth);
      toast({
        title: t('2fa.setup_started'),
        description: t('2fa.scan_qr'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const enableMutation = trpc.twoFactorAuth.twoFactorAuth.enable.useMutation({
    onSuccess: () => {
      setSecret('');
      setOtpauth('');
      setToken('');
      refetchStatus();
      toast({
        title: t('2fa.enabled_title'),
        description: t('2fa.enabled_description'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const disableMutation = trpc.twoFactorAuth.twoFactorAuth.disable.useMutation({
    onSuccess: () => {
      setToken('');
      refetchStatus();
      toast({
        title: t('2fa.disabled_title'),
        description: t('2fa.disabled_description'),
      });
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate();
  };

  const handleEnable = () => {
    if (!secret || !token) {
      toast({
        title: t('common.error'),
        description: t('2fa.token_and_secret_required'),
        variant: 'destructive',
      });
      return;
    }
    enableMutation.mutate({ secret, token });
  };

  const handleDisable = () => {
    if (!token) {
      toast({
        title: t('common.error'),
        description: t('2fa.token_required'),
        variant: 'destructive',
      });
      return;
    }
    disableMutation.mutate({ token });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('2fa.title')}</CardTitle>
        <CardDescription>
          {isEnabled ? t('2fa.status_enabled') : t('2fa.status_disabled')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEnabled ? (
          <div className="space-y-4">
            <p>{t('2fa.disable_prompt')}</p>
            <div className="space-y-2">
              <Label htmlFor="token">{t('2fa.token')}</Label>
              <Input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="123456"
              />
            </div>
            <Button
              onClick={handleDisable}
              disabled={disableMutation.isLoading}
              variant="destructive"
            >
              {disableMutation.isLoading ? t('common.loading') : t('2fa.disable_button')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {secret ? (
              <>
                <p className="font-semibold">{t('2fa.setup_step_1')}</p>
                <div className="flex flex-col items-center space-y-4">
                  {otpauth && <QRCode value={otpauth} size={128} level="H" />}
                  <p className="text-sm font-mono break-all">{t('2fa.secret_key')}: {secret}</p>
                </div>
                <p className="font-semibold">{t('2fa.setup_step_2')}</p>
                <div className="space-y-2">
                  <Label htmlFor="token">{t('2fa.token')}</Label>
                  <Input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="123456"
                  />
                </div>
                <Button
                  onClick={handleEnable}
                  disabled={enableMutation.isLoading || !token}
                >
                  {enableMutation.isLoading ? t('common.loading') : t('2fa.enable_button')}
                </Button>
              </>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isLoading}
              >
                {generateMutation.isLoading ? t('common.loading') : t('2fa.setup_button')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Settings2FA;

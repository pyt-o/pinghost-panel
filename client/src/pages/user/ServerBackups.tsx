import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Terminal, HardDrive, Database, Settings as SettingsIcon, Archive, Download, Trash2, PlusCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Mock Backup Data
type BackupEntry = {
  id: number;
  name: string;
  size: number;
  createdAt: Date;
  status: 'pending' | 'completed' | 'failed';
};

const mockBackups: BackupEntry[] = [
  { id: 1, name: 'backup-2023-11-25-full', size: 5000000000, createdAt: new Date(Date.now() - 86400000 * 2), status: 'completed' },
  { id: 2, name: 'backup-2023-11-26-inc', size: 120000000, createdAt: new Date(Date.now() - 86400000), status: 'completed' },
  { id: 3, name: 'backup-2023-11-27-full', size: 5100000000, createdAt: new Date(Date.now() - 3600000), status: 'pending' },
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getStatusBadge = (status: BackupEntry['status']) => {
  switch (status) {
    case 'completed':
      return <Badge variant="success">{t('backups.completed') || "Zakończono"}</Badge>;
    case 'pending':
      return <Badge variant="warning">{t('backups.pending') || "Oczekuje"}</Badge>;
    case 'failed':
      return <Badge variant="destructive">{t('backups.failed') || "Niepowodzenie"}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function ServerBackups() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const serverId = params.id;

  const [backups, setBackups] = useState<BackupEntry[]>(mockBackups);

  // Mock server data for navigation
  const mockServer = {
    id: serverId,
    name: `Serwer #${serverId}`,
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
    // In a real app, fetch backups using tRPC
  }, [serverId, setLocation, t]);

  const handleCreateBackup = () => {
    toast.info(t('backups.creating_backup') || "Tworzenie kopii zapasowej...");
    const newBackup: BackupEntry = {
      id: Date.now(),
      name: `backup-${format(new Date(), 'yyyy-MM-dd-HHmmss')}-manual`,
      size: Math.floor(Math.random() * 1000000000) + 100000000, // Random size
      createdAt: new Date(),
      status: 'pending',
    };
    setBackups(prev => [newBackup, ...prev]);
    // Mock completion after a delay
    setTimeout(() => {
      setBackups(prev => prev.map(b => b.id === newBackup.id ? { ...b, status: 'completed' } : b));
      toast.success(t('backups.backup_created') || "Kopia zapasowa utworzona pomyślnie!");
    }, 5000);
  };

  const handleRestore = (backup: BackupEntry) => {
    if (backup.status !== 'completed') {
      toast.error(t('backups.restore_failed_status') || "Nie można przywrócić kopii zapasowej o statusie innym niż 'Zakończono'.");
      return;
    }
    toast.info(t('backups.restoring') || `Przywracanie kopii zapasowej: ${backup.name}...`);
    // In a real app, this would call a tRPC mutation
  };

  const handleDelete = (backup: BackupEntry) => {
    toast.info(t('backups.deleting') || `Usuwanie kopii zapasowej: ${backup.name}...`);
    setBackups(prev => prev.filter(b => b.id !== backup.id));
    // In a real app, this would call a tRPC mutation
    setTimeout(() => {
      toast.success(t('backups.backup_deleted') || "Kopia zapasowa usunięta pomyślnie!");
    }, 1000);
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
          <h1 className="text-3xl font-bold text-foreground">{t('backups.title') || "Kopie Zapasowe"} - {mockServer.name}</h1>
          <p className="text-muted-foreground">{t('backups.description') || "Zarządzaj kopiami zapasowymi swojego serwera."}</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Archive className="h-5 w-5" />
              {t('backups.list') || "Lista Kopii Zapasowych"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" onClick={handleCreateBackup}>
                <PlusCircle className="h-4 w-4 mr-2" /> {t('backups.create_new') || "Utwórz Nową Kopię"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">{t('backups.name') || "Nazwa"}</TableHead>
                  <TableHead>{t('backups.status') || "Status"}</TableHead>
                  <TableHead className="text-right">{t('backups.size') || "Rozmiar"}</TableHead>
                  <TableHead className="text-right">{t('backups.created_at') || "Utworzono"}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.length > 0 ? (
                  backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell className="font-medium">{backup.name}</TableCell>
                      <TableCell>{getStatusBadge(backup.status)}</TableCell>
                      <TableCell className="text-right">{formatBytes(backup.size)}</TableCell>
                      <TableCell className="text-right">{format(backup.createdAt, 'dd.MM.yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRestore(backup)} 
                            title={t('backups.restore') || "Przywróć"}
                            disabled={backup.status !== 'completed'}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(backup)} 
                            title={t('common.delete')}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {t('backups.no_backups') || "Brak kopii zapasowych."}
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

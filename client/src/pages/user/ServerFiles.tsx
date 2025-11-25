import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Terminal, HardDrive, Database, Settings as SettingsIcon, Folder, FileText, Upload, Download, Trash2, Edit, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

// Mock File System Structure
type FileEntry = {
  name: string;
  type: 'file' | 'directory';
  size: number;
  lastModified: Date;
};

const mockFileSystem: { [key: string]: FileEntry[] } = {
  '/': [
    { name: 'server.jar', type: 'file', size: 15000000, lastModified: new Date(Date.now() - 86400000) },
    { name: 'logs', type: 'directory', size: 0, lastModified: new Date(Date.now() - 3600000) },
    { name: 'plugins', type: 'directory', size: 0, lastModified: new Date(Date.now() - 7200000) },
    { name: 'world', type: 'directory', size: 0, lastModified: new Date(Date.now() - 1800000) },
    { name: 'server.properties', type: 'file', size: 1200, lastModified: new Date(Date.now() - 10800000) },
    { name: 'start.sh', type: 'file', size: 50, lastModified: new Date(Date.now() - 14400000) },
  ],
  '/logs': [
    { name: 'latest.log', type: 'file', size: 500000, lastModified: new Date(Date.now() - 60000) },
    { name: '2023-10-26-1.log', type: 'file', size: 120000, lastModified: new Date(Date.now() - 7200000) },
  ],
  '/plugins': [
    { name: 'EssentialsX.jar', type: 'file', size: 2500000, lastModified: new Date(Date.now() - 3600000) },
    { name: 'LuckPerms.jar', type: 'file', size: 1800000, lastModified: new Date(Date.now() - 10800000) },
  ],
  '/world': [
    { name: 'level.dat', type: 'file', size: 5000, lastModified: new Date(Date.now() - 1800000) },
    { name: 'region', type: 'directory', size: 0, lastModified: new Date(Date.now() - 1800000) },
  ]
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function ServerFiles() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const serverId = params.id;

  const [currentPath, setCurrentPath] = useState('/');
  const [fileList, setFileList] = useState<FileEntry[]>([]);

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
    // Mock fetching file list
    const pathKey = currentPath === '/' ? '/' : currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
    setFileList(mockFileSystem[pathKey] || []);
  }, [serverId, currentPath, setLocation, t]);

  const handleNavigate = (name: string, type: 'file' | 'directory') => {
    if (type === 'directory') {
      const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
      setCurrentPath(newPath);
    } else {
      // Handle file view/edit (mock)
      toast.info(`Otwieranie pliku: ${name}`);
    }
  };

  const handleGoBack = () => {
    if (currentPath === '/') return;
    const pathParts = currentPath.split('/').filter(p => p.length > 0);
    pathParts.pop();
    setCurrentPath(pathParts.length === 0 ? '/' : `/${pathParts.join('/')}`);
  };

  const handleAction = (action: string, file: FileEntry) => {
    toast.info(`Akcja: ${action} na pliku: ${file.name}`);
    // In a real app, this would call a tRPC mutation
  };

  if (loading || !user || !mockServer) return null;

  const navItems = [
    { label: t('servers.console'), href: `/servers/${serverId}/console`, icon: Terminal },
    { label: t('servers.files'), href: `/servers/${serverId}/files`, icon: HardDrive },
    { label: t('servers.databases'), href: `/servers/${serverId}/databases`, icon: Database },
    { label: t('servers.settings'), href: `/servers/${serverId}/settings`, icon: SettingsIcon },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('servers.files')} - {mockServer.name}</h1>
          <p className="text-muted-foreground">{t('servers.details')}</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              {t('servers.files')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <Upload className="h-4 w-4 mr-2" /> {t('servers.upload_file') || "Upload Pliku"}
              </Button>
              <Button variant="outline" size="sm" disabled>
                <PlusCircle className="h-4 w-4 mr-2" /> {t('servers.create_folder') || "Nowy Folder"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {t('servers.current_path') || "Aktualna ścieżka"}: <span className="font-mono text-foreground">{currentPath}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleGoBack} disabled={currentPath === '/'}>
                {t('common.back')}
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">{t('servers.file_name') || "Nazwa Pliku"}</TableHead>
                  <TableHead>{t('servers.file_type') || "Typ"}</TableHead>
                  <TableHead className="text-right">{t('servers.file_size') || "Rozmiar"}</TableHead>
                  <TableHead className="text-right">{t('servers.last_modified') || "Ostatnia Modyfikacja"}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileList.length > 0 ? (
                  fileList.map((file) => (
                    <TableRow key={file.name} className="cursor-pointer hover:bg-accent/50" onClick={() => handleNavigate(file.name, file.type)}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {file.type === 'directory' ? <Folder className="h-4 w-4 text-blue-500" /> : <FileText className="h-4 w-4 text-gray-500" />}
                        {file.name}
                      </TableCell>
                      <TableCell className="capitalize">{file.type === 'directory' ? t('servers.folder') || "Folder" : t('servers.file') || "Plik"}</TableCell>
                      <TableCell className="text-right">{file.type === 'directory' ? '-' : formatBytes(file.size)}</TableCell>
                      <TableCell className="text-right">{format(file.lastModified, 'dd.MM.yyyy HH:mm')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {file.type === 'file' && (
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleAction('edit', file); }} title={t('common.edit')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleAction('download', file); }} title={t('servers.download')}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleAction('delete', file); }} title={t('common.delete')}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {t('servers.no_files') || "Brak plików w tym katalogu."}
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

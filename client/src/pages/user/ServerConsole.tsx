import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { Terminal, Send, Server, HardDrive, Database, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

// Mock WebSocket implementation for demonstration
class MockWebSocket {
  private listeners: { [key: string]: ((event: any) => void)[] } = {};
  private interval: NodeJS.Timeout | null = null;
  public readyState: number = 0; // 0: CONNECTING, 1: OPEN, 2: CLOSING, 3: CLOSED

  constructor(url: string) {
    console.log(`Connecting to mock WebSocket at ${url}...`);
    this.readyState = 0;
    setTimeout(() => {
      this.readyState = 1;
      this.emit('open', {});
      this.startMockStream();
    }, 1000);
  }

  on(event: string, callback: (event: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (event: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  send(data: string) {
    console.log(`Mock WS received: ${data}`);
    const command = JSON.parse(data).command;
    this.emit('message', { data: `> ${command}\n` });
    
    if (command.toLowerCase() === 'stop') {
      this.emit('message', { data: "Server is stopping...\n" });
      setTimeout(() => {
        this.emit('message', { data: "Server stopped.\n" });
      }, 2000);
    } else if (command.toLowerCase() === 'start') {
      this.emit('message', { data: "Server is starting...\n" });
      setTimeout(() => {
        this.emit('message', { data: "Server started successfully. Welcome to PingHost!\n" });
      }, 3000);
    } else if (command.toLowerCase() === 'help') {
      this.emit('message', { data: "Available commands: start, stop, restart, help, status\n" });
    } else {
      this.emit('message', { data: `Unknown command: ${command}\n` });
    }
  }

  close() {
    console.log("Mock WS closing...");
    this.readyState = 3;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.emit('close', {});
  }

  startMockStream() {
    let counter = 0;
    this.interval = setInterval(() => {
      if (this.readyState === 1) {
        this.emit('message', { data: `[${new Date().toLocaleTimeString()}] INFO: Server tick ${counter++}\n` });
      }
    }, 5000);
  }
}

// In a real application, this would be a proper WebSocket connection
// const WebSocketClass = typeof window !== 'undefined' ? window.WebSocket : MockWebSocket;
const WebSocketClass = MockWebSocket as any;

export default function ServerConsole() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const serverId = params.id;

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [ws, setWs] = useState<MockWebSocket | null>(null);
  const consoleRef = useRef<HTMLDivElement>(null);

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

    // Connect to WebSocket
    const newWs = new WebSocketClass(`ws://localhost:3001/server/${serverId}/console`);
    setWs(newWs);

    newWs.on('open', () => {
      setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] CONNECTED: Połączono z konsolą serwera ${mockServer.name}.\n`]);
    });

    newWs.on('message', (event: { data: string }) => {
      setConsoleOutput(prev => [...prev, event.data]);
    });

    newWs.on('close', () => {
      setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] DISCONNECTED: Połączenie z konsolą utracone.\n`]);
    });

    newWs.on('error', (error: any) => {
      setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ERROR: Błąd połączenia: ${error.message || 'Nieznany błąd'}\n`]);
      toast.error(t('messages.connection_error'));
    });

    return () => {
      newWs.close();
    };
  }, [serverId, setLocation, t]);

  // Auto-scroll console output
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (ws && ws.readyState === 1 && command.trim()) {
      ws.send(JSON.stringify({ command: command.trim() }));
      setCommand('');
    } else if (ws && ws.readyState !== 1) {
      toast.error("Konsola nie jest połączona. Spróbuj odświeżyć stronę.");
    }
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
          <h1 className="text-3xl font-bold text-foreground">{t('servers.console')} - {mockServer.name}</h1>
          <p className="text-muted-foreground">{t('servers.details')}</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              {t('servers.console')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={consoleRef}
              className="h-96 bg-black text-white font-mono text-xs p-4 overflow-y-scroll whitespace-pre-wrap break-words"
            >
              {consoleOutput.map((line, index) => (
                <span key={index} className={line.includes('ERROR') ? 'text-red-400' : line.includes('WARN') ? 'text-yellow-400' : line.includes('CONNECTED') ? 'text-green-400' : 'text-white'}>
                  {line}
                </span>
              ))}
            </div>
            <form onSubmit={handleSendCommand} className="flex p-4 border-t border-border">
              <Input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder={t('servers.console_placeholder') || "Wpisz komendę..."}
                className="flex-1 bg-background text-foreground border-border mr-2"
                disabled={ws?.readyState !== 1}
              />
              <Button type="submit" disabled={ws?.readyState !== 1}>
                <Send className="h-4 w-4 mr-2" />
                {t('servers.send_command') || "Wyślij"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { AIChatBox, Message } from "./AIChatBox";
import { MessageCircle, X, Minimize2 } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

export function ChatWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `Jesteś asystentem PingHost - platformy do hostingu serwerów gier i VPS. 
Pomagasz użytkownikom w:
- Wyborze odpowiedniego pakietu hostingowego
- Zarządzaniu serwerami (tworzenie, konfiguracja, restart)
- Rozwiązywaniu problemów technicznych
- Pytaniach o ceny i kredyty
- Instalacji pluginów i modów z marketplace

Odpowiadaj w języku polskim, profesjonalnie ale przyjaźnie. Jeśli pytanie wymaga pomocy technicznej, zaproponuj utworzenie ticketu wsparcia.`,
    },
  ]);

  // Load chat history
  const { data: chatHistory } = useQuery({
    queryKey: ["chat", "messages", sessionId],
    queryFn: () => trpc.chat.getMessages.query({ sessionId }),
    enabled: isOpen,
  });

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      const loadedMessages: Message[] = chatHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));
      setMessages([messages[0], ...loadedMessages]);
    }
  }, [chatHistory]);

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) =>
      trpc.chat.sendMessage.mutate({ sessionId, message }),
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    },
  });

  const createTicketMutation = trpc.tickets.create.useMutation({
    onSuccess: () => {
      setMessages([]);
      setIsOpen(false);
      toast.success(t('chat.ticket_created_success'));
    },
    onError: (error) => {
      toast.error(error.message || t('chat.ticket_created_error'));
    },
  });

  const handleEscalate = () => {
    const chatHistory = messages.slice(1).map(msg => `${msg.role === 'user' ? t('chat.user_label') : t('chat.assistant_label')}: ${msg.content}`).join('\n');
    
    createTicketMutation.mutate({
      subject: t('chat.ticket_subject'),
      message: `${t('chat.ticket_initial_message')}\n\n--- ${t('chat.chat_history')} ---\n${chatHistory}`,
      priority: 'medium',
      category: 'AI Chat Escalation',
    });
  };

  const handleSendMessage = (content: string) => {
    const newMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newMessage]);
    sendMessageMutation.mutate(content);
  };

  const suggestedPrompts = [
    t("chat.prompts.packages"),
    t("chat.prompts.createServer"),
    t("chat.prompts.pricing"),
    t("chat.prompts.support"),
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 transition-all ${
            isMinimized ? "h-14" : "h-[600px]"
          } w-[400px] max-w-[calc(100vw-3rem)]`}
        >
          {/* Chat Header */}
          <div className="bg-primary text-primary-foreground rounded-t-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">{t("chat.title")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="bg-background border-x border-b rounded-b-lg shadow-lg overflow-hidden">
              <div className="p-2 border-b">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleEscalate}
                  disabled={createTicketMutation.isPending}
                >
                  {createTicketMutation.isPending ? t('common.loading') : t('chat.escalate_to_ticket')}
                </Button>
              </div>
              <AIChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                placeholder={t("chat.placeholder")}
                height="calc(600px - 52px)"
                emptyStateMessage={t("chat.emptyState")}
                suggestedPrompts={suggestedPrompts}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

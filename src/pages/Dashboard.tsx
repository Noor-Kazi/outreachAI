import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, Linkedin, Send, Zap, ChevronLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInput } from "@/components/ProfileInput";
import { PersonaCard } from "@/components/PersonaCard";
import { MessageCard } from "@/components/MessageCard";
import { HistorySidebar } from "@/components/HistorySidebar";
import { PersonProfile, OutreachMessage, OutreachHistory } from "@/types/outreach";

import { mockHistory } from "@/data/mockData";
import { generateOutreach } from "@/services/ollamaService";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const channelConfig = {
  email: { icon: <Mail className="h-4 w-4" />, name: "Email", color: "text-primary" },
  linkedin: { icon: <Linkedin className="h-4 w-4" />, name: "LinkedIn DM", color: "text-[#0A66C2]" },
  whatsapp: { icon: <MessageCircle className="h-4 w-4" />, name: "WhatsApp/SMS", color: "text-success" },
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<PersonProfile | null>(null);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [history, setHistory] = useState<OutreachHistory[]>(mockHistory);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleGenerate = async (data: { linkedinUrl?: string; profileText?: string }) => {
    setIsLoading(true);

    try {
      const inputContext = data.profileText || data.linkedinUrl || "A professional in the tech industry";

      console.log("Generating outreach for:", inputContext);
      const { profile, messages: generatedMessages } = await generateOutreach(inputContext);

      setCurrentProfile(profile);
      setMessages(generatedMessages);
      setSelectedHistoryId(undefined);

      // Add to history
      const historyItem: OutreachHistory = {
        id: `hist-${Date.now()}`,
        profile,
        messages: generatedMessages,
        createdAt: new Date(),
      };
      setHistory(prev => [historyItem, ...prev]);
      toast.success("Outreach generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate outreach. Is Ollama running locally?", {
        description: "Make sure 'ollama serve' is running and you have pulled a model (e.g. 'ollama pull mistral')."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: OutreachHistory) => {
    setCurrentProfile(item.profile);
    setMessages(item.messages);
    setSelectedHistoryId(item.id);
    setSidebarOpen(false);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    if (selectedHistoryId === id) {
      setCurrentProfile(null);
      setMessages([]);
      setSelectedHistoryId(undefined);
    }
  };

  const handleReset = () => {
    setCurrentProfile(null);
    setMessages([]);
    setSelectedHistoryId(undefined);
  };

  const SidebarContent = (
    <HistorySidebar
      history={history}
      onSelect={handleSelectHistory}
      onDelete={handleDeleteHistory}
      selectedId={selectedHistoryId}
    />
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-72 border-r border-border flex-shrink-0">
          {SidebarContent}
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  {SidebarContent}
                </SheetContent>
              </Sheet>
            )}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none">OutreachAI</h1>
                <p className="text-xs text-muted-foreground">Hyper-Personalized Cold Outreach</p>
              </div>
            </div>
          </div>

          {currentProfile && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              New Outreach
            </Button>
          )}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            {!currentProfile ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                {/* Hero Section */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                  >
                    <Zap className="h-4 w-4" />
                    Powered by Offline LLM
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    Generate Personalized Outreach
                    <span className="block bg-gradient-primary bg-clip-text text-transparent">
                      In Seconds
                    </span>
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    Input a LinkedIn profile or paste information about your target.
                    Our AI analyzes their style and generates tone-matched messages across all channels.
                  </p>
                </div>

                <ProfileInput onGenerate={handleGenerate} isLoading={isLoading} />

                {/* Features Preview */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: <Mail className="h-5 w-5" />, label: "Email" },
                    { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
                    { icon: <MessageCircle className="h-5 w-5" />, label: "WhatsApp" },
                  ].map((channel, i) => (
                    <motion.div
                      key={channel.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="p-4 rounded-xl bg-card border border-border/50"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
                        {channel.icon}
                      </div>
                      <span className="text-sm font-medium">{channel.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-6xl mx-auto"
              >
                <div className="grid lg:grid-cols-[320px,1fr] gap-6">
                  {/* Persona Card */}
                  <div className="lg:sticky lg:top-6 h-fit">
                    <PersonaCard profile={currentProfile} />
                  </div>

                  {/* Messages */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Send className="h-5 w-5 text-primary" />
                        Generated Messages
                      </h3>
                    </div>

                    <Tabs defaultValue="email" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-4">
                        {Object.entries(channelConfig).map(([key, config]) => (
                          <TabsTrigger key={key} value={key} className="gap-2">
                            <span className={config.color}>{config.icon}</span>
                            <span className="hidden sm:inline">{config.name}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {Object.entries(channelConfig).map(([key, config]) => {
                        const message = messages.find(m => m.channel === key);
                        return (
                          <TabsContent key={key} value={key}>
                            {message && (
                              <MessageCard
                                message={message}
                                channelIcon={config.icon}
                                channelName={config.name}
                              />
                            )}
                          </TabsContent>
                        );
                      })}
                    </Tabs>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

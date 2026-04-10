import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, Linkedin, Send, Zap, ChevronLeft, Menu, Building2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileInput } from "@/components/ProfileInput";
import { PersonaCard } from "@/components/PersonaCard";
import { MessageCard } from "@/components/MessageCard";
import { HistorySidebar } from "@/components/HistorySidebar";
import { PersonProfile, OutreachMessage, OutreachHistory } from "@/types/outreach";

import { mockHistory } from "@/data/mockData";
import { generateOutreach, analyzeProfile, AnalyzedProfile, CustomizationOptions } from "@/services/ollamaService";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SenderProfileForm, SenderProfile } from "@/components/SenderProfileForm";
import { AnalysisReviewModal } from "@/components/AnalysisReviewModal";
import { CompanyDeepDive } from "@/components/CompanyDeepDive";
import { InterviewPrepChat } from "@/components/InterviewPrepChat";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ViewToggle } from "@/components/ViewToggle";


const channelConfig = {
  email: { icon: <Mail className="h-4 w-4" />, name: "Email", color: "text-primary" },
  linkedin: { icon: <Linkedin className="h-4 w-4" />, name: "LinkedIn DM", color: "text-[#0A66C2]" },
  whatsapp: { icon: <MessageCircle className="h-4 w-4" />, name: "WhatsApp/SMS", color: "text-success" },
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<PersonProfile | null>(null);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [history, setHistory] = useState<OutreachHistory[]>(() => {
    const saved = localStorage.getItem("outreach_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Re-hydrate dates
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          messages: item.messages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt)
          }))
        }));
      } catch (e) {
        console.error("Failed to parse history", e);
        return [];
      }
    }
    return mockHistory;
  });

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem("outreach_history", JSON.stringify(history));
  }, [history]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [senderProfile, setSenderProfile] = useState<SenderProfile | null>(() => {
    const saved = localStorage.getItem("outreach_sender_profile");
    return saved ? JSON.parse(saved) : null;
  });
  const [showOnboarding, setShowOnboarding] = useState(!senderProfile);

  // New state for 2-step flow
  const [analyzedData, setAnalyzedData] = useState<AnalyzedProfile | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentInputContext, setCurrentInputContext] = useState<string>("");
  const [currentOtherUrl, setCurrentOtherUrl] = useState<string | undefined>();
  const [currentPurpose, setCurrentPurpose] = useState<string>("general");
  const [activeView, setActiveView] = useState("messages");
  const [activeMessageTab, setActiveMessageTab] = useState("email");


  const handleSaveSenderProfile = (data: SenderProfile) => {
    setSenderProfile(data);
    localStorage.setItem("outreach_sender_profile", JSON.stringify(data));
    setShowOnboarding(false);
    toast.success("Profile saved!");
  };

  const handleAnalyze = async (data: {
    linkedinUrl?: string;
    profileText?: string;
    otherSocialUrl?: string;
    purpose: string;
  }) => {
    setIsLoading(true);
    const inputContext = data.profileText || data.linkedinUrl || "";
    setCurrentInputContext(inputContext);
    setCurrentOtherUrl(data.otherSocialUrl);
    setCurrentPurpose(data.purpose);

    try {
      console.log("Analyzing profile for:", inputContext);
      const analysis = await analyzeProfile(inputContext, data.otherSocialUrl);
      setAnalyzedData(analysis);
      setShowReviewModal(true);
      toast.success("Profile analyzed! Review details before generation.");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze profile. Is Ollama running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAndGenerate = async (finalData: { targetDetails: AnalyzedProfile; senderProfile: SenderProfile; referenceContext?: string; customization: CustomizationOptions }) => {
    setIsLoading(true);
    // Update sender profile if changed
    handleSaveSenderProfile(finalData.senderProfile);
    setShowReviewModal(false);

    try {
      console.log("Generating outreach with confirmed details...", finalData.customization);
      const { profile, messages: generatedMessages } = await generateOutreach(
        currentInputContext,
        currentOtherUrl,
        currentPurpose,
        finalData.senderProfile,
        finalData.targetDetails,
        finalData.referenceContext,
        finalData.customization
      );

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
      toast.error("Failed to generate outreach.");
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
    setAnalyzedData(null);
    setActiveView("messages");
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

          <ThemeToggle />
          <div className="h-4 w-px bg-border mx-2" />

          {currentProfile && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              New Outreach
            </Button>
          )}

        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Welcome to OutreachAI</DialogTitle>
                <DialogDescription>
                  Let's set up your profile first. This information will be used to personalize the messages you generate.
                </DialogDescription>
              </DialogHeader>
              <SenderProfileForm onSave={handleSaveSenderProfile} initialData={senderProfile} />
            </DialogContent>
          </Dialog>

          <AnalysisReviewModal
            open={showReviewModal}
            onOpenChange={setShowReviewModal}
            analyzedData={analyzedData}
            initialSenderProfile={senderProfile}
            history={history}
            onConfirm={handleConfirmAndGenerate}
            isGenerating={isLoading}
          />

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
                <div className="text-center mb-12 pt-10">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative inline-block"
                  >
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <div className="relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-background/50 backdrop-blur-md border border-primary/20 text-primary text-sm font-medium mb-6 shadow-sm">
                      <Zap className="h-4 w-4 fill-primary" />
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-bold">
                        Ultra-Fast Offline AI
                      </span>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
                  >
                    Outreach that feels
                    <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-blue-600 bg-clip-text text-transparent pb-2">
                      Human, not AI.
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                  >
                    Analyze profiles, uncover company insights, and generate hyper-personalized
                    messages in seconds. All running local, private, and free.
                  </motion.p>
                </div>

                <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl ring-1 ring-primary/5">
                  <ProfileInput onAnalyze={handleAnalyze} isLoading={isLoading} />
                </div>

                {/* Features Preview */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: <Mail className="h-6 w-6" />, label: "Smart Email", desc: "Formal & detailed", color: "text-blue-500", bg: "bg-blue-500/10", id: "email" },
                    { icon: <Linkedin className="h-6 w-6" />, label: "LinkedIn Connect", desc: "Short & impactful", color: "text-[#0A66C2]", bg: "bg-[#0A66C2]/10", id: "linkedin" },
                    { icon: <MessageCircle className="h-6 w-6" />, label: "WhatsApp/SMS", desc: "Casual & direct", color: "text-success", bg: "bg-green-500/10", id: "whatsapp" },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      onClick={() => {
                        const input = document.querySelector('input') || document.querySelector('textarea');
                        input?.focus();
                        toast.info(`Enter a profile to generate ${feature.label} messages!`);
                      }}
                      className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors group cursor-pointer hover:shadow-lg"
                    >
                      <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{feature.label}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
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
                <div className="grid lg:grid-cols-[340px,1fr] gap-8 h-full">
                  {/* Persona Card - Sticky */}
                  <div className="hidden lg:block lg:sticky lg:top-6 h-fit space-y-6">
                    <PersonaCard profile={currentProfile} />
                    <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-sm h-9 px-2" onClick={() => { setActiveView("messages"); setActiveMessageTab("email"); }}>
                          <Mail className="mr-2 h-4 w-4 text-blue-500" /> Email Drafts
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-9 px-2" onClick={() => { setActiveView("messages"); setActiveMessageTab("linkedin"); }}>
                          <Linkedin className="mr-2 h-4 w-4 text-[#0A66C2]" /> LinkedIn Msg
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-9 px-2" onClick={() => { setActiveView("messages"); setActiveMessageTab("whatsapp"); }}>
                          <MessageCircle className="mr-2 h-4 w-4 text-green-500" /> WhatsApp
                        </Button>
                        <div className="h-px bg-border/50 my-2" />
                        <Button variant="ghost" className="w-full justify-start text-sm h-9 px-2" onClick={() => setActiveView("company")}>
                          <Building2 className="mr-2 h-4 w-4 text-purple-500" /> Company Intel
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm h-9 px-2" onClick={() => setActiveView("interview")}>
                          <MessageSquare className="mr-2 h-4 w-4 text-orange-500" /> Interview Prep
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Persona Accordion could go here */}

                  {/* Main View Area */}
                  <div className="space-y-6 min-w-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur py-2">
                      <ViewToggle
                        activeView={activeView}
                        onViewChange={setActiveView}
                        options={[
                          { id: "messages", label: "Messages", icon: Send },
                          { id: "company", label: "Deep Dive", icon: Building2 },
                          { id: "interview", label: "Interview", icon: MessageSquare },
                        ]}
                      />
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-destructive">
                          Start Over
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="min-h-[400px]"
                      >
                        {activeView === "messages" && (
                          <Tabs value={activeMessageTab} onValueChange={setActiveMessageTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1">
                              {Object.entries(channelConfig).map(([key, config]) => (
                                <TabsTrigger key={key} value={key} className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                  <span className={config.color}>{config.icon}</span>
                                  <span className="hidden sm:inline">{config.name}</span>
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            {Object.entries(channelConfig).map(([key, config]) => {
                              const message = messages.find(m => m.channel === key);
                              return (
                                <TabsContent key={key} value={key} className="mt-0">
                                  {message && (
                                    <MessageCard
                                      message={message}
                                      channelIcon={config.icon}
                                      channelName={config.name}
                                      recipientEmail={currentProfile.email}
                                    />
                                  )}
                                </TabsContent>
                              );
                            })}
                          </Tabs>
                        )}

                        {activeView === "company" && (
                          <div className="bg-card rounded-xl border shadow-sm p-6">
                            {currentProfile.companyDetails ? (
                              <CompanyDeepDive company={currentProfile.company} details={currentProfile.companyDetails} />
                            ) : (
                              <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                                <Building2 className="h-12 w-12 mb-4 opacity-20" />
                                <p>No company details available.</p>
                                <Button variant="link" onClick={() => setShowReviewModal(true)}>Retry Analysis</Button>
                              </div>
                            )}
                          </div>
                        )}

                        {activeView === "interview" && (
                          <InterviewPrepChat
                            role={currentProfile.role}
                            company={currentProfile.company}
                            skills={currentProfile.interests?.join(", ") || "General Professional"}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
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

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Target, MessageSquare, Shield, ArrowRight, Sparkles, Mail, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Target className="h-6 w-6" />,
    title: "Deep Profile Analysis",
    description: "Automatically extract and analyze public profile data to understand your prospect's role, interests, and communication style.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Tone-Matched Messaging",
    description: "Generate messages that match your prospect's preferred communication style - from formal to casual.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "100% Offline & Private",
    description: "Your data never leaves your machine. Powered by local LLM with zero external API calls.",
  },
];

const channels = [
  { icon: <Mail className="h-8 w-8" />, name: "Email", desc: "Professional cold emails" },
  { icon: <Linkedin className="h-8 w-8" />, name: "LinkedIn", desc: "Connection requests & DMs" },
  { icon: <MessageCircle className="h-8 w-8" />, name: "WhatsApp/SMS", desc: "Short personalized messages" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">OutreachAI</span>
            </div>
            <Link to="/dashboard">
              <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Offline LLM-Powered • Zero Data Sharing
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Hyper-Personalized
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Cold Outreach at Scale
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Generate deeply personalized outreach messages across Email, LinkedIn, and WhatsApp. 
            Powered by local LLM for complete privacy and control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow h-12 px-8 text-base">
                Start Generating
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Channels Section */}
      <section className="py-16 px-4 bg-gradient-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Multi-Channel Outreach</h2>
            <p className="text-muted-foreground">One profile, multiple personalized messages</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {channels.map((channel, i) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                  {channel.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{channel.name}</h3>
                <p className="text-sm text-muted-foreground">{channel.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why OutreachAI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for sales teams who value personalization, privacy, and results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-primary rounded-3xl p-8 md:p-12 text-center text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Outreach?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Stop sending generic messages. Start building genuine connections with hyper-personalized outreach.
            </p>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">OutreachAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Offline LLM-Powered Cold Outreach Engine • Built for Hackathon
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

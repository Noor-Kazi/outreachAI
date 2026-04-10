import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Target, MessageSquare, Shield, ArrowRight, Sparkles, Mail, Linkedin, MessageCircle, Star, Check } from "lucide-react";
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
  { icon: <Mail className="h-8 w-8" />, name: "Email", desc: "Professional cold emails", id: "email" },
  { icon: <Linkedin className="h-8 w-8" />, name: "LinkedIn", desc: "Connection requests & DMs", id: "linkedin" },
  { icon: <MessageCircle className="h-8 w-8" />, name: "WhatsApp", desc: "Short personalized messages", id: "whatsapp" },
];

const samples = {
  email: {
    subject: "Scaling outreach at {Company}...",
    body: "Hi {Name},\n\nI noticed you're leading sales initiatives at {Company}. Your recent expansion into the {Region} market caught my eye.\n\nWe help teams like yours automate personalization at scale without losing the human touch.\n\nWorth a quick chat?\n\nBest,\n[Your Name]"
  },
  linkedin: {
    body: "Hi {Name}, saw your post about AI in sales. I'm also exploring how local LLMs can improve data privacy in outreach.\n\nWould love to connect and share insights!\n\nBest,\n[Your Name]"
  },
  whatsapp: {
    body: "Hey {Name}, quick question - are you still hiring for the SDR role? I know a great candidate who specializes in {Field}."
  }
};

const reviews = [
  {
    name: "Sarah Jenkins",
    role: "SDR Manager",
    company: "TechFlow",
    content: "This tool saved me hours of researching prospects. The personalization is unmatched.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Account Executive",
    company: "ScaleUp",
    content: "Finally, an outreach tool that doesn't sound like a robot. My response rates doubled.",
    rating: 5
  },
  {
    name: "Emily Ross",
    role: "Founder",
    company: "StartLine",
    content: "The privacy-first approach is exactly what we needed. Runs locally, super fast.",
    rating: 5
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("email");

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

          {/* Sample Messages UI */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col gap-4">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveTab(channel.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${activeTab === channel.id
                        ? "bg-card border-primary shadow-lg scale-105"
                        : "bg-transparent border-transparent hover:bg-card/50"
                      }`}
                  >
                    <div className={`p-3 rounded-xl ${activeTab === channel.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {channel.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${activeTab === channel.id ? "text-foreground" : "text-muted-foreground"}`}>
                        {channel.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{channel.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border/50 rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[300px]"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-primary" />
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground border-b border-border/50 pb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                  <div className="w-3 h-3 rounded-full bg-green-400/20" />
                </div>
                <span className="ml-2">Generated Message Preview</span>
              </div>

              <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {activeTab === 'email' && (
                  <>
                    <span className="text-muted-foreground">Subject: </span>
                    <span className="text-foreground font-medium">{samples.email.subject}</span>
                    <br /><br />
                  </>
                )}
                <span className="text-foreground/90">
                  {
                    // @ts-ignore
                    samples[activeTab as keyof typeof samples].body
                  }
                </span>
              </div>
            </motion.div>
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

      {/* Reviews Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Loved by Sales Teams</h2>
            <p className="text-muted-foreground">Join thousands of professionals scaling their outreach</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-6 text-foreground/90 leading-relaxed">"{review.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{review.name}</div>
                    <div className="text-xs text-muted-foreground">{review.role} at {review.company}</div>
                  </div>
                </div>
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

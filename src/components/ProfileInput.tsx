import { useState } from "react";
import { motion } from "framer-motion";
import { Link, User, FileText, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileInputProps {
  onAnalyze: (data: {
    linkedinUrl?: string;
    profileText?: string;
    otherSocialUrl?: string;
    purpose: string;
  }) => void;
  isLoading: boolean;
}

export function ProfileInput({ onAnalyze, isLoading }: ProfileInputProps) {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [otherSocialUrl, setOtherSocialUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [purpose, setPurpose] = useState("general");
  const [activeTab, setActiveTab] = useState("url");

  const handleAnalyze = () => {
    if (activeTab === "url" && linkedinUrl) {
      onAnalyze({ linkedinUrl, otherSocialUrl, purpose });
    } else if (activeTab === "text" && profileText) {
      onAnalyze({ profileText, otherSocialUrl, purpose });
    }
  };

  const isValid = (activeTab === "url" && linkedinUrl.length > 10) ||
    (activeTab === "text" && profileText.length > 20);

  return (
    <Card className="border-border/50 shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-[0.03] pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5 text-primary" />
          Target Profile
        </CardTitle>
        <CardDescription>
          Enter a LinkedIn URL or paste profile information to analyze.
          You'll review the details before generating messages.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Outreach Purpose</label>
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger>
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Networking</SelectItem>
              <SelectItem value="sales">Sales / Business Development</SelectItem>
              <SelectItem value="recruiting">Recruiting / Hiring</SelectItem>
              <SelectItem value="partnership">Partnership Opportunity</SelectItem>
              <SelectItem value="investor">Investor Outreach</SelectItem>
              <SelectItem value="internship">Internship Opportunity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              LinkedIn URL
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Paste Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="h-12 text-base"
              />
              <Input
                placeholder="Other Social Media URL (e.g. Twitter, Instagram, GitHub)"
                value={otherSocialUrl}
                onChange={(e) => setOtherSocialUrl(e.target.value)}
                className="h-12 text-base"
              />
              <p className="text-xs text-muted-foreground">
                We'll analyze public profile data to personalize outreach
              </p>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Paste profile information, bio, about section, recent posts, or any relevant details about the person..."
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                className="min-h-[160px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Include name, role, company, interests, and communication style hints
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleAnalyze}
            disabled={!isValid || isLoading}
            className="w-full h-12 mt-4 bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium shadow-glow transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Profile...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze Profile
              </>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

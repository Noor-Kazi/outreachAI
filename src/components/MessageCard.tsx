import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OutreachMessage } from "@/types/outreach";

interface MessageCardProps {
  message: OutreachMessage;
  channelIcon: React.ReactNode;
  channelName: string;
  onRegenerate?: () => void;
}

export function MessageCard({ message, channelIcon, channelName, onRegenerate }: MessageCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = message.subject 
      ? `Subject: ${message.subject}\n\n${message.content}`
      : message.content;
    
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              {channelIcon}
              {channelName}
            </CardTitle>
            <div className="flex items-center gap-1">
              {onRegenerate && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={onRegenerate}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-normal">
              {message.tone}
            </Badge>
            <Badge variant="secondary" className="text-xs font-normal flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {message.personalization.length} personalized touches
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {message.subject && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Subject Line</span>
              <p className="text-sm font-medium bg-muted/50 p-2 rounded-md">
                {message.subject}
              </p>
            </div>
          )}
          
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Message</span>
            <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 p-3 rounded-md border border-border/50">
              {message.content}
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground font-medium">Call to Action</span>
            <p className="text-sm text-primary font-medium mt-1">
              {message.cta}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground font-medium">Personalization Points</span>
            <div className="flex flex-wrap gap-1">
              {message.personalization.map((point, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-normal bg-primary/5">
                  {point}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

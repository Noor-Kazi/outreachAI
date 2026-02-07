import { motion } from "framer-motion";
import { Briefcase, Building2, TrendingUp, MessageSquare, Tag, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PersonProfile } from "@/types/outreach";

interface PersonaCardProps {
  profile: PersonProfile;
}

export function PersonaCard({ profile }: PersonaCardProps) {
  const getSeniorityColor = (seniority: string) => {
    const colors: Record<string, string> = {
      'Student': 'bg-secondary text-secondary-foreground',
      'Junior': 'bg-primary/10 text-primary',
      'Mid-level': 'bg-primary/20 text-primary',
      'Senior': 'bg-accent/20 text-accent',
      'Executive': 'bg-warning/20 text-warning',
      'Founder': 'bg-gradient-primary text-primary-foreground',
    };
    return colors[seniority] || 'bg-muted text-muted-foreground';
  };

  const getToneColor = (style: string) => {
    const colors: Record<string, string> = {
      'Formal': 'bg-secondary text-secondary-foreground',
      'Professional': 'bg-primary/10 text-primary',
      'Casual': 'bg-success/20 text-success',
      'Friendly': 'bg-accent/20 text-accent',
    };
    return colors[style] || 'bg-muted text-muted-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-[0.03] pointer-events-none" />
        <CardHeader className="relative pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Analyzed Persona
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={profile.profileImage} alt={profile.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-semibold">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{profile.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {profile.role}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {profile.company}
              </p>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Seniority
              </span>
              <Badge className={getSeniorityColor(profile.seniority)}>
                {profile.seniority}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Tone
              </span>
              <Badge className={getToneColor(profile.communicationStyle)}>
                {profile.communicationStyle}
              </Badge>
            </div>
          </div>

          {/* Industry */}
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Industry
            </span>
            <Badge variant="outline" className="font-normal">
              {profile.industry}
            </Badge>
          </div>

          {/* Interests */}
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">Interests & Topics</span>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="font-normal text-xs"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">Profile Summary</span>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {profile.summary}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

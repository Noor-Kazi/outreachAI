import { motion } from "framer-motion";
import { Briefcase, Building2, TrendingUp, MessageSquare, Tag, Sparkles, Lightbulb } from "lucide-react";
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
              <AvatarImage src={profile.profileImage} alt={profile.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-semibold">
                {profile.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
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

          {/* Industry & Location */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Industry
              </span>
              <Badge variant="outline" className="font-normal">
                {profile.industry}
              </Badge>
            </div>
            {profile.location && (
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Location
                </span>
                <p className="text-sm font-medium truncate">{profile.location}</p>
              </div>
            )}
          </div>

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Languages</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.languages.map((lang, i) => (
                  <Badge key={i} variant="outline" className="font-normal text-xs bg-muted/50">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Strategy & Psychology */}
          {(profile.psychologicalProfile || profile.recommendedStrategy || (profile.personalHooks && profile.personalHooks.length > 0)) && (
            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                <Lightbulb className="h-4 w-4" />
                Strategy & Psychology
              </div>

              {profile.psychologicalProfile && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Archetype</span>
                  <p className="text-sm font-medium">{profile.psychologicalProfile}</p>
                </div>
              )}

              {profile.recommendedStrategy && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Approach</span>
                  <p className="text-sm italic text-muted-foreground">"{profile.recommendedStrategy}"</p>
                </div>
              )}

              {profile.personalHooks && profile.personalHooks.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Personal Hooks</span>
                  <ul className="text-xs list-disc pl-4 space-y-1 text-muted-foreground">
                    {profile.personalHooks.map((hook, i) => (
                      <li key={i}>{hook}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Certifications</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.certifications.map((cert, i) => (
                  <Badge key={i} variant="secondary" className="font-normal text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {profile.recommendations && (
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Recommendations</span>
              <p className="text-xs text-muted-foreground italic line-clamp-2">
                "{profile.recommendations}"
              </p>
            </div>
          )}

          {/* Skills / Interests */}
          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">Skills & Interests</span>
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

          {/* Similar Profiles */}
          {profile.similarProfiles && profile.similarProfiles.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                Similar Profiles
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.similarProfiles.map((name, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div >
  );
}

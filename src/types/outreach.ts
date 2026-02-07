export interface PersonProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  industry: string;
  seniority: 'Student' | 'Junior' | 'Mid-level' | 'Senior' | 'Executive' | 'Founder';
  communicationStyle: 'Formal' | 'Professional' | 'Casual' | 'Friendly';
  interests: string[];
  summary: string;
  linkedinUrl?: string;
  profileImage?: string;
  recentActivity?: string[];
}

export interface OutreachMessage {
  id: string;
  channel: 'email' | 'whatsapp' | 'linkedin' | 'instagram' | 'sms';
  subject?: string;
  content: string;
  tone: string;
  personalization: string[];
  cta: string;
  createdAt: Date;
}

export interface OutreachHistory {
  id: string;
  profile: PersonProfile;
  messages: OutreachMessage[];
  createdAt: Date;
}

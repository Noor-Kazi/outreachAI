export interface CompanyDetails {
  description: string;
  products: string[];
  culture: string;
  competitors: string[];
  recentNews: string[];
}

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
  email?: string;
  location?: string;
  languages?: string[];
  certifications?: string[];
  recommendations?: string;
  recentActivity?: string[];
  companyDetails?: CompanyDetails;
  psychologicalProfile?: string; // New: INTP, data-driven, value-oriented, etc.
  personalHooks?: string[]; // New: Specific topics they care about (e.g. "Uses Obsidian", "Marathon runner")
  recommendedStrategy?: string; // New: Strategy for outreach (e.g. "Lead with efficiency gains")
  similarProfiles?: string[]; // Added
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

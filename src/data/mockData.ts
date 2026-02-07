import { PersonProfile, OutreachMessage, OutreachHistory } from "@/types/outreach";

export const mockProfiles: PersonProfile[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Head of Growth",
    company: "TechFlow AI",
    industry: "AI/SaaS",
    seniority: "Senior",
    communicationStyle: "Professional",
    interests: ["AI automation", "B2B sales", "product-led growth", "startup scaling"],
    summary: "Growth leader passionate about leveraging AI to accelerate B2B sales. Previously scaled two startups from 0-$10M ARR. Strong believer in data-driven decision making and authentic relationship building.",
    recentActivity: ["Posted about AI in sales", "Shared article on PLG strategies"],
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Founder & CEO",
    company: "DevTools.io",
    industry: "Developer Tools",
    seniority: "Founder",
    communicationStyle: "Casual",
    interests: ["developer experience", "open source", "bootstrapping", "technical writing"],
    summary: "Ex-Google engineer turned founder. Building the next generation of developer tools. Ships fast, writes about startup lessons, believes in building in public. Loves dad jokes and memes.",
    recentActivity: ["Launched new feature", "Tweeted about hiring"],
  },
  {
    id: "3",
    name: "Priya Sharma",
    role: "VP of Marketing",
    company: "FinanceHub",
    industry: "FinTech",
    seniority: "Executive",
    communicationStyle: "Formal",
    interests: ["financial literacy", "brand building", "content marketing", "thought leadership"],
    summary: "Marketing executive with 15+ years in financial services. Focused on building trust through educational content and thought leadership. Values precision, compliance, and meaningful connections.",
    recentActivity: ["Published whitepaper on fintech trends"],
  },
];

export const generateMockMessages = (profile: PersonProfile): OutreachMessage[] => {
  const isFormral = profile.communicationStyle === "Formal";
  const isCasual = profile.communicationStyle === "Casual";
  
  return [
    {
      id: `${profile.id}-email`,
      channel: "email",
      subject: isCasual 
        ? `Quick thought about ${profile.interests[0]} 🚀`
        : `Collaboration Opportunity - ${profile.interests[0]}`,
      content: isCasual
        ? `Hey ${profile.name.split(' ')[0]}! 👋

Saw your recent work on ${profile.interests[0]} at ${profile.company} - seriously impressive stuff!

I've been working on something that might be right up your alley, especially given your focus on ${profile.interests[1]}.

Would love to bounce some ideas off you if you're up for it. No pressure, just a quick chat between folks who geek out about the same stuff.

What do you say?`
        : `Dear ${profile.name.split(' ')[0]},

I hope this message finds you well. I've been following ${profile.company}'s innovative work in ${profile.industry}, particularly your team's approach to ${profile.interests[0]}.

Given your expertise in ${profile.interests[1]} and your role leading ${profile.role.toLowerCase()} initiatives, I believe there could be valuable synergies between our organizations.

I would welcome the opportunity to schedule a brief call to explore potential collaboration.

Best regards`,
      tone: profile.communicationStyle,
      personalization: [profile.role, profile.company, profile.interests[0], profile.industry],
      cta: "Schedule a 15-minute call",
      createdAt: new Date(),
    },
    {
      id: `${profile.id}-linkedin`,
      channel: "linkedin",
      content: isCasual
        ? `${profile.name.split(' ')[0]}! Loved your take on ${profile.interests[0]}. Working on something similar at my end - think we should connect! 🤝`
        : `${profile.name.split(' ')[0]}, I was impressed by ${profile.company}'s approach to ${profile.interests[0]}. Given your background in ${profile.industry}, I believe a brief conversation could be mutually beneficial. Would you be open to connecting?`,
      tone: profile.communicationStyle,
      personalization: [profile.name, profile.interests[0], profile.company],
      cta: "Accept connection request",
      createdAt: new Date(),
    },
    {
      id: `${profile.id}-whatsapp`,
      channel: "whatsapp",
      content: isCasual
        ? `Hey ${profile.name.split(' ')[0]}! 👋 Got your number from the ${profile.industry} meetup. Your work at ${profile.company} on ${profile.interests[0]} is 🔥. Would love to chat sometime - free for a quick call this week?`
        : `Hello ${profile.name.split(' ')[0]}, I hope you don't mind me reaching out. I obtained your contact through our mutual connection in the ${profile.industry} space. I've been following ${profile.company}'s work and would value the opportunity for a brief discussion about ${profile.interests[0]}. Would you have 10 minutes this week?`,
      tone: profile.communicationStyle,
      personalization: [profile.name, profile.industry, profile.company, profile.interests[0]],
      cta: "Confirm availability for call",
      createdAt: new Date(),
    },
  ];
};

export const mockHistory: OutreachHistory[] = [
  {
    id: "hist-1",
    profile: mockProfiles[1],
    messages: generateMockMessages(mockProfiles[1]),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "hist-2",
    profile: mockProfiles[2],
    messages: generateMockMessages(mockProfiles[2]),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

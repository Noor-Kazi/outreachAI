import { PersonProfile, OutreachMessage } from "@/types/outreach";

const OLLAMA_API_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "mistral"; // Default model

interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

export interface AnalyzedProfile {
    currentCompany: string;
    previousCompany: string;
    role: string;
    skills: string;
    education: string;
    location: string;
    languages: string;
    certifications: string;
    recommendations: string;
    profilePhotoUrl: string;
    summary: string;
}

export const analyzeProfile = async (
    inputContext: string,
    otherSocialUrl?: string
): Promise<AnalyzedProfile> => {
    const prompt = `
    You are an expert data analyst and recruiter.
    Your task is to extract specific professional details from the provided text or social media context.
    
    Input Context: "${inputContext}"
    Other Social Media: "${otherSocialUrl || "None"}"

    Extract the following information and return strictly valid JSON:
    
    {
        "currentCompany": "Name of current company or 'Not found'",
        "previousCompany": "Name of previous company or 'Not found'",
        "role": "Current job title (normalize to standard industry terms) or 'Not found'",
        "skills": "List of key hard and soft skills (normalize to comma separated list) or 'Not found'",
        "education": "University/Degree or 'Not found'",
        "location": "City, Country or 'Not found'",
        "languages": "List of languages spoken (comma separated) or 'Not found'",
        "certifications": "List of key certifications (comma separated) or 'Not found'",
        "recommendations": "Brief summary of recommendations or 'Not found'",
        "profilePhotoUrl": "URL of profile photo if explicitly present in text/JSON, otherwise 'Not found'",
        "summary": "Values-driven professional summary (max 2 sentences) inferred from experience"
    }
    
    Rules:
    - Infer missing details CAREFULLY from context. Do not halluncinate.
    - Normalize titles (e.g., "Sr. Eng." -> "Senior Engineer").
    - If "Other Social Media" provides clues (e.g. github -> developer actions), use them.
    - Do NOT include markdown. Just JSON.
    `;

    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: prompt,
                stream: false,
                format: "json",
            }),
        });

        if (!response.ok) throw new Error(`Ollama Analysis Error: ${response.statusText}`);

        const data: OllamaResponse = await response.json();
        let jsonString = data.response.trim();

        // Clean up potential markdown code blocks
        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonString.startsWith("```")) {
            jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Analysis Failed:", error);
        return {
            currentCompany: "",
            previousCompany: "",
            role: "",
            skills: "",
            education: "",
            location: "",
            languages: "",
            certifications: "",
            recommendations: "",
            profilePhotoUrl: "",
            summary: "Could not analyze profile.",
        };
    }
};

export const generateOutreach = async (
    inputContext: string,
    otherSocialUrl?: string,
    purpose: string = "general",
    senderProfile?: { name: string; status?: string; role: string; company: string; skills: string; } | null,
    targetDetails?: {
        currentCompany?: string;
        previousCompany?: string;
        role?: string;
        skills?: string;
        education?: string;
        location?: string;
        languages?: string;
        certifications?: string;
        recommendations?: string;
        summary?: string;
        profilePhotoUrl?: string;
    }
): Promise<{ profile: PersonProfile; messages: OutreachMessage[] }> => {
    const prompt = `
    You are an expert sales development representative (SDR) AI. 
    Your task is to analyze the provided input text about a person and generate a detailed professional profile and 3 distinct outreach messages (Email, LinkedIn connection request, and WhatsApp/SMS).

    Input Context: "${inputContext}"
    Other Social Media: "${otherSocialUrl || "None"}"
    Outreach Purpose: "${purpose}"
    
    My (Sender) Profile:
    - Name: ${senderProfile?.name || "Not provided"}
    - Status: ${senderProfile?.status || "Professional"}
    - Role/Major: ${senderProfile?.role || "Not provided"}
    - Company/University: ${senderProfile?.company || "Not provided"}
    - Skills: ${senderProfile?.skills || "Not provided"}

    Target Manual Details (PRIORITIZE THESE):
    - Current Company: ${targetDetails?.currentCompany || "Infer from context"}
    - Previous Company: ${targetDetails?.previousCompany || "Infer from context"}
    - Role: ${targetDetails?.role || "Infer from context"}
    - Skills: ${targetDetails?.skills || "Infer from context"}
    - Education: ${targetDetails?.education || "Infer from context"}
    - Location: ${targetDetails?.location || "Infer from context"}
    - Languages: ${targetDetails?.languages || "Infer from context"}
    - Certifications: ${targetDetails?.certifications || "Infer from context"}
    - Recommendations: ${targetDetails?.recommendations || "Infer from context"}
    - Summary: ${targetDetails?.summary || "Infer from context"}
    
    You must output strictly valid JSON. Do not include any markdown formatting (like \`\`\`json). 
    The JSON structure must match the following interfaces:

    interface PersonProfile {
      id: string; // Generate a random UUID
      name: string; // Infer from context or generate a realistic one
      role: string; // Infer from context
      company: string; // Infer from context
      industry: string; // Infer from context
      seniority: 'Student' | 'Junior' | 'Mid-level' | 'Senior' | 'Executive' | 'Founder';
      communicationStyle: 'Formal' | 'Professional' | 'Casual' | 'Friendly';
      interests: string[]; // List 3-5 relevant professional interests
      summary: string; // A brief professional summary (2-3 sentences)
      linkedinUrl?: string; // Generate a placeholder URL if not provided
      profileImage?: string; // Use "${targetDetails?.profilePhotoUrl}" if valid, else leave empty or null.
      location?: string; // Use manual details or infer
      languages?: string[]; // Use manual details or infer (return as array)
      certifications?: string[]; // Use manual details or infer (return as array)
      recentActivity?: string[]; // Generate 2 realistic recent activities (e.g., "Posted about X", "Attended Y conference")
    }

    interface OutreachMessage {
      id: string; // Generate a random ID
      channel: 'email' | 'whatsapp' | 'linkedin';
      subject?: string; // Required for email
      content: string; // The specific message content. 
      tone: string; // Should match the profile's communicationStyle
      personalization: string[]; // List specific points used for personalization
      cta: string; // Call to action
      createdAt: string; // ISO date string
    }

    Return a JSON object with this structure:
    {
      "profile": PersonProfile,
      "messages": OutreachMessage[] // Array of 3 messages: one 'email', one 'linkedin', one 'whatsapp'
    }

    Rules:
    - Tailor the messages to the outreach purpose: "${purpose}".
    - If I am a Student, tone should be humble, eager to learn, and professional.
    - If I am a Professional, tone should be peer-to-peer and value-driven.
    - Sign off the messages with my name: "${senderProfile?.name || "Name"}" and role/company if appropriate.
    - Mention my relevant skills (${senderProfile?.skills || "none"}) if they align with the target's needs or interests.
    - Highlight shared locations, languages, or certifications if present.
    - If "Other Social Media" is provided, check if you can infer any interests from the URL structure (e.g. github -> dev), otherwise ignore it.
    - If the input is vague, infer reasonable details to make a complete profile.
    - The 'email' message should be longer and more formal.
    - The 'linkedin' message should be short (under 300 chars) and connection-focused.
    - The 'whatsapp' message should be casual and direct.
    - Ensure 'createdAt' is a valid ISO string.
    - Do NOT wrap the output in markdown. Just raw JSON.
  `;

    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: prompt,
                stream: false, // We want the full response at once
                format: "json", // Enforce JSON mode if supported by the model/checkpoints
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data: OllamaResponse = await response.json();
        let jsonString = data.response.trim();

        // Clean up potential markdown code blocks if the model ignores the instruction
        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonString.startsWith("```")) {
            jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const parsedData = JSON.parse(jsonString);

        // Basic validation / transformation
        return {
            profile: {
                ...parsedData.profile,
                // Ensure enum validity fallback
                seniority: ["Student", "Junior", "Mid-level", "Senior", "Executive", "Founder"].includes(parsedData.profile.seniority)
                    ? parsedData.profile.seniority
                    : "Senior",
                communicationStyle: ["Formal", "Professional", "Casual", "Friendly"].includes(parsedData.profile.communicationStyle)
                    ? parsedData.profile.communicationStyle
                    : "Professional",
            },
            messages: parsedData.messages.map((msg: OutreachMessage) => ({
                ...msg,
                createdAt: new Date(msg.createdAt), // Convert string back to Date object
            })),
        };

    } catch (error) {
        console.error("Failed to generate outreach:", error);
        throw error;
    }
};

import { PersonProfile, OutreachMessage } from "@/types/outreach";

const OLLAMA_API_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "mistral"; // Default model

interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

export const generateOutreach = async (
    inputContext: string
): Promise<{ profile: PersonProfile; messages: OutreachMessage[] }> => {
    const prompt = `
    You are an expert sales development representative (SDR) AI. 
    Your task is to analyze the provided input text about a person and generate a detailed professional profile and 3 distinct outreach messages (Email, LinkedIn connection request, and WhatsApp/SMS).

    Input Context: "${inputContext}"

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
            messages: parsedData.messages.map((msg: any) => ({
                ...msg,
                createdAt: new Date(msg.createdAt), // Convert string back to Date object
            })),
        };

    } catch (error) {
        console.error("Failed to generate outreach:", error);
        throw error;
    }
};

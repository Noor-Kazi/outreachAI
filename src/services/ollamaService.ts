import { PersonProfile, OutreachMessage } from "@/types/outreach";

const OLLAMA_API_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3.2:1b"; // Optimized for speed (1B version). Alternatives: "llama3.2" (3B), "mistral", "gemma2"

interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

export interface AnalyzedProfile {
    name: string; // Added name field
    currentCompany: string;
    previousCompany: string;
    role: string;
    industry: string;
    skills: string;
    education: string;
    location: string;
    email: string;
    languages: string;
    certifications: string;
    recommendations: string;
    profilePhotoUrl: string;
    summary: string;
    companyDetails?: {
        description: string;
        products: string[];
        culture: string;
        competitors: string[];
        recentNews: string[];
    };
    contentThemes: string[]; // Added content themes
    similarProfiles: string[];
    psychologicalProfile: string;
    personalHooks: string[];
    recommendedStrategy: string;
}

const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 30000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

export const analyzeProfile = async (
    inputContext: string,
    otherSocialUrl?: string
): Promise<AnalyzedProfile> => {
    const prompt = `
    Role: Expert Analyst.
    Task: Extract professional details from the text below.
    
    INPUT TEXT: "${inputContext}"
    SOCIAL URL: "${otherSocialUrl || "None"}"

    INSTRUCTIONS:
    1. **STRICTLY** extract details only from the provided text.
    2. **DO NOT HALLUCINATE** or make up facts. If a detail is missing, write "Unknown".
    3. Infer Industry only if strongly implied by keywords (e.g. "React" -> "Technology").
    4. Analyze the tone to determine Psychological Profile.
    5. Find valid "Hooks": specific interests, university, hobbies, or recent posts mentioned.
    6. Return strictly valid JSON.

    REQUIRED JSON FORMAT:
    {
        "name": "Full Name OR 'Unknown'",
        "currentCompany": "Company Name OR 'Unknown'",
        "previousCompany": "Previous Company OR 'Unknown'",
        "role": "Job Title OR 'Unknown'",
        "industry": "Industry OR 'Technology'",
        "skills": "Comma separated skills",
        "education": "University/Degree OR 'Unknown'",
        "location": "City, Country OR 'Unknown'",
        "email": "Email if found OR ''",
        "languages": "Languages OR 'Unknown'",
        "certifications": "Certs OR 'Unknown'",
        "recommendations": "Brief summary OR 'None'",
        "profilePhotoUrl": "url OR ''",
        "summary": "2 sentence professional summary based ONLY on input",
        "contentThemes": ["Theme 1"],
        "similarProfiles": ["Famous person in same field"],
        "psychologicalProfile": "Adjective 1, Adjective 2",
        "personalHooks": ["Specific interest 1", "Specific school"],
        "recommendedStrategy": "One sentence outreach strategy",
        "companyDetails": {
            "description": "Brief description",
            "products": ["Product 1"],
            "culture": "Inferred culture",
            "competitors": ["Competitor 1"],
            "recentNews": ["News item 1"]
        }
    }
    `;

    try {
        const response = await fetchWithTimeout(OLLAMA_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: prompt,
                stream: false,
                format: "json",
                options: {
                    temperature: 0.1, // Low temperature for factual extraction
                    num_ctx: 4096
                }
            }),
        }, 45000);

        if (!response.ok) throw new Error(`Ollama Analysis Error: ${response.statusText}`);

        const data: OllamaResponse = await response.json();
        let jsonString = data.response.trim();

        // Clean up
        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonString.startsWith("```")) {
            jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Analysis Failed:", error);
        return {
            name: "",
            currentCompany: "",
            previousCompany: "",
            role: "",
            industry: "",
            skills: "",
            education: "",
            location: "",
            email: "",
            languages: "",
            certifications: "",
            recommendations: "",
            profilePhotoUrl: "",
            summary: "Could not analyze profile.",
            companyDetails: {
                description: "Not found",
                products: [],
                culture: "Not found",
                competitors: [],
                recentNews: []
            },
            contentThemes: [],
            similarProfiles: [],
            psychologicalProfile: "Unknown",
            personalHooks: [],
            recommendedStrategy: "General Approach"
        };
    }
};

export const analyzeWritingStyle = async (sampleText: string): Promise<string> => {
    const prompt = `
    Analyze the following writing sample and describe the writing style, tone, and formatting habits.
    
    Sample: "${sampleText}"
    
    Return a concise description (max 2 sentences) that can be used as an instruction for an AI to mimic this style.
    Example: "Casual and direct tone. Uses short sentences, lowercase for emphasis, and frequent emojis. Avoids jargon."
    `;

    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) throw new Error("Style Analysis Failed");

        const data: OllamaResponse = await response.json();
        return data.response.trim();
    } catch (error) {
        console.error("Style Analysis Error:", error);
        return "Professional and clear.";
    }
};

export interface CustomizationOptions {
    tone: string;
    length: string;
    focus: string;
}

export const generateOutreach = async (
    inputContext: string,
    otherSocialUrl?: string,
    purpose: string = "general",
    senderProfile?: { name: string; status?: string; role: string; company: string; skills: string; writingStyle?: string; } | null,
    targetDetails?: Partial<AnalyzedProfile>,
    referenceContext?: string,
    customization: CustomizationOptions = { tone: "Formal", length: "Medium", focus: "Value Proposition" }
): Promise<{ profile: PersonProfile; messages: OutreachMessage[] }> => {

    // approximate word counts - strong enforcement
    const lengthInstruction = customization.length === "Short"
        ? "Keep the email between 120-180 words. Use 2-3 concise but detailed paragraphs."
        : customization.length === "Long"
            ? "MANDATORY: The email MUST be at least 500 words. Write AT LEAST 6 full paragraphs. Each paragraph MUST be 4-6 sentences long. DO NOT be brief under any circumstances. Expand on every point with specific details, examples, and industry insights. This is the MOST IMPORTANT instruction."
            : "MANDATORY: Write a thorough, detailed email of 300-400 words minimum. Use at least 4 full paragraphs. Each paragraph MUST be 3-5 sentences long. Do NOT be brief. Expand on each point with meaningful details, specific examples, and actionable insights. Every paragraph should provide substantial value.";

    const prompt = `
    YOU ARE: ${senderProfile?.name}, ${senderProfile?.role} at ${senderProfile?.company}.
    YOU ARE WRITING TO: ${targetDetails?.name}, ${targetDetails?.role} at ${targetDetails?.currentCompany}.
    
    GOAL: Write a customized outreach email.
    
    DATA:
    Context: "${inputContext}"
    Purpose: "${purpose}"
    Relationship: "${referenceContext || "None"}"
    Target Profile: ${targetDetails?.psychologicalProfile}
    Target Strategy: ${targetDetails?.recommendedStrategy}

    CUSTOMIZATION:
    - Tone: ${customization.tone}
    - Length: ${customization.length} (${lengthInstruction})
    - Focus: ${customization.focus}

    CRITICAL INSTRUCTIONS (FOLLOW EXACTLY):
    1. **EMAIL** (THIS IS THE MOST IMPORTANT MESSAGE):
       - **IDENTITY**: You are ${senderProfile?.name}. Do NOT write as the target.
       - **LENGTH REQUIREMENT**: ${lengthInstruction}
       - **FORMATTING**: You MUST use double line breaks (\\n\\n) between every paragraph. Never write a wall of text.
       - **REQUIRED STRUCTURE** (each section MUST be a full paragraph of 2-5 sentences):
         1. **Opening Hook**: A warm, personalized greeting referencing something specific about their work, a recent achievement, or a shared connection. Make it feel genuine and researched.
         2. **Context & Relevance**: Explain why you are reaching out. Reference their industry, company, or role specifically. Show you have done your homework.
         3. **Value Proposition**: Describe clearly what you bring to the table. Be specific about mutual benefits, shared interests, or how collaboration could work.
         4. **Social Proof / Details**: Include a specific example, case study, achievement, or relevant detail that builds credibility.
         5. **Call to Action**: A clear, specific next step (e.g., "Would you be available for a 15-minute call next Tuesday?").
       - **IMPORTANT**: Do NOT write generic filler. Every sentence must add value.

    2. **LinkedIn** (Connection Request Message):
       - MANDATORY: Write 5-7 complete sentences (150-220 words).
       - Include: a warm personal greeting using their name, a specific compliment about their work or a recent post, why you want to connect with specifics about shared interests or goals, what caught your attention about their profile (mention specific achievements, projects, or skills), and a friendly closing with a clear reason to stay in touch.
       - Do NOT write just one line. Every sentence must add value and show genuine interest.
       - Make it feel like you've thoroughly read their profile.

    3. **WhatsApp** (Casual Professional Message):
       - MANDATORY: Write 5-7 sentences (150-220 words).
       - Warm, conversational, and engaging but still professional.
       - Include: a friendly intro with their name, context about how you found them or why you're reaching out, a specific detail about their work that impressed you, what you'd love to discuss or collaborate on, and a soft but clear call to action.
       - Do NOT write just "Hey!" or a couple of short sentences. Make it substantive and thoughtful.

    REQUIRED JSON FORMAT:
    {
      "profile": {
        "id": "uuid",
        "name": "${targetDetails?.name || "Target Name"}",
        "role": "${targetDetails?.role || "Target Role"}",
        "company": "${targetDetails?.currentCompany || "Target Company"}",
        "industry": "Technology",
        "seniority": "Mid-level",
        "communicationStyle": "Professional",
        "interests": ["Interest 1"],
        "summary": "Summary",
        "linkedinUrl": "url",
        "profileImage": "${targetDetails?.profilePhotoUrl || ""}",
        "location": "${targetDetails?.location || "Location"}",
        "languages": ["English"],
        "certifications": ["Cert 1"],
        "recentActivity": ["Activity 1"],
        "companyDetails": ${JSON.stringify(targetDetails?.companyDetails || { description: "Desc", products: [], culture: "Culture", competitors: [], recentNews: [] })}
      },
      "messages": [
        {
          "id": "1",
          "channel": "email",
          "subject": "Write a compelling, specific subject line based on ${customization.focus}",
          "content": "Write the FULL email body here. MUST meet the word count requirement. USE \\\\n\\\\n BETWEEN EVERY PARAGRAPH. Each paragraph must be 2-5 complete sentences.",
          "tone": "${customization.tone}",
          "personalization": ["Hook used"],
          "cta": "Call to Action",
          "createdAt": "${new Date().toISOString()}"
        },
        {
          "id": "2",
          "channel": "linkedin",
          "content": "Write a detailed, thoughtful 5-7 sentence LinkedIn connection request (150-220 words). Include specific references to their work.",
          "tone": "${customization.tone}",
          "personalization": ["Context"],
          "cta": "Connect",
          "createdAt": "${new Date().toISOString()}"
        },
        {
          "id": "3",
          "channel": "whatsapp",
          "content": "Write a warm, personalized 5-7 sentence WhatsApp message (150-220 words). Be conversational but substantive.",
          "tone": "Casual/Polite",
          "personalization": ["Context"],
          "cta": "Reply",
          "createdAt": "${new Date().toISOString()}"
        }
      ]
    }
    `;

    try {
        const response = await fetchWithTimeout(OLLAMA_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: prompt,
                stream: false,
                format: "json",
                options: {
                    temperature: 0.85,
                    num_ctx: 8192,
                    num_predict: 4096, // Allow up to 4096 tokens of output for longer messages
                    repeat_penalty: 1.1 // Discourage repetitive phrasing
                }
            }),
        }, 120000); // 120s timeout for generation

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data: OllamaResponse = await response.json();
        let jsonString = data.response.trim();

        console.log("Raw Ollama Output:", jsonString); // Added for debugging

        // Clean up potential markdown code blocks if the model ignores the instruction
        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonString.startsWith("```")) {
            jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const parsedData = JSON.parse(jsonString);
        console.log("Parsed Data:", parsedData); // Added for debugging

        // Helper to clean LLM string outputs
        const cleanContent = (str: string): string => {
            if (!str) return "";
            let cleaned = str;
            // Unescape literal \n sequences - allow for double newlines
            cleaned = cleaned.replace(/\\n/g, "\n");
            // Remove huge potential JSON wrapper artifacts if LLM puts object inside string
            if (cleaned.trim().startsWith('{') && cleaned.trim().endsWith('}')) {
                cleaned = cleaned.replace(/^\s*{\s*/, "").replace(/\s*}\s*$/, "");
                cleaned = cleaned.replace(/"[^"]+":\s*"/, "").replace(/"$/, "");
            }
            // Remove starting/ending quotes if double quoted
            // CAREFUL: This might strip quotes inside the content if not handled well, but for now strict replace is okay for wrapping quotes
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                cleaned = cleaned.slice(1, -1);
            }
            return cleaned.trim();
        };

        return {
            profile: {
                ...parsedData.profile,
                name: targetDetails?.name || parsedData.profile.name,
                industry: targetDetails?.industry || parsedData.profile.industry || "Technology",
                // Ensure enum validity fallback
                seniority: ["Student", "Junior", "Mid-level", "Senior", "Executive", "Founder"].includes(parsedData.profile.seniority)
                    ? parsedData.profile.seniority
                    : "Mid-level",
                communicationStyle: ["Formal", "Professional", "Casual", "Friendly"].includes(parsedData.profile.communicationStyle)
                    ? parsedData.profile.communicationStyle
                    : "Professional",
                profileImage: parsedData.profile.profileImage || targetDetails?.profilePhotoUrl,
                email: targetDetails?.email, // Pass email through
                similarProfiles: targetDetails?.similarProfiles || [],
                psychologicalProfile: targetDetails?.psychologicalProfile,
                personalHooks: targetDetails?.personalHooks,
                recommendedStrategy: targetDetails?.recommendedStrategy,
            },
            messages: parsedData.messages.map((msg: any) => ({
                ...msg,
                content: cleanContent(msg.content),
                cta: cleanContent(msg.cta),
                subject: msg.subject ? cleanContent(msg.subject) : undefined
            }))
        };
    } catch (error) {
        console.error("Generation Failed:", error);
        throw error;
    }
};

export interface InterviewQuestion {
    id: string;
    question: string;
    type: 'Behavioral' | 'Technical' | 'Situational';
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const generateInterviewQuestions = async (
    role: string,
    company: string,
    skills: string
): Promise<InterviewQuestion[]> => {
    const prompt = `
    Act as a senior technical recruiter for ${company}.
    Create 5 challenging and relevant interview questions for a ${role} role.
    Candidate skills: ${skills}.

    Mix of Technical (hard skills), Behavioral (STAR method), and Situational.
    
    Return strictly valid JSON array:
    [
      {
        "id": "uuid",
        "question": "Question text",
        "type": "Behavioral" | "Technical" | "Situational",
        "difficulty": "Easy" | "Medium" | "Hard"
      }
    ]
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

        if (!response.ok) throw new Error(`Ollama API error: ${response.statusText}`);

        const data: OllamaResponse = await response.json();
        let jsonString = data.response.trim();

        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonString.startsWith("```")) {
            jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const questions = JSON.parse(jsonString);
        // Ensure it's an array, sometimes LLMs wrap in { questions: [] }
        return Array.isArray(questions) ? questions : (questions.questions || []);

    } catch (error) {
        console.error("Failed to generate interview questions:", error);
        return [
            { id: "1", question: "Tell me about yourself.", type: "Behavioral", difficulty: "Easy" },
            { id: "2", question: "Why do you want to work here?", type: "Behavioral", difficulty: "Easy" },
            { id: "3", question: "What are your greatest strengths?", type: "Behavioral", difficulty: "Easy" }
        ];
    }
};

export const getInterviewFeedback = async (
    question: string,
    answer: string
): Promise<string> => {
    const prompt = `
    You are an expert interviewer.
    Question: "${question}"
    Candidate Answer: "${answer}"

    Provide brief, constructive feedback on the answer. 
    Highlight what was good and what could be improved.
    Keep it under 3 sentences.
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

        // Handle non-JSON response gracefully since we just want text often
        if (!response.ok) throw new Error("Ollama API error");

        const data: OllamaResponse = await response.json();
        return data.response.trim();

    } catch (error) {
        console.error("Feedback error:", error);
        return "Good attempt. Try to be more specific about your impact.";
    }
};



import { generateOutreach } from "../src/services/ollamaService";

async function testGeneration() {
    console.log("Starting generation test...");
    try {
        const result = await generateOutreach(
            "John Doe is a software engineer at Google. He loves React and TypeScript.",
            "https://linkedin.com/in/johndoe",
            "recruiting",
            {
                name: "Jane Smith",
                status: "professional",
                role: "Recruiter",
                company: "TechCorp",
                skills: "Hiring, Sourcing",
                writingStyle: "Professional"
            },
            {
                name: "John Doe",
                currentCompany: "Google",
                role: "Software Engineer",
                psychologicalProfile: "Tech-focused",
                personalHooks: ["React", "TypeScript"],
                recommendedStrategy: "Direct technical approach",
                contentThemes: ["Engineering", "Web Dev"]
            }
        );
        console.log("Generation Successful!");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Generation Failed:", error);
    }
}

testGeneration();

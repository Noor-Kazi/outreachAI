import { analyzeProfile } from "../src/services/ollamaService";

async function testAnalysis() {
    console.log("Starting analysis test...");
    const bio = `
    Jane Doe is a Senior Product Manager at TechFlow. 
    She is passionate about AI and user experience. 
    She previously worked at DataCorp as a Data Analyst.
    She studied Computer Science at Stanford.
    She lives in San Francisco.
    She posts often about product strategy and remote work.
    `;

    try {
        const result = await analyzeProfile(bio, "https://twitter.com/janedoe");
        console.log("Analysis Successful!");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Analysis Failed:", error);
    }
}

testAnalysis();

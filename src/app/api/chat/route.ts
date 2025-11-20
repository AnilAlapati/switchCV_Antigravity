import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const SYSTEM_PROMPT = `
You are an expert Resume Builder Agent. Your goal is to interview the user to gather information for a high-impact, professional resume.
You should ask one question at a time.
Start by asking for their full name if you don't have it.
Then ask about their:
1. Current Role & Company
2. Key Achievements (ask for metrics/impact)
3. Tech Stack / Skills
4. Education

Once you have enough information, or if the user says "I'm done", you MUST generate the resume in the following JSON format wrapped in \`\`\`json ... \`\`\`:

{
  "fullName": "...",
  "role": "...",
  "summary": "...",
  "experience": [
    { "company": "...", "role": "...", "duration": "...", "description": ["..."] }
  ],
  "skills": ["..."],
  "education": [{ "school": "...", "degree": "...", "year": "..." }]
}

Be friendly, professional, and encouraging.
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to help you build your resume. What is your full name?" }],
                },
                ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
                    role: m.role === "user" ? "user" : "model",
                    parts: [{ text: m.content }],
                })),
            ],
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const responseText = result.response.text();

        // Check for JSON in the response
        let resumeData = null;
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);

        if (jsonMatch) {
            try {
                resumeData = JSON.parse(jsonMatch[1]);
            } catch (e) {
                console.error("Failed to parse resume JSON", e);
            }
        }

        return NextResponse.json({ response: responseText, resumeData });
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
    }
}

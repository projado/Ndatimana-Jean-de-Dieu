
import { GoogleGenAI, Type } from "@google/genai";
import { Scholarship, VisaDetails, SATQuestion, TestConfig } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are Projado Edu's expert educational consultant AI. 
Your target audience is students and professionals from Rwanda who want to study abroad.
You are helpful, encouraging, and knowledgeable about international education systems (USA, Canada, UK, China, Europe, Australia).
Key responsibilities:
1. Guide users on university applications, visa processes (specifically for Rwandan citizens), and standardized tests (IELTS, TOEFL, GRE).
2. Provide information on scholarships available for African/Rwandan students (e.g., Chevening, Fulbright, MasterCard Foundation).
3. Be realistic about costs and proof of funds requirements.
4. Always maintain a professional yet warm tone.
5. If asked about specific visa centers, mention locations relevant to Rwanda (e.g., US Embassy in Kacyiru, VFS Global in Kigali).
6. If users want to contact the human consultants directly, provide the email: ndaji005@gmail.com, phone: +250 793 236 678.
7. Direct users to our social media for more content:
   - Instagram: @projado1
   - Facebook: Projado Edu
   - YouTube: https://www.youtube.com/@Ndaji_11
`;

export const chatWithConsultant = async (
  message: string, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm having trouble connecting to the server right now. Please try again.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I encountered an error while processing your request. Please ensure your connection is stable.";
  }
};

export const findScholarshipsAI = async (
  field: string,
  level: string,
  country: string
): Promise<Scholarship[]> => {
  try {
    const prompt = `List 4 top scholarships for a Rwandan student wishing to study ${level} in ${field} in ${country}. 
    For each scholarship, specifically identify the 'country' where it applies, categorize the 'fundingType' as either 'Full' or 'Partial', and provide the official website URL in the 'link' field if available.
    Return the data in strict JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              amount: { type: Type.STRING },
              deadline: { type: Type.STRING },
              requirements: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              country: { type: Type.STRING },
              fundingType: { type: Type.STRING, enum: ["Full", "Partial"] },
              link: { type: Type.STRING, description: "Official website link for the scholarship" }
            },
            required: ["name", "amount", "deadline", "requirements", "country", "fundingType"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Scholarship[];
  } catch (error) {
    console.error("Scholarship Search Error:", error);
    return [];
  }
};

export const findVisaRequirementsAI = async (country: string): Promise<VisaDetails | null> => {
  try {
    const prompt = `Provide detailed student visa requirements for a Rwandan citizen planning to study in ${country}.
    Include the specific Visa Name (e.g. F1, Tier 4), typical application fee in local currency or USD, processing time, specific financial proof amounts required (Proof of Funds), 
    a list of required documents (passport, photos, admission letter, etc), where the embassy or application center is located in Rwanda (or nearest), and any health requirements (yellow fever, medical exam).
    Return the data in strict JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            country: { type: Type.STRING },
            visaType: { type: Type.STRING },
            applicationFee: { type: Type.STRING },
            processingTime: { type: Type.STRING },
            financialRequirements: { type: Type.STRING, description: "Details on bank statements or blocked accounts" },
            documents: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            embassyLocation: { type: Type.STRING, description: "Location of embassy or VAC in Rwanda/East Africa" },
            healthRequirements: { type: Type.STRING }
          },
          required: ["country", "visaType", "applicationFee", "processingTime", "financialRequirements", "documents", "embassyLocation", "healthRequirements"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as VisaDetails;
  } catch (error) {
    console.error("Visa Search Error:", error);
    return null;
  }
};

export const generateCampusVideo = async (prompt: string): Promise<string | null> => {
  try {
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await freshAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      operation = await freshAi.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      return `${videoUri}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};

export const generateSATPracticeSet = async (
  config: TestConfig,
  count: number
): Promise<SATQuestion[]> => {
  try {
    const difficultyContext = config.module === 2 
      ? (config.difficulty === 'Hard' ? "HARDER (600-800 range)" : "EASIER (200-550 range)")
      : "MIXED (Baseline Difficulty)";

    let orderingInstruction = "";
    
    if (config.section === 'ReadingWriting') {
      orderingInstruction = `
      ORDERING INSTRUCTIONS (Official Bluebook Structure):
      1. First ~20% of questions: "Words in Context" (Vocabulary).
      2. Next ~30% of questions: "Craft and Structure" & "Information and Ideas" (Main Idea, Purpose, Inference, Cross-Text connections).
      3. Next ~30% of questions: "Standard English Conventions" (Grammar, Punctuation, Verb Tense).
      4. Final ~20% of questions: "Expression of Ideas" (Rhetorical Synthesis/Student Notes, Transitions).
      `;
    } else {
      orderingInstruction = `
      ORDERING INSTRUCTIONS (Official Bluebook Structure):
      1. Start with simpler Algebra and Heart of Algebra questions.
      2. Move to Problem-Solving and Data Analysis (Tables, scatterplots).
      3. Move to Advanced Math (Non-linear equations, functions).
      4. End with Geometry and Trigonometry.
      5. Mix "Student Produced Response" (Grid-in) types towards the end.
      `;
    }

    const prompt = `Generate exactly ${count} unique Digital SAT practice questions for:
    Section: ${config.section}
    Module: ${config.module}
    Difficulty Level: ${difficultyContext}

    ${orderingInstruction}

    CRITICAL BLUEBOOK CONTENT GUIDELINES:
    1. **Reading & Writing**:
       - **Words in Context**: Short text with a blank. Options are vocabulary words.
       - **Text Structure/Purpose**: Academic texts (science, humanities) or literary narratives (older English style).
       - **Standard English Conventions**: Sentences with blanks for punctuation/grammar.
       - **Rhetorical Synthesis**: "While researching a topic, a student has taken the following notes..." -> Question: "The student wants to emphasize..."
       - Ensure 'passage' is populated for EVERY question.

    2. **Math**:
       - Use authentic SAT topics: Linear equations, systems of equations, quadratics, exponential growth, circle theorems, sohcahtoa, probability.
       - Ensure clear steps in 'explanation'.
       - Use Unicode (x², √, π, ≤) for math symbols.

    OUTPUT FORMAT:
    Return a Strict JSON Array of objects. Do not wrap in markdown code blocks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are the College Board Bluebook Exam Engine. You generate authentic, high-fidelity SAT questions ordered exactly as they appear on the real test.",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              passage: { type: Type.STRING, description: "The reading passage, data table description, or student notes" },
              questionText: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING, description: "Detailed explanation of why the correct answer is right and others are wrong." },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
            },
            required: ["id", "questionText", "options", "correctAnswerIndex", "explanation", "topic", "difficulty"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as SATQuestion[];
  } catch (error) {
    console.error("SAT Gen Error:", error);
    return [];
  }
};

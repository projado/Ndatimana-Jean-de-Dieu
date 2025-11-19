
import { GoogleGenAI, Type } from "@google/genai";
import { Scholarship, VisaDetails, SATQuestion, TestConfig, EssayAnalysis } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are Projado Edu's expert educational consultant AI. 
Your target audience is students and professionals from Rwanda who want to study abroad.
You are helpful, encouraging, and knowledgeable about international education systems (USA, Canada, UK, China, Europe, Australia).

Key responsibilities:
1. Guide users on university applications, visa processes (specifically for Rwandan citizens), and standardized tests (IELTS, TOEFL, GRE, SAT).
2. Provide information on scholarships available for African/Rwandan students (e.g., Chevening, Fulbright, MasterCard Foundation, CAS-TWAS for China).
3. Be realistic about costs and proof of funds requirements.
4. Always maintain a professional yet warm tone.
5. If asked about specific visa centers, mention locations relevant to Rwanda (e.g., US Embassy in Kacyiru, VFS Global in Kigali for Canada/UK/Schengen).
6. Mention 'Irembo' for procuring government documents (birth certificates, police clearance) when discussing application requirements.
7. If users want to contact the human consultants directly, provide the email: ndaji005@gmail.com, phone: +250 793 236 678.
8. Direct users to our social media for more content:
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
    a list of required documents (passport, photos, admission letter, police clearance from Irembo, etc), where the embassy or application center is located in Rwanda (or nearest), and any health requirements (yellow fever, medical exam).
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

export const generateDiagram = async (description: string): Promise<string | null> => {
  try {
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await freshAi.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Educational educational line diagram for SAT math question. ${description}. Black lines on white background, clear labels, minimalist geometry, textbook style.`,
      config: {
        numberOfImages: 1,
        aspectRatio: '4:3',
        outputMimeType: 'image/jpeg'
      }
    });
    
    const base64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64) {
        return `data:image/jpeg;base64,${base64}`;
    }
    return null;
  } catch (error) {
    console.error("Diagram Gen Error:", error);
    return null;
  }
};

export const analyzeEssay = async (essay: string): Promise<EssayAnalysis | null> => {
  try {
    const prompt = `
    Act as an expert college admissions counselor (Ivy League standard).
    Analyze the following college application essay / personal statement.
    
    ESSAY CONTENT:
    "${essay.substring(0, 10000)}"

    Provide a strict JSON analysis containing:
    1. 'overallScore': Number 1-10 based on impact, unique voice, and clarity.
    2. 'strengths': Array of 3-4 strings listing key strong points.
    3. 'weaknesses': Array of 3-4 strings listing areas for improvement.
    4. 'aiProbability': Number 0-100 estimating how likely this text appears AI-generated (based on generic phrasing, lack of personal anecdote, perfect but soulless grammar).
    5. 'suggestions': A paragraph of actionable advice to improve the essay.
    6. 'improvedSnippet': Rewrite the weakest sentence or paragraph to show how it could be better.
    7. 'tone': One or two words describing the tone (e.g. "Confident but Generic", "Emotional and Raw").
    8. 'humanizeTip': A specific, creative tip to make the essay sound more human and less robotic (e.g. "Share a specific memory involving a smell or sound," "Be more vulnerable about your failure").

    Return ONLY JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            aiProbability: { type: Type.NUMBER },
            suggestions: { type: Type.STRING },
            improvedSnippet: { type: Type.STRING },
            tone: { type: Type.STRING },
            humanizeTip: { type: Type.STRING }
          },
          required: ["overallScore", "strengths", "weaknesses", "aiProbability", "suggestions", "improvedSnippet", "tone", "humanizeTip"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as EssayAnalysis;
  } catch (error) {
    console.error("Essay Analysis Error:", error);
    return null;
  }
};

// Helper for parallel batch generation
const generateSATBatch = async (
  instructions: string, 
  config: TestConfig, 
  count: number,
  offset: number
): Promise<SATQuestion[]> => {
  const difficultyDesc = config.module === 2 
      ? (config.difficulty === 'Hard' ? "Hard (600-800 Difficulty)" : "Easy (200-550 Difficulty)") 
      : "Medium (Baseline)";
  
  const prompt = `Generate ${count} unique Digital SAT practice questions.
  Section: ${config.section}
  Topic Focus: ${instructions}
  Difficulty: ${difficultyDesc}

  REQUIREMENTS:
  1. Return strict JSON array.
  2. 'passage': Required for all questions. For math, include the word problem text here if applicable.
  3. 'options': Exactly 4 distinct choices.
  4. 'explanation': Concise, markdown formatted, educational.
  5. 'visualAidPrompt': Only if a geometry/graph question needs a diagram.

  Use unique IDs starting from index ${offset}.
  `;

  try {
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
              id: { type: Type.STRING },
              passage: { type: Type.STRING },
              questionText: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              visualAidPrompt: { type: Type.STRING }
            },
            required: ["id", "questionText", "options", "correctAnswerIndex", "explanation", "topic", "difficulty"]
          }
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) as SATQuestion[] : [];
  } catch (e) {
    console.error(`Batch gen error for ${instructions}`, e);
    return [];
  }
};

export const generateSATPracticeSet = async (
  config: TestConfig,
  requestedCount: number // Ignored in favor of optimized batches
): Promise<SATQuestion[]> => {
  try {
    // 1. Define Batches based on Bluebook Structure for Parallel Execution
    // This increases speed by ~5x-10x compared to sequential generation
    let batches = [];

    if (config.section === 'ReadingWriting') {
      // RW Structure: 27 Questions
      batches = [
        { count: 5, instructions: "Words in Context (Vocabulary). Short text, fill in blank." },
        { count: 6, instructions: "Craft and Structure (Text Structure, Purpose, Cross-Text Connections)." },
        { count: 6, instructions: "Information and Ideas (Central Ideas, Details, Inferences)." },
        { count: 6, instructions: "Standard English Conventions (Grammar, Punctuation, Verb Tense)." },
        { count: 4, instructions: "Expression of Ideas (Rhetorical Synthesis / Student Notes)." }
      ];
    } else {
      // Math Structure: 22 Questions
      batches = [
        { count: 6, instructions: "Algebra (Linear equations, systems, inequalities)." },
        { count: 6, instructions: "Advanced Math (Nonlinear functions, quadratics, exponential)." },
        { count: 5, instructions: "Problem-Solving and Data Analysis (Ratios, rates, probability)." },
        { count: 5, instructions: "Geometry and Trigonometry." }
      ];
    }

    // 2. Execute all batches in parallel
    let currentOffset = 0;
    const promises = batches.map(batch => {
       const p = generateSATBatch(batch.instructions, config, batch.count, currentOffset);
       currentOffset += batch.count;
       return p;
    });

    const results = await Promise.all(promises);
    
    // 3. Flatten and re-index results
    const allQuestions = results.flat().map((q, idx) => ({
        ...q,
        id: `${config.section}-${config.module}-${Date.now()}-${idx}`,
        correctAnswerIndex: Math.max(0, Math.min(3, q.correctAnswerIndex)) // Safety clamp
    }));

    // Ensure we have at least some questions even if partial failure
    return allQuestions.length > 0 ? allQuestions : [];
  } catch (error) {
    console.error("SAT Gen Error:", error);
    return [];
  }
};

import { GoogleGenAI, Type } from "@google/genai";
import { Scholarship, VisaDetails } from "../types";

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
    // Use a fresh instance to ensure the latest API key is used
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
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s poll interval
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
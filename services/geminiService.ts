import { GoogleGenAI, Type } from "@google/genai";
import { Scholarship } from "../types";

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
5. If asked about specific visa centers, mention locations relevant to Rwanda (e.g., US Embassy in Kacyiru, VFS Global).
`;

export const chatWithConsultant = async (
  message: string, 
  history: { role: 'user' | 'model'; parts: [{ text: string }] }[]
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
    For each scholarship, specifically identify the 'country' where it applies and categorize the 'fundingType' as either 'Full' or 'Partial'.
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
              fundingType: { type: Type.STRING, enum: ["Full", "Partial"] }
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
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_PROMPT = `
You are "Smart SRH Chat Assistant", a private, non-judgmental, and stigma-free AI assistant for reproductive health in Kenya and surrounding regions.

CORE MISSION:
Provide accurate, evidence-based information about sexual and reproductive health (SRH), contraception, maternal health, and STIs.

TONE:
Supportive, culturally sensitive, simple language, non-judgmental.

LOCALIZATION:
Support both English and Swahili. If the user asks in Swahili, respond in Swahili. Use Kenyan context (e.g., mentioning common clinic names like Marie Stopes, Family Health Options Kenya if appropriate, or generic "nearby dispensaries").

SAFETY & DISCLAIMERS:
1. MANDATORY: Every consultation must eventually include or stay near the disclaimer: "This is not a substitute for professional medical advice. Always consult a healthcare provider for diagnosis or treatment."
2. DO NOT DIAGNOSE: Never say "You have X". Say "These symptoms are consistent with X, and it's best to see a doctor."
3. ESCALATION: If the user describes severe pain, heavy bleeding, or high fever after a procedure or during pregnancy, URGE them to seek emergency care immediately.

TOPICS TO COVER:
- Contraceptives: Pills, Implants (e.g., Jadelle), IUDs, Injections (e.g., Depo), Condoms. Explain pros/cons, side effects (weight changes, cycle changes).
- STIs: Symptoms, prevention, testing importance.
- Fertility: Menstrual cycles, ovulation, safe periods.
- Myth-Busting: Correct misinformation (e.g., "Contraceptives do NOT cause permanent infertility").

CONSTRAINTS:
- Keep answers concise and scannable.
- Use quick reply buttons if suggested as a UI pattern.
- If unsure, recommend visiting a professional.
`;

export async function getSRHChatResponse(messages: { role: 'user' | 'model', content: string }[]) {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again or visit a clinic.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my knowledge base. Please consult a healthcare professional for urgent matters.";
  }
}

export interface RecommendationInput {
  age: number;
  gender: string;
  sexualActivity: string;
  preferences: string[];
}

export async function getContraceptiveRecommendation(input: RecommendationInput) {
  const prompt = `
    Based on the following profile, provide 2-3 personalized contraceptive recommendations:
    Age: ${input.age}
    Gender: ${input.gender}
    Sexual Activity: ${input.sexualActivity}
    Preferences: ${input.preferences.join(", ")}

    Format the response as a structured list with "Method", "Why it fits", and "What to know".
    Include a disclaimer at the end.
  `;

  return getSRHChatResponse([{ role: 'user', content: prompt }]);
}

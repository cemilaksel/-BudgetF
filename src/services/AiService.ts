import { GoogleGenAI } from "@google/genai";

export class AiService {
  private static readonly STORAGE_KEY = 'gemini_api_key';

  static getApiKey(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  static setApiKey(key: string): void {
    localStorage.setItem(this.STORAGE_KEY, key);
  }

  static removeApiKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static async validateApiKey(key: string): Promise<boolean> {
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      // Simple probe to check if the key works
      await ai.models.generateContent({ 
        model: "gemini-2.0-flash",
        contents: "ping" 
      });
      return true;
    } catch (error) {
      console.error("API Key validation failed:", error);
      return false;
    }
  }

  static async getAiAdvice(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error("API Key missing");

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({ 
        model: "gemini-2.0-flash",
        contents: prompt 
      });
      return response.text || "";
    } catch (error: any) {
      if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("invalid API key")) {
        throw new Error("API Key geçersiz, lütfen yeni key girin");
      }
      throw error;
    }
  }
}

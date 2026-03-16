import { GoogleGenAI } from "@google/genai";

export class AiService {
  private static readonly STORAGE_KEY = 'gemini_api_key';

  static getApiKey(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  static sanitizeApiKey(key: string): string {
    return key
      .trim()
      .replace(/[\n\r\t]/g, '')
      .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
      .replace(/['"]/g, '');
  }

  static setApiKey(key: string): void {
    const cleanKey = this.sanitizeApiKey(key);
    localStorage.setItem(this.STORAGE_KEY, cleanKey);
  }

  static removeApiKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static async validateApiKey(key: string): Promise<{ isValid: boolean; error?: string }> {
    try {
      const cleanKey = this.sanitizeApiKey(key);
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        const message = data.error?.message || JSON.stringify(data);
        return { 
          isValid: false, 
          error: `Hata ${response.status}: ${message}` 
        };
      }

      return { isValid: true };
    } catch (error: any) {
      console.error("API Key validation failed:", error);
      return { 
        isValid: false, 
        error: `Bağlantı hatası: ${error.message || 'Bilinmeyen bir hata oluştu'}` 
      };
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

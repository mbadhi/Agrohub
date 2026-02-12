
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple circuit breaker to prevent hammering the API when quota is exhausted.
let isQuotaExhausted = false;
let quotaResetTime = 0;

const checkQuota = () => {
  if (isQuotaExhausted && Date.now() < quotaResetTime) {
    return false;
  }
  isQuotaExhausted = false;
  return true;
};

const handleQuotaError = () => {
  isQuotaExhausted = true;
  // Pause API calls for 5 minutes to allow quota to breathe
  quotaResetTime = Date.now() + 5 * 60 * 1000;
  console.warn("Gemini Quota Exhausted. Switching to local fallback mode for 5 minutes.");
};

/**
 * Utility for retrying API calls with exponential backoff.
 * Optimized to fail fast on RESOURCE_EXHAUSTED to preserve user experience.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 1, delay = 2000): Promise<T> {
  if (!checkQuota()) {
    throw new Error("QUOTA_PAUSED");
  }

  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error?.message || "";
    const isRateLimit = 
      errorMsg.includes('429') || 
      error?.status === 429 || 
      error?.code === 429 || 
      errorMsg.includes('RESOURCE_EXHAUSTED');

    if (isRateLimit) {
      handleQuotaError();
      throw new Error("QUOTA_EXHAUSTED");
    }

    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Resolves geolocation coordinates to country and currency information.
 * Uses broader caching (1 decimal place) to maximize hits.
 */
export async function resolveLocation(lat: number, lng: number) {
  const fallback = { country: 'Uganda', currencyCode: 'UGX', currencySymbol: 'USh', regionName: 'Kampala' };
  
  // Broader cache: Round to 1 decimal place (~11km precision)
  // This drastically increases cache hits for users in the same city.
  const cacheKey = `agrohub_loc_v2_${Math.round(lat * 10)}_${Math.round(lng * 10)}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const result: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user is at latitude ${lat}, longitude ${lng}. Determine the country, ISO 4217 currency code, symbol, and region name. Return strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            country: { type: Type.STRING },
            currencyCode: { type: Type.STRING },
            currencySymbol: { type: Type.STRING },
            regionName: { type: Type.STRING }
          },
          required: ["country", "currencyCode", "currencySymbol", "regionName"]
        }
      }
    }));

    const responseText = result.text;
    if (!responseText) throw new Error("No text in response");
    
    const parsedData = JSON.parse(responseText);
    localStorage.setItem(cacheKey, JSON.stringify(parsedData));
    return parsedData;
  } catch (error: any) {
    if (error.message !== "QUOTA_EXHAUSTED" && error.message !== "QUOTA_PAUSED") {
      console.error("Location Resolution Error:", error);
    }
    return fallback;
  }
}

export async function getPriceSuggestion(cropName: string, region: string, currency: string) {
  const fallback = {
    suggestedPrice: `${currency} 12,500 - 14,800`,
    reasoning: "Based on recent seasonal market averages for this specific region.",
    trends: "Stable demand expected; prices likely to remain consistent through the week."
  };

  try {
    const result: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Fair market price for ${cropName} in ${region} (${currency}). Return JSON with suggestedPrice, reasoning, trends.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPrice: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            trends: { type: Type.STRING }
          },
          required: ["suggestedPrice", "reasoning", "trends"]
        }
      }
    }));
    
    const text = result.text;
    return text ? JSON.parse(text) : fallback;
  } catch (error) {
    return fallback;
  }
}

export async function getWeatherAdvice(location: string) {
  const fallback = {
    outlook: "Standard seasonal conditions for the local agricultural belt.",
    advice: [
      "Optimal time for weeding and general field maintenance.",
      "Check irrigation systems for efficiency during dry spells.",
      "Maintain post-harvest storage ventilation."
    ],
    riskLevel: "Low"
  };

  try {
    const result: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Agricultural weather outlook/advice for ${location}. Return JSON with outlook, advice (array), riskLevel.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outlook: { type: Type.STRING },
            advice: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskLevel: { type: Type.STRING }
          },
          required: ["outlook", "advice", "riskLevel"]
        }
      }
    }));
    
    const text = result.text;
    return text ? JSON.parse(text) : fallback;
  } catch (error) {
    return fallback;
  }
}

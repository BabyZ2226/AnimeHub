import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Fallback responses when API keys are not configured
const FALLBACK_RESPONSES = [
  "¡Hola! Parece que estoy en modo offline, pero puedo recomendarte algunos animes populares como 'Fullmetal Alchemist: Brotherhood', 'Death Note', o 'Attack on Titan'.",
  "¡Saludos! Aunque estoy en modo offline, puedo sugerirte explorar géneros como Shonen, Slice of Life, o Romance según tus gustos.",
  "¡Hey! Por ahora estoy funcionando sin conexión, pero puedo recomendarte clásicos como 'Cowboy Bebop', 'Neon Genesis Evangelion', o 'Steins;Gate'."
];

const getRandomFallbackResponse = () => {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
};

export const getAIResponse = async (query: string): Promise<string> => {
  try {
    // Try OpenAI first
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (openaiApiKey) {
      const openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true
      });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Eres SenpaiAI, un experto asistente de anime. Proporciona respuestas concisas y útiles sobre anime."
        }, {
          role: "user",
          content: query
        }],
        max_tokens: 150
      });

      return completion.choices[0]?.message?.content || getRandomFallbackResponse();
    }

    // Try Google AI as fallback
    const googleApiKey = import.meta.env.VITE_GOOGLE_AI_KEY;
    if (googleApiKey) {
      const genAI = new GoogleGenerativeAI(googleApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent([
        "Eres SenpaiAI, un experto asistente de anime. Proporciona respuestas concisas y útiles sobre anime.",
        query
      ]);
      
      return result.response.text();
    }

    // If no API keys are configured, return a fallback response
    return getRandomFallbackResponse();
  } catch (error) {
    console.error('Error getting AI response:', error);
    return getRandomFallbackResponse();
  }
};
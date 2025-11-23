import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development environments where process.env might not be set.
  // The execution environment is expected to have this variable.
  console.warn("API_KEY is not set. Using a placeholder. This will fail if you make an API call.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || ' ' });

interface ImageData {
    base64: string;
    mimeType: string;
}

export const editImageWithPrompt = async (
  originalImage: ImageData,
  prompt: string
): Promise<ImageData> => {
  const model = 'gemini-2.5-flash-image';
  
  const imagePart = {
    inlineData: {
      data: originalImage.base64,
      mimeType: originalImage.mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [imagePart, textPart],
    },
  });
  
  // The API might return text along with the image. We need to find the image part.
  if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          };
        }
      }
  }

  throw new Error("No image was generated in the response.");
};
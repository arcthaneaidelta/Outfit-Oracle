import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export async function chatWithGemini(userMessage, selectedItems, processedImages) {
  try {
    if (!API_KEY) {
      throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your Netlify Environment Variables.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare image data for Gemini Vision
    const imageParts = [];
    for (const [cat, url] of Object.entries(processedImages)) {
      if (url) {
        try {
          // Attempt to fetch image. If it fails (CORS), we just skip it rather than crashing the whole chat.
          const response = await fetch(url, { mode: 'no-cors' }); 
          // Note: 'no-cors' will return an opaque response which doesn't allow reading blob.
          // Better approach: just fetch and if it fails, catch it.
          const realResponse = await fetch(url);
          const blob = await realResponse.blob();
          const base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
          });
          imageParts.push({
            inlineData: {
              data: base64Data,
              mimeType: "image/png",
            },
          });
        } catch (imgErr) {
          console.warn(`Could not process image for ${cat}:`, imgErr);
          // We continue so the chat still works even if one image fails
        }
      }
    }

    const prompt = `
      You are a high-end fashion AI stylist for OutfitOracle.
      The user wants to see themselves wearing these clothing items.
      User Message: "${userMessage}"
      
      Instructions:
      1. Analyze the attached clothing images (if any).
      2. Based on the user's description (height, skin tone, body type), write a SHORT, highly descriptive prompt for an image generator (like DALL-E) to create a photorealistic fashion editorial photo of a person wearing these exact clothes.
      3. Your response MUST be a valid JSON object.
      
      Response Format:
      {
        "aiResponse": "Brief friendly styling advice",
        "imagePrompt": "The detailed photorealistic prompt"
      }
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Improved JSON Extraction
    try {
      const cleanJson = responseText.match(/\{[\s\S]*\}/)?.[0] || responseText;
      return JSON.parse(cleanJson);
    } catch (e) {
      // Fallback if Gemini returns plain text
      return {
        aiResponse: responseText,
        imagePrompt: userMessage // Use user message as fallback prompt
      };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export function getAIImageUrl(prompt) {
  const encodedPrompt = encodeURIComponent(prompt + " photorealistic fashion editorial, studio lighting, 8k, high quality");
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=768&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBrCTQV6wEmMVuCarcXlQVtB9J3KwYNi2Y";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function chatWithGemini(userMessage, selectedItems, processedImages) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare image data for Gemini Vision if items are selected
    const imageParts = [];
    for (const [cat, url] of Object.entries(processedImages)) {
      if (url) {
        const response = await fetch(url);
        const blob = await response.blob();
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
      }
    }

    const prompt = `
      You are a high-end fashion AI stylist for OutfitOracle.
      The user wants to see themselves wearing these clothing items.
      User Message: "${userMessage}"
      
      Instructions:
      1. Analyze the attached clothing images (if any).
      2. Based on the user's description (height, skin tone, body type), write a SHORT, highly descriptive prompt for an image generator (like DALL-E) to create a photorealistic fashion editorial photo of a person wearing these exact clothes.
      3. Your response should be in JSON format:
      {
        "aiResponse": "Brief friendly styling advice or confirmation",
        "imagePrompt": "The detailed photorealistic prompt for the model wearing the clothes"
      }
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    // Clean JSON from response (Gemini sometimes adds markdown blocks)
    const jsonStr = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to chat with AI Stylist.");
  }
}

export function getAIImageUrl(prompt) {
  // Use Pollinations.ai for free instant image generation
  const encodedPrompt = encodeURIComponent(prompt + " photorealistic fashion editorial, studio lighting, 8k, high quality");
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=768&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
}

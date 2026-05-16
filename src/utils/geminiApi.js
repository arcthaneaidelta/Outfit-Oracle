import { apiClient } from './apiClient';

export async function chatWithGemini(userMessage, selectedItems, processedImages) {
  try {
    // We send the core info to the Python backend to generate the advice/prompt
    const prompt = `
      You are a high-end fashion AI stylist for OutfitOracle.
      User Message: "${userMessage}"
      Items: ${selectedItems.map(i => i.name).join(', ')}
      
      Instructions:
      1. Analyze the user's description.
      2. Write a SHORT, highly descriptive prompt for an image generator.
      3. Your response MUST be a valid JSON object.
      
      Response Format:
      {
        "aiResponse": "Brief friendly styling advice",
        "imagePrompt": "The detailed photorealistic prompt"
      }
    `;

    const res = await apiClient.post('/ai/advice', { prompt });
    const responseText = res.text;
    
    // JSON Extraction
    try {
      const cleanJson = responseText.match(/\{[\s\S]*\}/)?.[0] || responseText;
      return JSON.parse(cleanJson);
    } catch (e) {
      return {
        aiResponse: responseText,
        imagePrompt: userMessage
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

import { client } from "@gradio/client";

export const MODELS = {
  female: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
  male: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800"
};

export const DEFAULT_MODEL_IMG_URL = MODELS.female;

export async function generateAITryOn(garmentImageUrl, garmentName, baseModelUrl = null) {
  try {
    // Switching to IDM-VTON as it is 100% better at preserving clothing details (no reimagining)
    const app = await client("yisol/IDM-VTON");
    
    // Convert clothing image URL to Blob
    const garmentResponse = await fetch(garmentImageUrl);
    const garmentBlob = await garmentResponse.blob();

    // Convert model image URL to Blob
    const modelToUse = baseModelUrl || DEFAULT_MODEL_IMG_URL;
    const modelResponse = await fetch(modelToUse);
    const modelBlob = await modelResponse.blob();

    const result = await app.predict("/tryon", [
      { 
        background: modelBlob, 
        layers: [], 
        composite: null 
      },
      garmentBlob, 
      garmentName || "clothing item", // Help the AI know exactly what it is
      true,  // is_checked (auto-masking)
      false, // is_checked_crop
      30,    // denoise_steps
      42     // seed
    ]);

    // Parse the output to get the generated image URL
    if (result && result.data && result.data[0]) {
      return result.data[0].url;
    }
    
    return null;
  } catch (error) {
    console.error("IDM-VTON API Error:", error);
    // If IDM-VTON is overloaded, we can fallback or throw
    throw new Error("AI engine is busy. Please try again in a few seconds.");
  }
}

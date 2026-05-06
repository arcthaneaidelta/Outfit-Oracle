import { client } from "@gradio/client";

// High-quality default mannequin model from OOTDiffusion examples
export const DEFAULT_MODEL_IMG_URL = "https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/2e0cca23e744c036b3905c4b6167371632942e1c/model_1.png";

export async function generateAITryOn(garmentImageUrl, category, baseModelUrl = null) {
  try {
    const app = await client("levihsu/OOTDiffusion");
    
    const catLower = category.toLowerCase();
    const isBottom = catLower.includes('bottom') || catLower === 'pants' || catLower === 'jeans';
    
    // Convert clothing image URL to Blob for the Gradio client
    const garmentResponse = await fetch(garmentImageUrl);
    const garmentBlob = await garmentResponse.blob();

    // Convert model image URL to Blob (use provided base model or default)
    const modelToUse = baseModelUrl || DEFAULT_MODEL_IMG_URL;
    const modelResponse = await fetch(modelToUse);
    const modelBlob = await modelResponse.blob();

    let result;
    if (isBottom) {
      result = await app.predict("/process_dc", [
        modelBlob,
        garmentBlob,
        "Lower-body", // Category
        1,            // n_samples
        20,           // n_steps
        2.0,          // image_scale
        -1            // seed
      ]);
    } else {
      result = await app.predict("/process_hd", [
        modelBlob,
        garmentBlob,
        1,            // n_samples
        20,           // n_steps
        2.0,          // image_scale
        -1            // seed
      ]);
    }

    // Parse the output to get the generated image URL
    if (result && result.data && result.data[0] && result.data[0].length > 0) {
      return result.data[0][0].image.url;
    }
    
    return null;
  } catch (error) {
    console.error("OOTDiffusion API Error:", error);
    throw new Error("Failed to generate AI Try-On. The public server might be busy.");
  }
}

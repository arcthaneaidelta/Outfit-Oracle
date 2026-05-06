export async function processClothingImage(imageUrl) {
  // Completely disabled heavy AI background removal to prevent site freezing.
  // Gemini AI Chat handles the background reasoning now.
  return imageUrl;
}

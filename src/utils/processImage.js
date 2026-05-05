import imglyRemoveBackground from '@imgly/background-removal';

const imageCache = new Map();

export async function processClothingImage(imageUrl) {
  if (!imageUrl) return null;
  if (imageCache.has(imageUrl)) {
    return imageCache.get(imageUrl);
  }

  try {
    const imageBlob = await imglyRemoveBackground(imageUrl);
    const transparentUrl = URL.createObjectURL(imageBlob);
    imageCache.set(imageUrl, transparentUrl);
    return transparentUrl;
  } catch (error) {
    console.error('Failed to process image with AI:', error);
    // Fallback to original image if AI processing fails
    return imageUrl;
  }
}

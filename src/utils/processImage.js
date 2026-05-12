/**
 * Processes an image to remove white/checkered backgrounds
 * and returns a transparent base64 data URL.
 */
export async function removeBackground(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Threshold-based transparency (removes whites and near-whites)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If color is very bright (white) or looks like a grey checkerboard pattern
        const brightness = (r + g + b) / 3;
        const isWhite = r > 240 && g > 240 && b > 240;
        const isGrey = Math.abs(r - g) < 5 && Math.abs(g - b) < 5 && brightness > 200 && brightness < 240;

        if (isWhite || isGrey) {
          data[i + 3] = 0; // Set alpha to 0
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => resolve(imageUrl); // Fallback
    img.src = imageUrl;
  });
}

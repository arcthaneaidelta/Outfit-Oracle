export async function analyzeGarment(imageUrl, category) {
  return new Promise((resolve) => {
    if (!imageUrl) return resolve({});

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      // 1. DOWNSCALE for performance (avoids UI freezing)
      const MAX_ANALYZE_DIM = 200;
      const scaleFactor = Math.min(1, MAX_ANALYZE_DIM / Math.max(img.width, img.height));
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

      // Single Pass: Find main bounding box
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha > 20) {
          const idx = i / 4;
          const x = idx % canvas.width;
          const y = Math.floor(idx / canvas.width);
          
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      if (minX > maxX || minY > maxY) {
        resolve({}); 
        return;
      }

      // Convert back to original scale
      const origMinX = minX / scaleFactor;
      const origMaxX = maxX / scaleFactor;
      const origMinY = minY / scaleFactor;
      const origMaxY = maxY / scaleFactor;
      
      const bboxWidth = origMaxX - origMinX;
      
      // Stage Reference
      const DUMMY_STAGE_WIDTH = 200;
      const DUMMY_STAGE_HEIGHT = 500;
      
      let targetBBoxWidthPerc;
      let anchorYPerc;

      const cat = category.toLowerCase();
      const isBottom = cat.includes('bottom') || cat === 'pants' || cat === 'jeans';

      if (isBottom) {
        targetBBoxWidthPerc = 0.60; 
        anchorYPerc = 0.44; 
      } else if (cat.includes('shoe')) {
        targetBBoxWidthPerc = 0.45;
        anchorYPerc = 0.88; 
      } else {
        targetBBoxWidthPerc = 0.80; 
        anchorYPerc = 0.16; 
      }

      const targetBBoxWidthPx = DUMMY_STAGE_WIDTH * targetBBoxWidthPerc;
      const finalScale = targetBBoxWidthPx / bboxWidth;
      
      const scaledImgWidth = img.width * finalScale;
      const scaledBBoxMinX = origMinX * finalScale;
      const scaledBBoxMinY = origMinY * finalScale;
      const scaledBBoxWidth = bboxWidth * finalScale;
      
      const stageCenterX = DUMMY_STAGE_WIDTH / 2;
      const stageAnchorY = DUMMY_STAGE_HEIGHT * anchorYPerc;

      const leftPx = stageCenterX - (scaledBBoxMinX + scaledBBoxWidth / 2);
      const topPx = stageAnchorY - scaledBBoxMinY;

      resolve({
        width: `${(scaledImgWidth / DUMMY_STAGE_WIDTH) * 100}%`,
        left: `${(leftPx / DUMMY_STAGE_WIDTH) * 100}%`,
        top: `${(topPx / DUMMY_STAGE_HEIGHT) * 100}%`,
        position: 'absolute'
      });
    };
    img.onerror = () => resolve({});
    img.src = imageUrl;
  });
}

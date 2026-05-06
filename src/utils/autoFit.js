export async function analyzeGarment(imageUrl, category) {
  return new Promise((resolve) => {
    if (!imageUrl) return resolve({});

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 10) { // Filter out extremely faint noise
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (minX > maxX || minY > maxY) {
        resolve({}); // Fallback
        return;
      }

      const bboxWidth = maxX - minX;
      const bboxHeight = maxY - minY;
      
      const DUMMY_STAGE_WIDTH = 200;
      const DUMMY_STAGE_HEIGHT = 500;
      
      let targetBBoxWidthPerc;
      let anchorYPerc;

      const cat = category.toLowerCase();
      if (cat.includes('bottom') || cat === 'pants' || cat === 'jeans') {
        targetBBoxWidthPerc = 0.45; // Pants cover ~45% of dummy width
        anchorYPerc = 0.45; // Waist is at Y=225
      } else if (cat.includes('shoe')) {
        targetBBoxWidthPerc = 0.50;
        anchorYPerc = 0.88; 
      } else {
        // Tops or Outerwear
        targetBBoxWidthPerc = 0.65; // Shirts cover ~65% of dummy width
        anchorYPerc = 0.17; // Neck is at Y=85
        if (cat.includes('outerwear') || cat.includes('jacket')) {
          targetBBoxWidthPerc = 0.75;
          anchorYPerc = 0.16;
        }
      }

      const targetBBoxWidthPx = DUMMY_STAGE_WIDTH * targetBBoxWidthPerc;
      const scale = targetBBoxWidthPx / bboxWidth;
      
      const scaledImgWidth = img.width * scale;
      const scaledImgHeight = img.height * scale;
      
      const scaledBBoxMinX = minX * scale;
      const scaledBBoxMinY = minY * scale;
      const scaledBBoxWidth = bboxWidth * scale;
      
      const stageCenterX = DUMMY_STAGE_WIDTH / 2;
      const stageAnchorY = DUMMY_STAGE_HEIGHT * anchorYPerc;

      const leftPx = stageCenterX - (scaledBBoxMinX + scaledBBoxWidth / 2);
      const topPx = stageAnchorY - scaledBBoxMinY;

      resolve({
        width: `${(scaledImgWidth / DUMMY_STAGE_WIDTH) * 100}%`,
        height: `${(scaledImgHeight / DUMMY_STAGE_HEIGHT) * 100}%`,
        left: `${(leftPx / DUMMY_STAGE_WIDTH) * 100}%`,
        top: `${(topPx / DUMMY_STAGE_HEIGHT) * 100}%`,
        position: 'absolute'
      });
    };
    img.onerror = () => resolve({});
    img.src = imageUrl;
  });
}

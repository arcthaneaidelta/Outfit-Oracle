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
      let minX_pixel = { x: canvas.width, y: 0 };
      let maxX_pixel = { x: 0, y: 0 };

      // Pass 1: Find main bounding box and sleeve tips
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 10) { 
            if (x < minX) { minX = x; minX_pixel = { x, y }; }
            if (x > maxX) { maxX = x; maxX_pixel = { x, y }; }
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (minX > maxX || minY > maxY) {
        resolve({}); 
        return;
      }

      const bboxWidth = maxX - minX;
      const bboxHeight = maxY - minY;
      
      let leftHalfMaxY = 0;
      let leftHalfMaxY_pixel = { x: 0, y: 0 };
      let rightHalfMaxY = 0;
      let rightHalfMaxY_pixel = { x: 0, y: 0 };
      
      const midX = minX + (bboxWidth / 2);

      // Pass 2: Find leg holes (lowest pixels in left/right halves)
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const alpha = data[(y * canvas.width + x) * 4 + 3];
          if (alpha > 10) {
            if (x <= midX && y > leftHalfMaxY) {
              leftHalfMaxY = y;
              leftHalfMaxY_pixel = { x, y };
            }
            if (x > midX && y > rightHalfMaxY) {
              rightHalfMaxY = y;
              rightHalfMaxY_pixel = { x, y };
            }
          }
        }
      }

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
        targetBBoxWidthPerc = 0.65;
        anchorYPerc = 0.88; 
      } else {
        targetBBoxWidthPerc = 0.85; 
        anchorYPerc = 0.16; 
        if (cat.includes('outerwear') || cat.includes('jacket')) {
          targetBBoxWidthPerc = 0.95;
          anchorYPerc = 0.15;
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

      // Calculate SVG Coordinates for the joints
      const joints = {};
      if (isBottom) {
        joints.leftLeg = { x: leftPx + (leftHalfMaxY_pixel.x * scale), y: topPx + (leftHalfMaxY_pixel.y * scale) };
        joints.rightLeg = { x: leftPx + (rightHalfMaxY_pixel.x * scale), y: topPx + (rightHalfMaxY_pixel.y * scale) };
      } else {
        joints.leftSleeve = { x: leftPx + (minX_pixel.x * scale), y: topPx + (minX_pixel.y * scale) };
        joints.rightSleeve = { x: leftPx + (maxX_pixel.x * scale), y: topPx + (maxX_pixel.y * scale) };
      }

      resolve({
        width: `${(scaledImgWidth / DUMMY_STAGE_WIDTH) * 100}%`,
        height: `${(scaledImgHeight / DUMMY_STAGE_HEIGHT) * 100}%`,
        left: `${(leftPx / DUMMY_STAGE_WIDTH) * 100}%`,
        top: `${(topPx / DUMMY_STAGE_HEIGHT) * 100}%`,
        position: 'absolute',
        joints // Pass joints data to the frontend
      });
    };
    img.onerror = () => resolve({});
    img.src = imageUrl;
  });
}

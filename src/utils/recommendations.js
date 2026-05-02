// ====================================================
// OUTFITORACLE — RECOMMENDATION ENGINE
// Scores outfits based on weather, occasion, and wear history
// ====================================================

export const OCCASIONS = ['Casual', 'Work', 'Formal', 'Party', 'Outdoor', 'Date', 'Sport', 'Any'];
export const SEASONS = ['spring', 'summer', 'autumn', 'winter', 'all'];

export function scoreOutfit(outfit, { weather, occasion, history, items }) {
  let score = 100;
  const reasons = [];

  // ---- OCCASION MATCH (0-30 pts) ----
  if (occasion && outfit.occasion) {
    if (outfit.occasion === 'Any' || outfit.occasion === occasion) {
      score += 30;
      reasons.push('Perfect for ' + occasion);
    } else {
      score -= 20;
    }
  }

  // ---- WEATHER/SEASON MATCH (0-25 pts) ----
  if (weather?.temp !== null && outfit.season) {
    const tempCat = getTempCategory(weather.temp);
    const seasonMatch = {
      hot: ['summer', 'all'],
      warm: ['spring', 'summer', 'all'],
      cool: ['autumn', 'spring', 'all'],
      cold: ['winter', 'autumn', 'all'],
      all: ['all'],
    }[tempCat] || [];

    if (seasonMatch.includes(outfit.season) || outfit.season === 'all') {
      score += 25;
      reasons.push('Season appropriate');
    } else {
      score -= 25;
      reasons.push('Not ideal for current weather');
    }
  }

  // ---- RECENCY PENALTY (-5 per recent wear, max -30) ----
  const recentWears = history
    .filter(h => h.outfitId === outfit.id)
    .slice(0, 6);

  const daysSinceLast = recentWears.length > 0
    ? Math.floor((Date.now() - toMs(recentWears[0].wornAt)) / 86400000)
    : 999;

  if (daysSinceLast < 1) { score -= 30; reasons.push('Worn today'); }
  else if (daysSinceLast < 3) { score -= 15; reasons.push('Worn recently'); }
  else if (daysSinceLast < 7) { score -= 5; }
  else if (daysSinceLast > 14) { score += 10; reasons.push('Fresh pick'); }

  // ---- COMPLETENESS CHECK ----
  const slotsFilled = [outfit.top, outfit.bottom, outfit.shoes, outfit.outerwear].filter(Boolean).length;
  if (slotsFilled >= 3) { score += 10; }
  if (outfit.accessory) { score += 5; }

  // ---- INVALID ITEMS PENALTY ----
  const itemIds = (items || []).map(i => i.id);
  const outfitItemIds = [outfit.top, outfit.bottom, outfit.shoes, outfit.outerwear, outfit.accessory].filter(Boolean);
  const missingItems = outfitItemIds.filter(id => !itemIds.includes(id));
  if (missingItems.length > 0) {
    score -= 50;
    reasons.push('Some items deleted');
  }

  return {
    ...outfit,
    score: Math.max(0, Math.min(100, score)),
    reasons,
    isValid: missingItems.length === 0,
  };
}

export function getRecommendations(outfits, context, limit = 6) {
  return outfits
    .map(o => scoreOutfit(o, context))
    .filter(o => o.isValid)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function getTempCategory(tempC) {
  if (tempC <= 5) return 'cold';
  if (tempC <= 15) return 'cool';
  if (tempC <= 25) return 'warm';
  return 'hot';
}

function toMs(val) {
  if (!val) return 0;
  if (val?.toDate) return val.toDate().getTime();
  if (typeof val === 'string') return new Date(val).getTime();
  return 0;
}

export function getCategoryEmoji(category) {
  const map = {
    top: '👕', bottom: '👖', dress: '👗', shoes: '👟',
    outerwear: '🧥', accessory: '💍', bag: '👜', hat: '🎩',
  };
  return map[category?.toLowerCase()] || '👔';
}

export const CATEGORIES = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'dress', label: 'Dress / Jumpsuit' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'bag', label: 'Bag' },
];

export const COLOR_OPTIONS = [
  { value: '#ffffff', label: 'White' },
  { value: '#000000', label: 'Black' },
  { value: '#808080', label: 'Grey' },
  { value: '#c4622d', label: 'Terracotta' },
  { value: '#8B4513', label: 'Brown' },
  { value: '#1a3a5c', label: 'Navy' },
  { value: '#4a90d9', label: 'Blue' },
  { value: '#2d6a4f', label: 'Green' },
  { value: '#d62828', label: 'Red' },
  { value: '#f4a261', label: 'Orange' },
  { value: '#e9c46a', label: 'Yellow' },
  { value: '#e76f51', label: 'Coral' },
  { value: '#c77dff', label: 'Purple' },
  { value: '#f8b4c8', label: 'Pink' },
  { value: '#a8dadc', label: 'Light Blue' },
  { value: '#606c38', label: 'Olive' },
];

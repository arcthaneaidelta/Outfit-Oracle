import time
from datetime import datetime

OCCASIONS = ['Casual', 'Work', 'Formal', 'Party', 'Outdoor', 'Date', 'Sport', 'Any']
SEASONS = ['spring', 'summer', 'autumn', 'winter', 'all']

CATEGORIES = [
    {'value': 'top', 'label': 'Top'},
    {'value': 'bottom', 'label': 'Bottom'},
    {'value': 'dress', 'label': 'Dress / Jumpsuit'},
    {'value': 'outerwear', 'label': 'Outerwear'},
    {'value': 'shoes', 'label': 'Shoes'},
    {'value': 'accessory', 'label': 'Accessory'},
    {'value': 'bag', 'label': 'Bag'},
]

def get_temp_category(temp_c):
    if temp_c <= 5: return 'cold'
    if temp_c <= 15: return 'cool'
    if temp_c <= 25: return 'warm'
    return 'hot'

def to_ms(val):
    if not val: return 0
    # Firebase Timestamp object in Python has .timestamp()
    if hasattr(val, 'timestamp'):
        return val.timestamp() * 1000
    if isinstance(val, str):
        try:
            return datetime.fromisoformat(val.replace('Z', '+00:00')).timestamp() * 1000
        except:
            return 0
    return 0

def score_outfit(outfit, context):
    weather = context.get('weather')
    occasion = context.get('occasion')
    history = context.get('history', [])
    items = context.get('items', [])
    
    score = 100
    reasons = []

    # ---- OCCASION MATCH (0-30 pts) ----
    if occasion and outfit.get('occasion'):
        if outfit['occasion'] == 'Any' or outfit['occasion'] == occasion:
            score += 30
            reasons.append(f'Perfect for {occasion}')
        else:
            score -= 20

    # ---- WEATHER/SEASON MATCH (0-25 pts) ----
    if weather and weather.get('temp') is not None and outfit.get('season'):
        temp_cat = get_temp_category(weather['temp'])
        season_match_map = {
            'hot': ['summer', 'all'],
            'warm': ['spring', 'summer', 'all'],
            'cool': ['autumn', 'spring', 'all'],
            'cold': ['winter', 'autumn', 'all'],
            'all': ['all'],
        }
        season_match = season_match_map.get(temp_cat, [])

        if outfit['season'] in season_match or outfit['season'] == 'all':
            score += 25
            reasons.append('Season appropriate')
        else:
            score -= 25
            reasons.append('Not ideal for current weather')

    # ---- RECENCY PENALTY ----
    recent_wears = [h for h in history if h.get('outfitId') == outfit.get('id')]
    # Sort by wornAt descending
    recent_wears.sort(key=lambda x: to_ms(x.get('wornAt')), reverse=True)
    recent_wears = recent_wears[:6]

    now_ms = time.time() * 1000
    days_since_last = 999
    if recent_wears:
        last_worn_ms = to_ms(recent_wears[0].get('wornAt'))
        days_since_last = int((now_ms - last_worn_ms) / 86400000)

    if days_since_last < 1:
        score -= 30
        reasons.append('Worn today')
    elif days_since_last < 3:
        score -= 15
        reasons.append('Worn recently')
    elif days_since_last < 7:
        score -= 5
    elif days_since_last > 14:
        score += 10
        reasons.append('Fresh pick')

    # ---- COMPLETENESS CHECK ----
    slots = [outfit.get('top'), outfit.get('bottom'), outfit.get('shoes'), outfit.get('outerwear')]
    slots_filled = len([s for s in slots if s])
    if slots_filled >= 3: score += 10
    if outfit.get('accessory'): score += 5

    # ---- INVALID ITEMS CHECK ----
    item_ids = [i.get('id') for i in items]
    outfit_item_ids = [outfit.get(k) for k in ['top', 'bottom', 'shoes', 'outerwear', 'accessory'] if outfit.get(k)]
    missing_items = [id for id in outfit_item_ids if id not in item_ids]
    
    is_valid = len(missing_items) == 0
    if not is_valid:
        score -= 50
        reasons.append('Some items deleted')

    return {
        **outfit,
        'score': max(0, min(100, score)),
        'reasons': reasons,
        'isValid': is_valid
    }

def get_recommendations(outfits, context, limit=6):
    scored = [score_outfit(o, context) for o in outfits]
    valid = [s for s in scored if s['isValid']]
    valid.sort(key=lambda x: x['score'], reverse=True)
    return valid[:limit]

def get_category_emoji(category):
    category = (category or "").lower()
    mapping = {
        'top': '👕', 'bottom': '👖', 'dress': '👗', 'shoes': '👟',
        'outerwear': '🧥', 'accessory': '💍', 'bag': '👜', 'hat': '🎩',
    }
    return mapping.get(category, '👔')

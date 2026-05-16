import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth
import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import BaseModel

# Import our logic
from logic import get_recommendations, get_category_emoji

load_dotenv()

import json

# Initialize Firebase Admin
service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
if service_account_json:
    # Use environment variable for production (Render/Railway)
    cred_dict = json.loads(service_account_json)
    cred = credentials.Certificate(cred_dict)
else:
    # Use local file for development
    cred = credentials.Certificate("serviceAccountKey.json")

firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Gemini
genai.configure(api_key=os.getenv("VITE_GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class WeatherData(BaseModel):
    temp: Optional[float] = None
    condition: Optional[str] = None

class RecommendationRequest(BaseModel):
    uid: str
    weather: Optional[WeatherData] = None
    occasion: str = "Any"

# --- Endpoints ---

@app.get("/")
async def root():
    return {"message": "OutfitOracle Python Backend API"}

@app.post("/api/recommendations")
async def recommendations(req: RecommendationRequest):
    try:
        # Fetch data from Firestore
        wardrobe_ref = db.collection('clothing_items').where('uid', '==', req.uid).stream()
        outfits_ref = db.collection('outfits').where('uid', '==', req.uid).stream()
        history_ref = db.collection('wear_history').where('uid', '==', req.uid).stream()

        wardrobe = [ {**doc.to_dict(), "id": doc.id} for doc in wardrobe_ref ]
        outfits = [ {**doc.to_dict(), "id": doc.id} for doc in outfits_ref ]
        history = [ {**doc.to_dict(), "id": doc.id} for doc in history_ref ]

        context = {
            "weather": req.weather.dict() if req.weather else None,
            "occasion": req.occasion,
            "history": history,
            "items": wardrobe
        }

        results = get_recommendations(outfits, context)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/advice")
async def ai_advice(prompt: str = Body(..., embed=True)):
    try:
        response = model.generate_content(prompt)
        return {"text": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# CRUD Proxies (Optional but good for a "Full Python Backend" claim)
@app.get("/api/wardrobe/{uid}")
async def get_wardrobe(uid: str):
    docs = db.collection('clothing_items').where('uid', '==', uid).stream()
    items = [ {**doc.to_dict(), "id": doc.id} for doc in docs ]
    # Sort by createdAt descending
    items.sort(key=lambda x: str(x.get('createdAt', '')), reverse=True)
    return items

@app.post("/api/wardrobe/{uid}")
async def add_item(uid: str, data: dict = Body(...)):
    data['uid'] = uid
    data['createdAt'] = firestore.SERVER_TIMESTAMP
    data['wearCount'] = 0
    update_time, doc_ref = db.collection('clothing_items').add(data)
    return {"id": doc_ref.id}

@app.patch("/api/wardrobe/{item_id}")
async def update_item(item_id: str, data: dict = Body(...)):
    db.collection('clothing_items').document(item_id).update(data)
    return {"success": True}

@app.delete("/api/wardrobe/{item_id}")
async def delete_item(item_id: str):
    db.collection('clothing_items').document(item_id).delete()
    return {"success": True}

# --- Outfits ---
@app.get("/api/outfits/{uid}")
async def get_outfits(uid: str):
    docs = db.collection('outfits').where('uid', '==', uid).stream()
    outfits = [ {**doc.to_dict(), "id": doc.id} for doc in docs ]
    outfits.sort(key=lambda x: str(x.get('createdAt', '')), reverse=True)
    return outfits

@app.post("/api/outfits/{uid}")
async def save_outfit(uid: str, data: dict = Body(...)):
    data['uid'] = uid
    data['createdAt'] = firestore.SERVER_TIMESTAMP
    data['isFavorite'] = False
    data['wearCount'] = 0
    update_time, doc_ref = db.collection('outfits').add(data)
    return {"id": doc_ref.id}

@app.patch("/api/outfits/{id}")
async def update_outfit(id: str, data: dict = Body(...)):
    db.collection('outfits').document(id).update(data)
    return {"success": True}

@app.delete("/api/outfits/{id}")
async def delete_outfit(id: str):
    db.collection('outfits').document(id).delete()
    return {"success": True}

# --- Planner ---
@app.get("/api/planner/{uid}")
async def get_planner(uid: str):
    docs = db.collection('planner').where('uid', '==', uid).stream()
    entries = [ {**doc.to_dict(), "id": doc.id} for doc in docs ]
    entries.sort(key=lambda x: x.get('date', ''), reverse=True)
    return entries

@app.post("/api/planner/{uid}")
async def plan_outfit(uid: str, data: dict = Body(...)):
    # Check if exists
    existing = db.collection('planner').where('uid', '==', uid).where('date', '==', data['date']).stream()
    existing_docs = list(existing)
    if existing_docs:
        existing_docs[0].reference.update({"outfitId": data['outfitId'], "outfitName": data['outfitName'], "updatedAt": firestore.SERVER_TIMESTAMP})
        return {"id": existing_docs[0].id}
    
    data['uid'] = uid
    data['createdAt'] = firestore.SERVER_TIMESTAMP
    _, doc_ref = db.collection('planner').add(data)
    return {"id": doc_ref.id}

@app.delete("/api/planner/{id}")
async def delete_plan(id: str):
    db.collection('planner').document(id).delete()
    return {"success": True}

# --- History ---
@app.get("/api/history/{uid}")
async def get_history(uid: str):
    docs = db.collection('wear_history').where('uid', '==', uid).stream()
    history = [ {**doc.to_dict(), "id": doc.id} for doc in docs ]
    history.sort(key=lambda x: str(x.get('wornAt', '')), reverse=True)
    return history

@app.post("/api/history/{uid}")
async def log_wear(uid: str, data: dict = Body(...)):
    data['uid'] = uid
    data['wornAt'] = firestore.SERVER_TIMESTAMP
    db.collection('wear_history').add(data)
    # Update outfit wear count
    outfit_id = data.get('outfitId')
    if outfit_id:
        ref = db.collection('outfits').document(outfit_id)
        # Simple increment logic (could be more robust)
        outfit_doc = ref.get()
        if outfit_doc.exists:
            count = outfit_doc.to_dict().get('wearCount', 0)
            ref.update({"wearCount": count + 1})
    return {"success": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

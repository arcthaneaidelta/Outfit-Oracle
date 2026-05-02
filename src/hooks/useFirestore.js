import { useState, useEffect, useCallback } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// ============================================================
// CLOUDINARY CONFIG
// 1. Go to https://cloudinary.com and create a free account
// 2. In your Cloudinary dashboard → Settings → Upload → Upload Presets
//    → Add upload preset → Set "Signing Mode" to UNSIGNED → Save
// 3. Replace the two values below with your own:
// ============================================================
const CLOUDINARY_CLOUD_NAME = 'dnzec9e7e'; 
const CLOUDINARY_UPLOAD_PRESET = 'outfitoracle_unsigned';

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'outfitoracle');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Cloudinary upload failed');
  }

  const data = await res.json();
  return data.secure_url; // permanent HTTPS image URL
}

// Helper: sort docs by a timestamp field descending (client-side, avoids composite index requirement)
const sortDesc = (arr, field) =>
  [...arr].sort((a, b) => {
    const aVal = a[field]?.toDate?.() ?? new Date(a[field] ?? 0);
    const bVal = b[field]?.toDate?.() ?? new Date(b[field] ?? 0);
    return bVal - aVal;
  });

// ---- WARDROBE ----

export function useWardrobe(uid) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    // No orderBy — avoids needing Firestore composite indexes. Sorted client-side below.
    const q = query(collection(db, 'clothing_items'), where('uid', '==', uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setItems(sortDesc(docs, 'createdAt'));
        setLoading(false);
      },
      (error) => {
        console.error('Wardrobe fetch error:', error.message);
        setItems([]);
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  const addItem = useCallback(async (data, imageFile) => {
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile);
    }
    return addDoc(collection(db, 'clothing_items'), {
      uid,
      ...data,
      imageUrl,
      wearCount: 0,
      createdAt: serverTimestamp(),
    });
  }, [uid]);

  const updateItem = useCallback((id, data) =>
    updateDoc(doc(db, 'clothing_items', id), data), []);

  const deleteItem = useCallback(async (item) => {
    // Note: Cloudinary images are not deleted here (requires server-side API call with secret).
    // They will remain in your Cloudinary media library but won't appear in the app.
    await deleteDoc(doc(db, 'clothing_items', item.id));
  }, []);

  return { items, loading, addItem, updateItem, deleteItem };
}

// ---- OUTFITS ----

export function useOutfits(uid) {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const q = query(collection(db, 'outfits'), where('uid', '==', uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setOutfits(sortDesc(docs, 'createdAt'));
        setLoading(false);
      },
      (error) => {
        console.error('Outfits fetch error:', error.message);
        setOutfits([]);
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  const saveOutfit = useCallback(async (data) => {
    return addDoc(collection(db, 'outfits'), {
      uid,
      ...data,
      isFavorite: false,
      wearCount: 0,
      createdAt: serverTimestamp(),
    });
  }, [uid]);

  const updateOutfit = useCallback((id, data) =>
    updateDoc(doc(db, 'outfits', id), data), []);

  const deleteOutfit = useCallback(async (id) => {
    await deleteDoc(doc(db, 'outfits', id));
  }, []);

  const toggleFavorite = useCallback((id, current) =>
    updateDoc(doc(db, 'outfits', id), { isFavorite: !current }), []);

  return { outfits, loading, saveOutfit, updateOutfit, deleteOutfit, toggleFavorite };
}

// ---- PLANNER ----

export function usePlanner(uid) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const q = query(collection(db, 'planner'), where('uid', '==', uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort by date descending (date is a string like "2026-02-21", lexicographic sort works)
        setEntries(docs.sort((a, b) => (b.date || '').localeCompare(a.date || '')));
        setLoading(false);
      },
      (error) => {
        console.error('Planner fetch error:', error.message);
        setEntries([]);
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  const planOutfit = useCallback(async (date, outfitId, outfitName) => {
    const existing = entries.find(e => e.date === date);
    if (existing) {
      return updateDoc(doc(db, 'planner', existing.id), { outfitId, outfitName, updatedAt: serverTimestamp() });
    }
    return addDoc(collection(db, 'planner'), {
      uid, date, outfitId, outfitName, createdAt: serverTimestamp(),
    });
  }, [uid, entries]);

  const removePlan = useCallback((id) =>
    deleteDoc(doc(db, 'planner', id)), []);

  return { entries, loading, planOutfit, removePlan };
}

// ---- WEAR HISTORY ----

export function useWearHistory(uid) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const q = query(collection(db, 'wear_history'), where('uid', '==', uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setHistory(sortDesc(docs, 'wornAt'));
        setLoading(false);
      },
      (error) => {
        console.error('History fetch error:', error.message);
        setHistory([]);
        setLoading(false);
      }
    );
    return unsub;
  }, [uid]);

  const logWear = useCallback(async (outfitId, outfitName, itemIds = []) => {
    await addDoc(collection(db, 'wear_history'), {
      uid, outfitId, outfitName, itemIds,
      wornAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'outfits', outfitId), {
      wearCount: (history.filter(h => h.outfitId === outfitId).length + 1),
    });
  }, [uid, history]);

  return { history, loading, logWear };
}

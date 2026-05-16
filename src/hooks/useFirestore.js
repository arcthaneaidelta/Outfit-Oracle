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

import { apiClient } from '../utils/apiClient';

// ---- WARDROBE ----

export function useWardrobe(uid) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!uid) return;
    try {
      const data = await apiClient.get(`/wardrobe/${uid}`);
      setItems(data);
    } catch (err) {
      console.error('Wardrobe fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchItems();
    // In a real production app, we'd use WebSockets for real-time.
    // For this transition, we'll refetch on operations.
  }, [fetchItems]);

  const addItem = useCallback(async (data, imageFile) => {
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile);
    }
    const res = await apiClient.post(`/wardrobe/${uid}`, {
      ...data,
      imageUrl,
    });
    fetchItems(); // Refresh list
    return res;
  }, [uid, fetchItems]);

  const updateItem = useCallback(async (id, data) => {
    await apiClient.patch(`/wardrobe/${id}`, data);
    fetchItems();
  }, [fetchItems]);

  const deleteItem = useCallback(async (item) => {
    await apiClient.delete(`/wardrobe/${item.id}`);
    fetchItems();
  }, [fetchItems]);

  return { items, loading, addItem, updateItem, deleteItem };
}

// ---- OUTFITS ----

export function useOutfits(uid) {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOutfits = useCallback(async () => {
    if (!uid) return;
    try {
      const data = await apiClient.get(`/outfits/${uid}`);
      setOutfits(data);
    } catch (err) {
      console.error('Outfits fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchOutfits();
  }, [fetchOutfits]);

  const saveOutfit = useCallback(async (data) => {
    const res = await apiClient.post(`/outfits/${uid}`, data);
    fetchOutfits();
    return res;
  }, [uid, fetchOutfits]);

  const updateOutfit = useCallback(async (id, data) => {
    await apiClient.patch(`/outfits/${id}`, data);
    fetchOutfits();
  }, [fetchOutfits]);

  const deleteOutfit = useCallback(async (id) => {
    await apiClient.delete(`/outfits/${id}`);
    fetchOutfits();
  }, [fetchOutfits]);

  const toggleFavorite = useCallback(async (id, current) => {
    await apiClient.patch(`/outfits/${id}`, { isFavorite: !current });
    fetchOutfits();
  }, [fetchOutfits]);

  return { outfits, loading, saveOutfit, updateOutfit, deleteOutfit, toggleFavorite };
}

// ---- PLANNER ----

export function usePlanner(uid) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlanner = useCallback(async () => {
    if (!uid) return;
    try {
      const data = await apiClient.get(`/planner/${uid}`);
      setEntries(data);
    } catch (err) {
      console.error('Planner fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchPlanner();
  }, [fetchPlanner]);

  const planOutfit = useCallback(async (date, outfitId, outfitName) => {
    const res = await apiClient.post(`/planner/${uid}`, { date, outfitId, outfitName });
    fetchPlanner();
    return res;
  }, [uid, fetchPlanner]);

  const removePlan = useCallback(async (id) => {
    await apiClient.delete(`/planner/${id}`); // Need endpoint for this?
    fetchPlanner();
  }, [fetchPlanner]);

  return { entries, loading, planOutfit, removePlan };
}

// ---- WEAR HISTORY ----

export function useWearHistory(uid) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!uid) return;
    try {
      const data = await apiClient.get(`/history/${uid}`);
      setHistory(data);
    } catch (err) {
      console.error('History fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const logWear = useCallback(async (outfitId, outfitName, itemIds = []) => {
    await apiClient.post(`/history/${uid}`, { outfitId, outfitName, itemIds });
    fetchHistory();
  }, [uid, fetchHistory]);

  return { history, loading, logWear };
}

// @ts-nocheck
// ============================================================
// 🔥 FIREBASE CONFIG & JOURNAL FUNCTIONS
// ============================================================

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

// ============================================================
// 🔑 YOUR FIREBASE CONFIG (filled in from your screenshot)
// ============================================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ============================================================
// 🔐 YOUR DATABASE SECRET KEY (from Step 3 rules)
// ⚠️ CHANGE THIS to match what you put in Firestore Rules!
// ============================================================
const DB_OWNER_KEY = import.meta.env.VITE_DB_OWNER_KEY;

// ============================================================
// 🚀 INITIALIZE FIREBASE
// ============================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// 📚 JOURNAL FUNCTIONS
// ============================================================

// 📖 LISTEN for journal changes (real-time sync)
export function subscribeToJournal(
  callback: (entries: Record<string, any>) => void
) {
  const journalRef = collection(db, "journal");
  return onSnapshot(
    journalRef,
    (snapshot) => {
      const entries: Record<string, any> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const { ownerKey, ...safeData } = data;
        entries[docSnap.id] = safeData;
      });
      callback(entries);
    },
    (error) => {
      console.error("Firebase journal listen error:", error);
    }
  );
}

// ✍️ SAVE a journal entry
export async function saveJournalEntry(
  date: string,
  mood: string,
  text: string
) {
  try {
    const entryRef = doc(db, "journal", date);
    await setDoc(entryRef, {
      mood,
      text,
      savedAt: new Date().toISOString(),
      ownerKey: DB_OWNER_KEY,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Firebase save error:", error);
    return { success: false, error: error.message };
  }
}

// 🗑️ DELETE a journal entry
export async function deleteJournalEntry(date: string) {
  try {
    const entryRef = doc(db, "journal", date);
    await deleteDoc(entryRef);
    return { success: true };
  } catch (error: any) {
    console.error("Firebase delete error:", error);
    return { success: false, error: error.message };
  }
}
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  FieldValue,
} from 'firebase/firestore';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  userId: string;
  messages: Message[];
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export const saveChatSession = async (userId: string, messages: Message[]) => {
  try {
    const sessionsRef = collection(db, 'sessions');
    const docRef = await addDoc(sessionsRef, {
      userId,
      messages,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving session: ', error);
    return null;
  }
};

export const getUserSessions = async (userId: string) => {
  try {
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching sessions: ', error);
    return [];
  }
};

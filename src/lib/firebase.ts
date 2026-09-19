import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const customDbId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
export const db = customDbId 
  ? getFirestore(app, customDbId) 
  : getFirestore(app);
export const auth = getAuth(app);
export default app;

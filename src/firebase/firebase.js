
import "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA4gm66GFRsjmANQrukL79wb0lAX85Eayg",
  authDomain: "uploadingfile-752c1.firebaseapp.com",
  projectId: "uploadingfile-752c1",
  storageBucket: "uploadingfile-752c1.appspot.com",
  messagingSenderId: "66547194848",
  appId: "1:66547194848:web:b65e46ef7710069769e985"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 

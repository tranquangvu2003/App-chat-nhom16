import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage,ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA4gm66GFRsjmANQrukL79wb0lAX85Eayg",
  authDomain: "uploadingfile-752c1.firebaseapp.com",
  projectId: "uploadingfile-752c1",
  storageBucket: "uploadingfile-752c1.appspot.com",
  messagingSenderId: "66547194848",
  appId: "1:66547194848:web:b65e46ef7710069769e985"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()

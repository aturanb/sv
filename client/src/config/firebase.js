// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import {getAuth, connectAuthEmulator} from "firebase/auth";
import {getFirestore, connectFirestoreEmulator} from "firebase/firestore"
import {getDatabase, connectDatabaseEmulator} from "firebase/database"
import {getStorage, connectStorageEmulator} from "firebase/storage"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWZxWOfWx712E9PwnLouX10DQWNLIS-NY",
  authDomain: "mucho-mango-db.firebaseapp.com",
  projectId: "mucho-mango-db",
  storageBucket: "mucho-mango-db.appspot.com",
  messagingSenderId: "816670486797",
  appId: "1:816670486797:web:fe1f837cfd38cde05f8044"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const fsdb = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

//Connect to Emulator
connectStorageEmulator(storage, "127.0.0.1", 9199);
connectDatabaseEmulator(rtdb, "127.0.0.1", 9001);
connectFirestoreEmulator(fsdb, '127.0.0.1', 8081);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);
connectAuthEmulator(auth, "http://127.0.0.1:9099");


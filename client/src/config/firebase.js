// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
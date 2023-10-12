// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
import { getDatabase, onValue, ref, set } from "firebase/database";

import { firebase } from "@firebase/app";
import "@firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD9i52Ee7zbN22xnXBTKH1iMaJI8G1N1rQ",
  authDomain: "date3723.firebaseapp.com",
  projectId: "date3723",
  storageBucket: "date3723.appspot.com",
  messagingSenderId: "852728392912",
  appId: "1:852728392912:web:57ec5576677a3c5a1742d5"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);



const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const db = getFirestore(app);
const realdb = getDatabase(app);

export { auth, db, storage, firestore, realdb };



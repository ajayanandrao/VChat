// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
import { getDatabase, onValue, ref, set } from "firebase/database";

import { firebase } from "@firebase/app";
import "@firebase/firestore";


// const firebaseConfig = {
//   apiKey: "AIzaSyD9i52Ee7zbN22xnXBTKH1iMaJI8G1N1rQ",
//   authDomain: "date3723.firebaseapp.com",
//   projectId: "date3723",
//   storageBucket: "date3723.appspot.com",
//   messagingSenderId: "852728392912",
//   appId: "1:852728392912:web:57ec5576677a3c5a1742d5"
// };

const firebaseConfig = {
  apiKey: "AIzaSyA9a35tXxnbm1E3TMN7edzw03HEG9cjFGY",
  authDomain: "hosting-c26ea.firebaseapp.com",
  projectId: "hosting-c26ea",
  storageBucket: "hosting-c26ea.appspot.com",
  messagingSenderId: "492233370812",
  appId: "1:492233370812:web:f4d7d98bd15b40f50db4b9"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);



const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const db = getFirestore(app);
const realdb = getDatabase(app);

export { auth, db, storage, firestore, realdb };



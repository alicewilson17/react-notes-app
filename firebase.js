
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoqlvlaKaiX00klWrb6R35yE1Ub9j3O40",
  authDomain: "react-notes-762fa.firebaseapp.com",
  projectId: "react-notes-762fa",
  storageBucket: "react-notes-762fa.appspot.com",
  messagingSenderId: "955415327215",
  appId: "1:955415327215:web:96662400b3f08d5683c61a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
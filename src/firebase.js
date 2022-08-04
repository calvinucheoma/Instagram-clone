import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDOSk7VwLh-PFN60ANWTriwb20iCRr5qoc",
  authDomain: "chuks-instagram-clone.firebaseapp.com",
  projectId: "chuks-instagram-clone",
  storageBucket: "chuks-instagram-clone.appspot.com",
  messagingSenderId: "871507285455",
  appId: "1:871507285455:web:c146bc83ef8508c3d2eeba"
};



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();

const storage = getStorage(app);

export {auth, storage};

export default db;
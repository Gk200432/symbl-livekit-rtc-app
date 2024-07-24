// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8A50mMVwEYFjx0Nb93AbAHynsvujBG0A",
  authDomain: "videoconference-94682.firebaseapp.com",
  projectId: "videoconference-94682",
  storageBucket: "videoconference-94682.appspot.com",
  messagingSenderId: "173135536625",
  appId: "1:173135536625:web:bb874135804d818fcea450",
  measurementId: "G-KDKRMZ7RY0"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

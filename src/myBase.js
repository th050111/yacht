import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBHj1FgZDQHDL1bnwNhlpI6fHrILEktFzk",
  authDomain: "yacht-3d84f.firebaseapp.com",
  projectId: "yacht-3d84f",
  storageBucket: "yacht-3d84f.appspot.com",
  messagingSenderId: "574985103623",
  appId: "1:574985103623:web:97339ef1519ffb574dfda2"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export const authService = firebase.auth();
export const dbService = firebase.firestore();
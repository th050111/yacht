import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyC24qYjVPwXfYVY6urZ2TvR2zEN1IE6E0Q",
    authDomain: "yacht-d950e.firebaseapp.com",
    projectId: "yacht-d950e",
    storageBucket: "yacht-d950e.appspot.com",
    messagingSenderId: "119190672911",
    appId: "1:119190672911:web:fc016d05661abe85bf357a"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export const authService = firebase.auth();
export const dbService = firebase.firestore();
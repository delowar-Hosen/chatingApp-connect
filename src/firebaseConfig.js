// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlXiFMD7VsOKzI1yeK8f8CwLVKbypjQro",
  authDomain: "chating-app-70406.firebaseapp.com",
  projectId: "chating-app-70406",
  storageBucket: "chating-app-70406.appspot.com",
  messagingSenderId: "1046197334112",
  appId: "1:1046197334112:web:25b2312ba87cdc1665d305",
  measurementId: "G-0W1QFFVCJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
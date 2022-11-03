import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyCILscHc6TSYZt6hrFWyjKkalcuyugjAkI",
  authDomain: "mobiiliohjelmointi-lopputyo.firebaseapp.com",
  projectId: "mobiiliohjelmointi-lopputyo",
  storageBucket: "mobiiliohjelmointi-lopputyo.appspot.com",
  messagingSenderId: "652716539602",
  appId: "1:652716539602:web:9e1331e1bc44718026370b"
};

const app = initializeApp(firebaseConfig);


export default app;
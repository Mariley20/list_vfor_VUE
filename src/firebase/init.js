// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAsKWiuciMaLYBbB35kApxsHKx8wilbwSw',
  authDomain: 'southern-cotiza.firebaseapp.com',
  projectId: 'southern-cotiza',
  storageBucket: 'southern-cotiza.appspot.com',
  messagingSenderId: '498332495728',
  appId: '1:498332495728:web:938c0a67ec3c77e43b29b5',
  measurementId: 'G-KZ059N7NXJ'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db

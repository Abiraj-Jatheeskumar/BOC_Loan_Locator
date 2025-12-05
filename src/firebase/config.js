// Firebase Configuration
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Click "Add app" → Web app (</> icon)
// 4. Register your app with a nickname
// 5. Copy the firebaseConfig object from the console
// 6. Replace the placeholder config below with your actual config
// 7. Enable Firestore Database:
//    - Go to Firestore Database in Firebase Console
//    - Click "Create Database"
//    - Choose "Start in test mode" (for development)
//    - Select your region
// 8. Set Firestore Rules (for production):
//    - Go to Firestore → Rules tab
//    - Use the rules provided at the bottom of this file

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu-ObTcOdNxXBBpvkxYT5bGDf_PXTNSWA",
  authDomain: "loan-locator.firebaseapp.com",
  projectId: "loan-locator",
  storageBucket: "loan-locator.firebasestorage.app",
  messagingSenderId: "185732939612",
  appId: "1:185732939612:web:611e02e251668260c58b99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Collection names
export const COLLECTIONS = {
  LOANS: 'loans',
  RANGES: 'ranges',
  METADATA: 'metadata'
};

/*
FIRESTORE SECURITY RULES (Copy to Firestore Console → Rules):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to everyone (for search functionality)
    match /loans/{document=**} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    match /ranges/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /metadata/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

FOR DEVELOPMENT (Open access - use only for testing):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
*/

export default app;

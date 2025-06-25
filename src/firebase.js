// src/firebase.js  – *client-side only*
import { initializeApp } from 'firebase/app';
import { getAnalytics }  from 'firebase/analytics';

// ✅  these credentials are correct for project architect-lab-bf587
const firebaseConfig = {
  apiKey:            'AIzaSyAckLboHQ6LPR5YTHekXyIbh8SEHDCX0lc',
  authDomain:        'architect-lab-bf587.firebaseapp.com',
  projectId:         'architect-lab-bf587',
  storageBucket:     'architect-lab-bf587.appspot.com',   //  ← “appspot.com” is the standard domain
  messagingSenderId: '252773975169',
  appId:             '1:252773975169:web:01a538155e3d78c5443980',
  measurementId:     'G-9MBRWCRY4W'
};

// initialise & export
const app       = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

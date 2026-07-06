import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDnQJkCI1rUvemQelhIdUIcvdU5yNtqdz0",
  authDomain: "moire-e5e01.firebaseapp.com",
  databaseURL: "https://moire-e5e01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "moire-e5e01",
  storageBucket: "moire-e5e01.firebasestorage.app",
  messagingSenderId: "1009318864302",
  appId: "1:1009318864302:web:ae94d69d2ea99892be543f"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export function setPresence(userId, isHere) {
  set(ref(db, 'presence/' + userId), isHere);
}

export function listenPresence(callback) {
  onValue(ref(db, 'presence'), snapshot => {
    callback(snapshot.val() || {});
  });
}

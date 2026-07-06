import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';

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

export function addLetter(text) {
  push(ref(db, 'letterbox'), { text, time: Date.now() });
}

export function listenLetters(callback) {
  onValue(ref(db, 'letterbox'), snapshot => {
    const val = snapshot.val() || {};
    callback(Object.values(val));
  });
}

export function setPlushieHugged(hugged) {
  set(ref(db, 'plushie/hugged'), hugged);
}

export function listenPlushie(callback) {
  onValue(ref(db, 'plushie'), snapshot => {
    callback(snapshot.val()?.hugged || false);
  });
}

export function setCandleLit(lit) {
  set(ref(db, 'candle/lit'), lit);
}
export function listenCandle(callback) {
  onValue(ref(db, 'candle'), snapshot => callback(snapshot.val()?.lit ?? true));
}

export function setMilestoneUnlocked(date) {
  set(ref(db, 'milestone/unlockDate'), date);
}

export function setFlowerPlaced(placed) {
  set(ref(db, 'flower/placed'), placed);
}
export function listenFlower(callback) {
  onValue(ref(db, 'flower'), snapshot => callback(snapshot.val()?.placed ?? true));
}

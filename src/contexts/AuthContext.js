import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
export const AuthContext = createContext();

const app = initializeApp({
  apiKey: "AIzaSyChoIgrlo14OdGL31K_vpQiiZxwPRrfU3U",
  authDomain: "all-chat-30558.firebaseapp.com",
  projectId: "all-chat-30558",
  storageBucket: "all-chat-30558.appspot.com",
  messagingSenderId: "814348582582",
  appId: "1:814348582582:web:847364f5310c760a51b017",
  measurementId: "G-YJF9RQK9W0",
});
const auth = getAuth();
const db = getFirestore();
const analytics = getAnalytics(app);

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);
  const [userCode, setUserCode] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    signInAnonymously(auth)
      .then(async (data) => {
        const { uid } = data.user;
        const ref = doc(db, "users", uid);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
          setName(docSnap.data().name);
          setUserCode(docSnap.data().userCode);
        } else {
          const responseAdj = await fetch(
            "https://random-word-form.herokuapp.com/random/adjective",
            { method: "get" }
          );
          const [adjective] = await responseAdj.json();
          const responseAnim = await fetch(
            "https://random-word-form.herokuapp.com/random/animal",
            { method: "get" }
          );
          const [animal] = await responseAnim.json();
          const newName = `${adjective} ${animal}`;
          const newCode = Math.floor(1000 + Math.random() * 9000);
          setName(newName);
          setUserCode(newCode);

          await setDoc(doc(db, "users", uid), {
            createdAt: serverTimestamp(),
            name: newName,
            userCode: newCode,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setError(`${error.code} : ${error.message}`);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ db, analytics, name, userCode, error, user }}
    >
      {user && children}
    </AuthContext.Provider>
  );
};

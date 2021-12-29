import React, { useEffect, useState } from "react";
import scrollPolyfill from "scroll-polyfill";
import useAuth from "./hooks/useAuth";
import ChatRoom from "./components/ChatRoom";
import "./css/App.css";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, limit, query } from "firebase/firestore";
import Loader from "./components/Loader";
import WelcomeScreen from "./components/WelcomeScreen";

function App() {
  const { db, user, showWelcome, loading } = useAuth();
  const [newUser] = useCollectionData(query(collection(db, "users"), limit(1)));
  const [announcement, setAnnouncement] = useState(false);

  // initialize smooth scrolling on safari
  useEffect(() => {
    scrollPolyfill();
  }, []);

  // checks when a new user has been created
  useEffect(() => {
    if (!newUser && typeof newUser === "object") return;
    setAnnouncement(true);
    setTimeout(() => setAnnouncement(false), 5000);
  }, [newUser]);

  if (loading) return <Loader />;

  if (showWelcome) {
    return <WelcomeScreen />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>/allchat</h1>
        {newUser && announcement && (
          <div className="new-user-announcement">
            {newUser[0].name} just joined for the first time!
          </div>
        )}
      </header>
      <section>{user ? <ChatRoom /> : <Loader />}</section>
    </div>
  );
}

export default App;
